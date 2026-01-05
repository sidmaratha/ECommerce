"""
Script to create a superuser non-interactively.
Usage: python create_superuser.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

# Change these values as needed
username = 'admin'
email = 'admin@example.com'
password = 'admin123'  # Change this!

if User.objects.filter(username=username).exists():
    print(f'User {username} already exists.')
else:
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f'Superuser {username} created successfully!')
    print(f'Email: {email}')
    print(f'Password: {password}')

