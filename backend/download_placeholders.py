import requests
import os
from pathlib import Path

# Create static/images directory if it doesn't exist
static_dir = Path(__file__).parent / 'static' / 'images'
static_dir.mkdir(parents=True, exist_ok=True)

# Download placeholder images
placeholder_images = {
    'placeholder-banner.jpg': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
    'placeholder-product.jpg': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
}

print("Downloading placeholder images...")

for filename, url in placeholder_images.items():
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        filepath = static_dir / filename
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Downloaded {filename}")
    except Exception as e:
        print(f"❌ Failed to download {filename}: {e}")

print("Placeholder images download completed!")
