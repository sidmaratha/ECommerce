from django.urls import path
from .views import (
    OrderListView,
    OrderDetailView,
    OrderCreateView,
    OrderUpdateView,
    cancel_order
)

app_name = 'orders'

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:pk>/update/', OrderUpdateView.as_view(), name='order-update'),
    path('<int:pk>/cancel/', cancel_order, name='order-cancel'),
]

