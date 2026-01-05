from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductReview
from apps.users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'is_active', 
                  'product_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for ProductImage model."""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']
        read_only_fields = ['id']


class ProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for ProductReview model."""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'rating', 'title', 'comment', 'is_approved', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'is_approved', 'created_at', 'updated_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list view (lightweight)."""
    category = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    discount_percentage = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'category', 'price', 'compare_at_price', 
                  'discount_percentage', 'primary_image', 'in_stock', 'is_featured']
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for product detail view (full data)."""
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'category', 'price', 
                  'compare_at_price', 'discount_percentage', 'sku', 
                  'stock_quantity', 'in_stock', 'is_active', 'is_featured', 
                  'images', 'reviews', 'average_rating', 'review_count', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_average_rating(self, obj):
        approved_reviews = obj.reviews.filter(is_approved=True)
        if approved_reviews.exists():
            return round(
                sum(review.rating for review in approved_reviews) / approved_reviews.count(),
                2
            )
        return None
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products (admin only)."""
    
    class Meta:
        model = Product
        fields = ['name', 'slug', 'description', 'category', 'price', 
                  'compare_at_price', 'sku', 'stock_quantity', 'is_active', 
                  'is_featured']


class ProductReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating product reviews."""
    
    class Meta:
        model = ProductReview
        fields = ['rating', 'title', 'comment']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['product'] = self.context['product']
        return super().create(validated_data)

