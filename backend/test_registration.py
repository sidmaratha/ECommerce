#!/usr/bin/env python3
import requests
import json
import traceback

# Test registration API
url = "http://localhost:3004/api/users/register/"
headers = {"Content-Type": "application/json"}

# Test data
test_data = {
    "email": "test@example.com",
    "password": "test123456",  # 8+ characters
    "password2": "test123456",
    "first_name": "Test",
    "last_name": "User",
    "phone_number": "1234567890"
}

print("Testing registration API...")
print(f"URL: {url}")
print(f"Data: {json.dumps(test_data)}")
print(f"Headers: {headers}")

try:
    response = requests.post(url, json=test_data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 400:
        try:
            error_data = response.json()
            print(f"Error Details: {json.dumps(error_data, indent=2)}")
        except:
            print("Error parsing JSON response")
            print("Raw response text:", response.text)
    elif response.status_code == 500:
        print("500 INTERNAL SERVER ERROR")
        print("Full response:")
        print(response.text)
        print("\nFull traceback:")
        try:
            error_data = response.json()
            print(f"Error JSON: {json.dumps(error_data, indent=2)}")
        except:
            print("Could not parse error JSON")
        print("\nThis might be a Django server error. Check Django logs for details.")
        print("\nDebugging - checking if response is HTML instead of JSON:")
        print(f"Content-Type header: {response.headers.get('Content-Type', 'Not found')}")
        print(f"Response text preview: {response.text[:200]}")  # Show first 200 chars
    else:
        print("Registration successful!")
        
except Exception as e:
    print(f"Request failed: {e}")
    print(f"Full traceback: {traceback.format_exc()}")
