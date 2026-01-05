from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    """Inline admin for OrderItem."""
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'product_sku', 'price', 'subtotal', 'created_at']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin interface for Order model."""
    list_display = ['order_number', 'user', 'status', 'payment_status', 
                    'total', 'created_at']
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'user__email']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    ordering = ['-created_at']


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Admin interface for OrderItem model."""
    list_display = ['order', 'product_name', 'quantity', 'price', 'subtotal', 'created_at']
    list_filter = ['created_at']
    search_fields = ['order__order_number', 'product_name', 'product_sku']
    readonly_fields = ['created_at']

