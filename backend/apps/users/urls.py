from django.urls import path
from .views import (
    RegisterView,
    UserProfileView,
    UpdateProfileView,
    change_password,
    AddressListCreateView,
    AddressDetailView
)

app_name = 'users'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/update/', UpdateProfileView.as_view(), name='update-profile'),
    path('change-password/', change_password, name='change-password'),
    path('addresses/', AddressListCreateView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
]

