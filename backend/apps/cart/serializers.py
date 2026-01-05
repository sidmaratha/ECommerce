from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for CartItem model."""
    product = ProductListSerializer(read_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'subtotal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CartItemCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating cart items."""
    
    class Meta:
        model = CartItem
        fields = ['product', 'quantity']
    
    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value
    
    def validate(self, attrs):
        product = attrs['product']
        quantity = attrs['quantity']
        
        if not product.is_active:
            raise serializers.ValidationError("Product is not available.")
        
        if quantity > product.stock_quantity:
            raise serializers.ValidationError(
                f"Requested quantity exceeds available stock ({product.stock_quantity})."
            )
        
        return attrs


class CartSerializer(serializers.ModelSerializer):
    """Serializer for Cart model."""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

