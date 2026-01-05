"""
Create superuser with username 'Sid'
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

username = 'Sid'
email = 'sid@example.com'
password = 'admin123'  # You should change this!

if User.objects.filter(username=username).exists():
    user = User.objects.get(username=username)
    print(f'User "{username}" already exists!')
    print(f'Email: {user.email}')
    print(f'Is superuser: {user.is_superuser}')
    print(f'Is staff: {user.is_staff}')
else:
    try:
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print(f'✓ Superuser "{username}" created successfully!')
        print(f'Email: {email}')
        print(f'Password: {password}')
        print('\n⚠️  IMPORTANT: Please change the password after first login!')
    except Exception as e:
        print(f'Error creating user: {e}')

