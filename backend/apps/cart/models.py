from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Cart(models.Model):
    """
    Shopping cart model - one per user.
    """
    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'carts'
        verbose_name = 'Cart'
        verbose_name_plural = 'Carts'
    
    def __str__(self):
        return f"Cart for {self.user.email}"
    
    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())
    
    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
    """
    Individual items in the shopping cart.
    """
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    quantity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cart_items'
        verbose_name = 'Cart Item'
        verbose_name_plural = 'Cart Items'
        unique_together = ['cart', 'product']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.product.name} x{self.quantity}"
    
    @property
    def subtotal(self):
        return self.product.price * self.quantity
    
    def clean(self):
        from django.core.exceptions import ValidationError
        if self.quantity > self.product.stock_quantity:
            raise ValidationError(
                f"Requested quantity ({self.quantity}) exceeds available stock "
                f"({self.product.stock_quantity})"
            )

