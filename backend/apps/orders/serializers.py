from rest_framework import serializers
from .models import Order, OrderItem
from apps.users.serializers import AddressSerializer, UserSerializer
from apps.products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model."""
    product = ProductListSerializer(read_only=True, allow_null=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_sku', 'quantity', 
                  'price', 'subtotal', 'created_at']
        read_only_fields = ['id', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model."""
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = AddressSerializer(read_only=True)
    billing_address = AddressSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user', 'status', 'payment_status', 
                  'shipping_address', 'billing_address', 'items', 'subtotal', 
                  'tax', 'shipping_cost', 'total', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating an order from cart."""
    shipping_address_id = serializers.IntegerField()
    billing_address_id = serializers.IntegerField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_shipping_address_id(self, value):
        user = self.context['request'].user
        try:
            address = user.addresses.get(id=value)
            return value
        except:
            raise serializers.ValidationError("Invalid shipping address.")
    
    def validate_billing_address_id(self, value):
        if value:
            user = self.context['request'].user
            try:
                address = user.addresses.get(id=value)
                return value
            except:
                raise serializers.ValidationError("Invalid billing address.")
        return value


class OrderUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating order status (admin only)."""
    
    class Meta:
        model = Order
        fields = ['status', 'payment_status', 'notes']

