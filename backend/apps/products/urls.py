from django.urls import path
from .views import (
    BannerListView,
    BannerCreateView,
    BannerUpdateView,
    BannerDeleteView,
    CategoryListView,
    CategoryDetailView,
    ProductListView,
    ProductDetailView,
    ProductCreateView,
    ProductUpdateView,
    ProductDeleteView,
    ProductReviewListCreateView
)

app_name = 'products'

urlpatterns = [
    # Banners
    path('banners/', BannerListView.as_view(), name='banner-list'),
    path('banners/create/', BannerCreateView.as_view(), name='banner-create'),
    path('banners/<int:pk>/update/', BannerUpdateView.as_view(), name='banner-update'),
    path('banners/<int:pk>/delete/', BannerDeleteView.as_view(), name='banner-delete'),
    
    # Categories
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', CategoryDetailView.as_view(), name='category-detail'),
    
    # Products
    path('', ProductListView.as_view(), name='product-list'),
    path('create/', ProductCreateView.as_view(), name='product-create'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('<slug:slug>/update/', ProductUpdateView.as_view(), name='product-update'),
    path('<slug:slug>/delete/', ProductDeleteView.as_view(), name='product-delete'),
    
    # Reviews
    path('<slug:slug>/reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
]

