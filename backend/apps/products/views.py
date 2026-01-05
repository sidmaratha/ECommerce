from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
from .models import Category, Product, ProductImage, ProductReview, Banner
from .serializers import (
    BannerSerializer,
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ProductReviewSerializer,
    ProductReviewCreateSerializer
)


class BannerListView(generics.ListAPIView):
    """
    List all active banners for homepage slider.
    Public access.
    """
    queryset = Banner.objects.filter(is_active=True).order_by('banner_order', 'created_at')
    serializer_class = BannerSerializer
    permission_classes = [permissions.AllowAny]


class BannerCreateView(generics.CreateAPIView):
    """
    Create a new banner.
    Admin only.
    """
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.user.is_admin:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


class BannerUpdateView(generics.UpdateAPIView):
    """
    Update a banner.
    Admin only.
    """
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.user.is_admin:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


class BannerDeleteView(generics.DestroyAPIView):
    """
    Delete a banner.
    Admin only.
    """
    queryset = Banner.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.user.is_admin:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


class CategoryListView(generics.ListAPIView):
    """
    List all active categories.
    Public access.
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CategoryDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific category with its products.
    Public access.
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ProductListView(generics.ListAPIView):
    """
    List all active products with filtering, searching, and pagination.
    Public access.
    """
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images')
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by in stock
        in_stock = self.request.query_params.get('in_stock')
        if in_stock == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)
        
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific product with full details.
    Public access.
    """
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related(
        'images', 'reviews__user'
    )
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ProductCreateView(generics.CreateAPIView):
    """
    Create a new product.
    Admin only.
    """
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.user.is_admin:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


class ProductUpdateView(generics.UpdateAPIView):
    """
    Update a product.
    Admin only.
    """
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.request.user.is_admin:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


class ProductDeleteView(generics.DestroyAPIView):
    """
    Delete a product (soft delete by setting is_active=False).
    Admin only.
    """
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.request.user.is_admin:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]
    
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


class ProductReviewListCreateView(generics.ListCreateAPIView):
    """
    List and create product reviews.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        product_slug = self.kwargs['slug']
        return ProductReview.objects.filter(
            product__slug=product_slug,
            is_approved=True
        ).select_related('user')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductReviewCreateSerializer
        return ProductReviewSerializer
    
    def perform_create(self, serializer):
        product_slug = self.kwargs['slug']
        product = Product.objects.get(slug=product_slug)
        serializer.save(user=self.request.user, product=product)

