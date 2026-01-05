from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model."""
    list_display = ['email', 'username', 'first_name', 'last_name', 'role', 
                    'is_verified', 'is_active', 'date_joined']
    list_filter = ['role', 'is_verified', 'is_active', 'is_staff', 'is_superuser']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone_number', 'is_verified')}),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    """Admin interface for Address model."""
    list_display = ['user', 'address_type', 'city', 'state', 'is_default', 'created_at']
    list_filter = ['address_type', 'country', 'is_default']
    search_fields = ['user__email', 'city', 'state', 'postal_code']
    ordering = ['-created_at']

