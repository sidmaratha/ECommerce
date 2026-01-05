from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from .models import User, Address


class AddressSerializer(serializers.ModelSerializer):
    """Serializer for Address model."""
    
    class Meta:
        model = Address
        fields = ['id', 'address_type', 'street_address', 'city', 'state', 
                  'postal_code', 'country', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        error_messages={
            'required': 'Password is required',
            'min_length': 'Password must be at least 6 characters',
            'max_length': 'Password cannot exceed 128 characters'
        }
    )
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email is required',
            'invalid': 'Please enter a valid email address'
        }
    )
    first_name = serializers.CharField(
        required=False,
        max_length=50,
        error_messages={
            'max_length': 'First name cannot exceed 50 characters'
        }
    )
    last_name = serializers.CharField(
        required=False,
        max_length=50,
        error_messages={
            'max_length': 'Last name cannot exceed 50 characters'
        }
    )
    phone_number = serializers.CharField(
        required=False,
        max_length=20,
        error_messages={
            'max_length': 'Phone number cannot exceed 20 characters'
        }
    )
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password2', 'first_name', 
                  'last_name', 'phone_number']
        extra_kwargs = {
            'email': {
                'required': True,
                'error_messages': {
                    'required': 'Email is required',
                    'invalid': 'Please enter a valid email address',
                    'unique': 'A user with this email already exists'
                }
            },
            'password': {
                'required': True,
                'error_messages': {
                    'required': 'Password is required',
                    'min_length': 'Password must be at least 8 characters'
                }
            },
            'password2': {
                'required': True,
                'error_messages': {
                    'required': 'Please confirm your password'
                }
            },
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                'password': 'Password fields didn\'t match.'
            })
        
        if User.objects.filter(email__iexact=attrs.get('email')).exists():
            raise serializers.ValidationError({
                'email': 'A user with this email already exists.'
            })
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        # Use create_user for AbstractUser (Django handles password hashing)
        # Pass username as required field for create_user method
        user = User.objects.create_user(
            email=validated_data.get('email'),
            username=validated_data.get('email'),  # Use email as username
            password=password,
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            phone_number=validated_data.get('phone_number')
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    addresses = AddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'phone_number', 'is_verified', 'is_active', 
                  'addresses', 'created_at', 'updated_at']
        read_only_fields = ['id', 'role', 'is_verified', 'created_at', 'updated_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile updates."""
    
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'phone_number']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change."""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True, 
        validators=[validate_password]
    )
    new_password2 = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({
                "new_password": "Password fields didn't match."
            })
        return attrs

