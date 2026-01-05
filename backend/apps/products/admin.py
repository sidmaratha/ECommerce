from django.contrib import admin
from .models import Category, Product, ProductImage, ProductReview


class ProductImageInline(admin.TabularInline):
    """Inline admin for ProductImage."""
    model = ProductImage
    extra = 1


class ProductReviewInline(admin.TabularInline):
    """Inline admin for ProductReview."""
    model = ProductReview
    extra = 0
    readonly_fields = ['user', 'created_at']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin interface for Category model."""
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin interface for Product model."""
    list_display = ['name', 'sku', 'category', 'price', 'stock_quantity', 
                    'is_active', 'is_featured', 'created_at']
    list_filter = ['category', 'is_active', 'is_featured', 'created_at']
    search_fields = ['name', 'sku', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductReviewInline]
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """Admin interface for ProductImage model."""
    list_display = ['product', 'is_primary', 'order', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['product__name']


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    """Admin interface for ProductReview model."""
    list_display = ['product', 'user', 'rating', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = ['product__name', 'user__email', 'title']
    readonly_fields = ['created_at', 'updated_at']

