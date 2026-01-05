from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.shortcuts import get_object_or_404
import razorpay
import hmac
import hashlib
import uuid
from .models import PaymentOrder, OrderItem, Payment, Transaction
from .serializers import (
    PaymentOrderSerializer, CreateOrderSerializer, PaymentSerializer,
    RazorpayOrderSerializer, RazorpayPaymentVerificationSerializer
)
from apps.products.models import Product

class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Add user to validated data
                validated_data = serializer.validated_data
                validated_data['user'] = request.user
                
                # Create order
                order = serializer.create(validated_data)
                
                # Create Razorpay order if payment method is razorpay
                if order.payment_method == 'razorpay':
                    client = razorpay.Client(
                        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
                    )
                    
                    razorpay_order = client.order.create({
                        'amount': int(order.total_amount * 100),  # Convert to paise
                        'currency': 'INR',
                        'receipt': order.order_number,
                        'payment_capture': 1
                    })
                    
                    order.razorpay_order_id = razorpay_order['id']
                    order.save()
                
                # Create payment record
                payment = Payment.objects.create(
                    order=order,
                    payment_id=f"PAY_{uuid.uuid4().hex[:12].upper()}",
                    amount=order.total_amount,
                    payment_method=order.payment_method,
                    razorpay_order_id=order.razorpay_order_id
                )
                
                response_data = {
                    'order': PaymentOrderSerializer(order).data,
                    'razorpay_order_id': order.razorpay_order_id
                }
                
                return Response(response_data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_payment(request):
    """Verify Razorpay payment"""
    serializer = RazorpayPaymentVerificationSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        order_id = serializer.validated_data['order_id']
        razorpay_order_id = serializer.validated_data['razorpay_order_id']
        razorpay_payment_id = serializer.validated_data['razorpay_payment_id']
        razorpay_signature = serializer.validated_data['razorpay_signature']
        
        # Get order
        order = get_object_or_404(PaymentOrder, id=order_id, user=request.user)
        
        # Verify signature
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        
        # Generate signature comparison
        generated_signature = hmac.new(
            bytes(settings.RAZORPAY_KEY_SECRET, 'utf-8'),
            bytes(f"{razorpay_order_id}|{razorpay_payment_id}", 'utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != razorpay_signature:
            return Response(
                {'error': 'Invalid payment signature'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update order
        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature
        order.payment_status = 'paid'
        order.status = 'confirmed'
        order.save()
        
        # Update payment
        payment = Payment.objects.get(order=order)
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = 'completed'
        payment.save()
        
        # Create transaction record
        Transaction.objects.create(
            payment=payment,
            transaction_id=razorpay_payment_id,
            transaction_type='payment',
            amount=order.total_amount,
            status='completed',
            gateway_response={
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
        )
        
        return Response({
            'message': 'Payment verified successfully',
            'order': PaymentOrderSerializer(order).data
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

class OrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = PaymentOrder.objects.filter(user=request.user)
        serializer = PaymentOrderSerializer(orders, many=True)
        return Response(serializer.data)

class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(PaymentOrder, id=order_id, user=request.user)
        serializer = PaymentOrderSerializer(order)
        return Response(serializer.data)

    def patch(self, request, order_id):
        """Update order status (for admin use)"""
        order = get_object_or_404(PaymentOrder, id=order_id)
        
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        status = request.data.get('status')
        if status in dict(PaymentOrder.ORDER_STATUS_CHOICES):
            order.status = status
            order.save()
            return Response(PaymentOrderSerializer(order).data)
        
        return Response(
            {'error': 'Invalid status'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_cod_order(request):
    """Create Cash on Delivery order"""
    data = request.data.copy()
    data['payment_method'] = 'cod'
    
    serializer = CreateOrderSerializer(data=data)
    if serializer.is_valid():
        try:
            validated_data = serializer.validated_data
            validated_data['user'] = request.user
            
            # Create order
            order = serializer.create(validated_data)
            
            # Update order status for COD
            order.payment_status = 'pending'  # Will be paid on delivery
            order.status = 'confirmed'
            order.save()
            
            # Create payment record
            payment = Payment.objects.create(
                order=order,
                payment_id=f"COD_{uuid.uuid4().hex[:12].upper()}",
                amount=order.total_amount,
                payment_method='cod',
                status='pending'
            )
            
            return Response(
                PaymentOrderSerializer(order).data, 
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_history(request):
    """Get payment history for the user"""
    payments = Payment.objects.filter(order__user=request.user)
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)
