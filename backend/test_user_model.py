#!/usr/bin/env python3

# Test User model import
try:
    from django.contrib.auth import get_user_model
    User = get_user_model()
    print(f"SUCCESS: User model imported: {User}")
    print(f"User model class: {User}")
    print(f"User model fields: {User._meta.get_fields()}")
    
except Exception as e:
    print(f"ERROR importing User model: {e}")
    print(f"Full traceback: {traceback.format_exc()}")
