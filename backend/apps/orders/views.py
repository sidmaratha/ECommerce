from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from decimal import Decimal
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer,
    OrderCreateSerializer,
    OrderUpdateSerializer
)
from apps.cart.models import Cart, CartItem


class OrderListView(generics.ListAPIView):
    """
    List user's orders.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related(
            'items', 'shipping_address', 'billing_address'
        )


class OrderDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific order.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_admin:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)


class OrderCreateView(generics.CreateAPIView):
    """
    Create an order from cart.
    """
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get user's cart
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not cart.items.exists():
            return Response(
                {'error': 'Cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get addresses
        shipping_address = request.user.addresses.get(
            id=serializer.validated_data['shipping_address_id']
        )
        billing_address = request.user.addresses.get(
            id=serializer.validated_data.get('billing_address_id', shipping_address.id)
        )
        
        # Calculate totals
        subtotal = cart.total_price
        tax = subtotal * Decimal('0.10')  # 10% tax (adjust as needed)
        shipping_cost = Decimal('10.00')  # Fixed shipping (adjust as needed)
        total = subtotal + tax + shipping_cost
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            shipping_address=shipping_address,
            billing_address=billing_address,
            subtotal=subtotal,
            tax=tax,
            shipping_cost=shipping_cost,
            total=total,
            notes=serializer.validated_data.get('notes', '')
        )
        
        # Create order items and update product stock
        for cart_item in cart.items.all():
            product = cart_item.product
            
            # Check stock availability
            if cart_item.quantity > product.stock_quantity:
                order.delete()
                return Response(
                    {'error': f'Insufficient stock for {product.name}.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create order item
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_sku=product.sku,
                quantity=cart_item.quantity,
                price=product.price,
                subtotal=cart_item.subtotal
            )
            
            # Update product stock
            product.stock_quantity -= cart_item.quantity
            product.save()
        
        # Clear cart
        cart.items.all().delete()
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderUpdateView(generics.UpdateAPIView):
    """
    Update order status (admin only).
    """
    queryset = Order.objects.all()
    serializer_class = OrderUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.user.is_admin:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_order(request, pk):
    """
    Cancel an order (user can only cancel pending orders).
    """
    try:
        order = Order.objects.get(pk=pk, user=request.user)
        
        if order.status not in ['pending', 'processing']:
            return Response(
                {'error': 'Only pending or processing orders can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Restore product stock
        for item in order.items.all():
            if item.product:
                item.product.stock_quantity += item.quantity
                item.product.save()
        
        order.status = 'cancelled'
        order.payment_status = 'refunded'
        order.save()
        
        return Response({'message': 'Order cancelled successfully.'})
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

