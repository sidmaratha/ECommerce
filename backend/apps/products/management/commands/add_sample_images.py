import os
import django
from django.core.management.base import BaseCommand
from django.core.files.images import ImageFile
from django.core.files.base import ContentFile
import requests
from io import BytesIO
from apps.products.models import Category, Product, ProductImage, Banner

class Command(BaseCommand):
    help = 'Add sample images to products and banners'

    def handle(self, *args, **options):
        self.stdout.write('Adding sample images to products and banners...')
        
        # Sample product images
        product_images = {
            'iPhone 15 Pro Max': [
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=800&h=600&fit=crop',
            ],
            'Samsung 65" QLED 4K Smart TV': [
                'https://images.unsplash.com/photo-1593784991095-a4f214c8c2f1?w=800&h=600&fit=crop',
            ],
            'Nike Air Max 270': [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
            ],
            "Men's Premium Cotton T-Shirt": [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
            ],
            'Modern Coffee Table': [
                'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop',
            ],
            'Bestseller Novel Collection': [
                'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
            ],
            'Wireless Bluetooth Headphones': [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
            ],
            'Yoga Mat Premium': [
                'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop',
            ],
            'Women\'s Designer Handbag': [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
            ],
            'Smart Home Security Camera': [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
            ],
        }
        
        # Sample banner images
        banner_images = {
            'Summer Sale - Up to 50% Off': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
            'New Electronics Collection': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop',
            'Free Shipping on Orders Over $50': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
        }
        
        # Add product images
        for product_name, image_urls in product_images.items():
            try:
                product = Product.objects.get(name=product_name)
                
                for i, image_url in enumerate(image_urls):
                    try:
                        response = requests.get(image_url)
                        response.raise_for_status()
                        
                        # Get image name from URL
                        image_name = f"{product.slug}_{i+1}.jpg"
                        
                        # Save image to product
                        image_content = ContentFile(response.content, name=image_name)
                        product_image = ProductImage.objects.create(
                            product=product,
                            image=image_content,
                            alt_text=f"{product.name} - Image {i+1}",
                            is_primary=(i == 0),
                            order=i
                        )
                        
                        self.stdout.write(f'✅ Added image to {product.name}')
                    except Exception as e:
                        self.stdout.write(f'❌ Failed to add image to {product.name}: {e}')
                        
            except Product.DoesNotExist:
                self.stdout.write(f'❌ Product not found: {product_name}')
        
        # Add banner images
        for banner_title, image_url in banner_images.items():
            try:
                banner = Banner.objects.get(title=banner_title)
                
                try:
                    response = requests.get(image_url)
                    response.raise_for_status()
                    
                    # Get image name from title
                    image_name = f"{banner.title.lower().replace(' ', '_').replace('-', '_')}.jpg"
                    
                    # Save image to banner
                    image_content = ContentFile(response.content, name=image_name)
                    banner.image.save(image_name, image_content, save=True)
                    
                    self.stdout.write(f'✅ Added image to {banner.title}')
                except Exception as e:
                    self.stdout.write(f'❌ Failed to add image to {banner.title}: {e}')
                    
            except Banner.DoesNotExist:
                self.stdout.write(f'❌ Banner not found: {banner_title}')
        
        self.stdout.write(self.style.SUCCESS('🎉 Sample images added successfully!'))
