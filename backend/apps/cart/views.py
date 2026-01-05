from rest_framework import generics, status, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    CartItemCreateUpdateSerializer
)


class CartView(generics.RetrieveAPIView):
    """
    Get current user's cart.
    """
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


class CartItemCreateView(generics.CreateAPIView):
    """
    Add item to cart.
    """
    serializer_class = CartItemCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        
        # Check if item already exists in cart
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # Update quantity if item already exists
            cart_item.quantity += quantity
            if cart_item.quantity > product.stock_quantity:
                raise serializers.ValidationError(
                    f"Total quantity exceeds available stock ({product.stock_quantity})."
                )
            cart_item.save()
        
        return cart_item


class CartItemUpdateView(generics.UpdateAPIView):
    """
    Update cart item quantity.
    """
    serializer_class = CartItemCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)
    
    def get_serializer_class(self):
        return CartItemCreateUpdateSerializer


class CartItemDeleteView(generics.DestroyAPIView):
    """
    Remove item from cart.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_cart(request):
    """
    Clear all items from cart.
    """
    try:
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared successfully.'})
    except Cart.DoesNotExist:
        return Response(
            {'message': 'Cart is already empty.'},
            status=status.HTTP_404_NOT_FOUND
        )

