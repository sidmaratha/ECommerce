from rest_framework import serializers
from .models import PaymentOrder, OrderItem, Payment, Transaction
from apps.products.serializers import ProductListSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price', 'total_price']

class PaymentOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = PaymentOrder
        fields = [
            'id', 'order_number', 'user', 'user_email', 'status', 'payment_status',
            'payment_method', 'shipping_address', 'billing_address', 'subtotal',
            'tax', 'shipping_cost', 'total_amount', 'razorpay_order_id',
            'razorpay_payment_id', 'created_at', 'updated_at', 'notes', 'items'
        ]
        read_only_fields = [
            'id', 'order_number', 'user', 'razorpay_order_id', 'razorpay_payment_id',
            'razorpay_signature', 'created_at', 'updated_at'
        ]

class CreateOrderSerializer(serializers.ModelSerializer):
    items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )
    shipping_address = serializers.DictField(write_only=True)
    billing_address = serializers.DictField(write_only=True, required=False)

    class Meta:
        model = PaymentOrder
        fields = [
            'items', 'shipping_address', 'billing_address', 'payment_method',
            'notes', 'subtotal', 'tax', 'shipping_cost', 'total_amount'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        shipping_address = validated_data.pop('shipping_address')
        billing_address = validated_data.pop('billing_address', None)
        
        # Format addresses as strings
        shipping_address_str = self._format_address(shipping_address)
        billing_address_str = self._format_address(billing_address) if billing_address else None
        
        # Create order
        order = PaymentOrder.objects.create(
            user=validated_data['user'],
            shipping_address=shipping_address_str,
            billing_address=billing_address_str,
            **validated_data
        )
        
        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                product_id=item_data['product'],
                quantity=item_data['quantity'],
                price=item_data['price']
            )
        
        return order

    def _format_address(self, address_data):
        """Format address dictionary as string"""
        parts = [
            address_data.get('street_address', ''),
            address_data.get('city', ''),
            address_data.get('state', ''),
            address_data.get('postal_code', ''),
            address_data.get('country', '')
        ]
        return ', '.join(filter(None, parts))

class PaymentSerializer(serializers.ModelSerializer):
    order_details = PaymentOrderSerializer(source='order', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'payment_id', 'order', 'order_details', 'amount', 'currency',
            'status', 'payment_method', 'razorpay_order_id', 'razorpay_payment_id',
            'razorpay_signature', 'created_at', 'updated_at', 'payment_data'
        ]
        read_only_fields = [
            'id', 'payment_id', 'razorpay_order_id', 'razorpay_payment_id',
            'razorpay_signature', 'created_at', 'updated_at'
        ]

class RazorpayOrderSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(default='INR')
    receipt = serializers.CharField(required=False)

class RazorpayPaymentVerificationSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()
    order_id = serializers.IntegerField()

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id', 'payment', 'transaction_id', 'transaction_type', 'amount',
            'status', 'gateway_response', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
