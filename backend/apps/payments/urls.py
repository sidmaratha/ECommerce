from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    path('create/', views.CreateOrderView.as_view(), name='create-order'),
    path('verify/', views.verify_payment, name='verify-payment'),
    path('cod/', views.create_cod_order, name='create-cod-order'),
    path('orders/', views.OrderListView.as_view(), name='order-list'),
    path('orders/<int:order_id>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('history/', views.payment_history, name='payment-history'),
]
