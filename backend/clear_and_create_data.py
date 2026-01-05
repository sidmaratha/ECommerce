import os
import django
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal
from apps.products.models import Category, Product, ProductImage, Banner
from apps.users.models import Address

User = get_user_model()

class Command(BaseCommand):
    help = 'Clear existing data and create fresh dummy data'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing data...')
        
        # Clear existing data
        Banner.objects.all().delete()
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        Address.objects.all().delete()
        User.objects.all().delete()
        
        self.stdout.write('✅ Existing data cleared')
        
        # Create admin user
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@ecommerce.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            role='admin',
            is_staff=True,
            is_superuser=True
        )
        self.stdout.write('✅ Admin user created: admin@ecommerce.com / admin123')
        
        # Create regular users
        users_data = [
            {'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
            {'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
            {'email': 'mike@example.com', 'first_name': 'Mike', 'last_name': 'Johnson'},
        ]
        
        for user_data in users_data:
            user = User.objects.create_user(
                username=user_data['email'].split('@')[0],
                email=user_data['email'],
                password='user123',
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                role='customer'
            )
            # Add address for user
            Address.objects.create(
                user=user,
                street_address='123 Main St',
                city='New York',
                state='NY',
                postal_code='10001',
                country='USA',
                is_default=True
            )
            self.stdout.write(f'✅ User created: {user_data["email"]}')
        
        # Create categories
        categories_data = [
            {'name': 'Electronics', 'slug': 'electronics', 'description': 'Electronic devices and gadgets'},
            {'name': 'Clothing', 'slug': 'clothing', 'description': 'Fashion and apparel'},
            {'name': 'Home & Garden', 'slug': 'home-garden', 'description': 'Home decor and garden supplies'},
            {'name': 'Sports & Outdoors', 'slug': 'sports-outdoors', 'description': 'Sports equipment and outdoor gear'},
            {'name': 'Books & Media', 'slug': 'books-media', 'description': 'Books, movies, and music'},
            {'name': 'Toys & Games', 'slug': 'toys-games', 'description': 'Toys and games for all ages'},
            {'name': 'Beauty & Personal Care', 'slug': 'beauty-personal-care', 'description': 'Beauty products and personal care'},
            {'name': 'Food & Beverages', 'slug': 'food-beverages', 'description': 'Food items and beverages'},
        ]
        
        for cat_data in categories_data:
            category = Category.objects.create(
                name=cat_data['name'],
                slug=cat_data['slug'],
                description=cat_data['description'],
                is_active=True
            )
            self.stdout.write(f'✅ Category created: {cat_data["name"]}')
        
        # Get categories
        electronics = Category.objects.get(name='Electronics')
        clothing = Category.objects.get(name='Clothing')
        home = Category.objects.get(name='Home & Garden')
        sports = Category.objects.get(name='Sports & Outdoors')
        books = Category.objects.get(name='Books & Media')
        
        # Create products
        products_data = [
            {
                'name': 'iPhone 15 Pro Max',
                'slug': 'iphone-15-pro-max',
                'description': 'Latest iPhone with advanced camera system and A17 Pro chip. Features titanium design, ProMotion display, and all-day battery life.',
                'category': electronics,
                'price': Decimal('1199.00'),
                'compare_at_price': Decimal('1299.00'),
                'sku': 'IPHONE15PM001',
                'stock_quantity': 50,
                'is_featured': True,
                'images': [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=800&h=600&fit=crop',
                ]
            },
            {
                'name': 'Samsung 65" QLED 4K Smart TV',
                'slug': 'samsung-65-qled-4k-tv',
                'description': 'Premium QLED TV with Quantum HDR, Object Tracking Sound, and Smart TV features. Perfect for movie nights and gaming.',
                'category': electronics,
                'price': Decimal('899.00'),
                'compare_at_price': Decimal('1199.00'),
                'sku': 'SAMSUNG65QLED',
                'stock_quantity': 25,
                'is_featured': True,
                'images': [
                    'https://images.unsplash.com/photo-1593784991095-a4f214c8c2f1?w=800&h=600&fit=crop',
                ]
            },
            {
                'name': 'Nike Air Max 270',
                'slug': 'nike-air-max-270',
                'description': 'Comfortable running shoes with Max Air unit for cushioning. Perfect for daily wear and light workouts.',
                'category': sports,
                'price': Decimal('150.00'),
                'compare_at_price': Decimal('180.00'),
                'sku': 'NIKEAIR270',
                'stock_quantity': 100,
                'is_featured': False,
                'images': [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
                ]
            },
            {
                'name': "Men's Premium Cotton T-Shirt",
                'slug': 'mens-premium-cotton-tshirt',
                'description': 'High-quality cotton t-shirt perfect for casual wear. Soft, comfortable, and durable.',
                'category': clothing,
                'price': Decimal('29.99'),
                'compare_at_price': Decimal('39.99'),
                'sku': 'TSHIRT001',
                'stock_quantity': 200,
                'is_featured': False,
                'images': [
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
                ]
            },
            {
                'name': 'Modern Coffee Table',
                'slug': 'modern-coffee-table',
                'description': 'Stylish modern coffee table with storage. Perfect centerpiece for your living room.',
                'category': home,
                'price': Decimal('249.00'),
                'compare_at_price': Decimal('349.00'),
                'sku': 'TABLE001',
                'stock_quantity': 15,
                'is_featured': True,
                'images': [
                    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop',
                ]
            },
            {
                'name': 'Bestseller Novel Collection',
                'slug': 'bestseller-novel-collection',
                'description': 'Collection of top-rated novels from various genres. Perfect for book lovers.',
                'category': books,
                'price': Decimal('49.99'),
                'compare_at_price': Decimal('69.99'),
                'sku': 'BOOKS001',
                'stock_quantity': 75,
                'is_featured': False,
                'images': [
                    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
                ]
            },
            {
                'name': 'Wireless Bluetooth Headphones',
                'slug': 'wireless-bluetooth-headphones',
                'description': 'Premium noise-canceling headphones with 30-hour battery life and superior sound quality.',
                'category': electronics,
                'price': Decimal('199.00'),
                'compare_at_price': Decimal('299.00'),
                'sku': 'HEADPHONES001',
                'stock_quantity': 60,
                'is_featured': True,
                'images': [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
                ]
            },
            {
                'name': 'Yoga Mat Premium',
                'slug': 'yoga-mat-premium',
                'description': 'Extra thick, non-slip yoga mat with carrying strap. Perfect for yoga and exercise.',
                'category': sports,
                'price': Decimal('39.99'),
                'compare_at_price': Decimal('59.99'),
                'sku': 'YOGAMAT001',
                'stock_quantity': 80,
                'is_featured': False,
                'images': [
                    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop',
                ]
            },
            {
                'name': 'Women\'s Designer Handbag',
                'slug': 'womens-designer-handbag',
                'description': 'Elegant leather handbag with multiple compartments. Perfect for any occasion.',
                'category': clothing,
                'price': Decimal('189.00'),
                'compare_at_price': Decimal('289.00'),
                'sku': 'HANDBAG001',
                'stock_quantity': 30,
                'is_featured': True,
                'images': [
                    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
                ]
            },
            {
                'name': 'Smart Home Security Camera',
                'slug': 'smart-home-security-camera',
                'description': 'WiFi security camera with night vision, motion detection, and two-way audio.',
                'category': electronics,
                'price': Decimal('79.99'),
                'compare_at_price': Decimal('99.99'),
                'sku': 'CAMERA001',
                'stock_quantity': 45,
                'is_featured': False,
                'images': [
                    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
                ]
            },
        ]
        
        for product_data in products_data:
            product = Product.objects.create(
                name=product_data['name'],
                slug=product_data['slug'],
                description=product_data['description'],
                category=product_data['category'],
                price=product_data['price'],
                compare_at_price=product_data['compare_at_price'],
                sku=product_data['sku'],
                stock_quantity=product_data['stock_quantity'],
                is_active=True,
                is_featured=product_data['is_featured']
            )
            
            # Add product images
            for i, image_url in enumerate(product_data['images']):
                ProductImage.objects.create(
                    product=product,
                    image_url=image_url,
                    alt_text=f"{product.name} - Image {i+1}",
                    is_primary=(i == 0)
                )
            
            self.stdout.write(f'✅ Product created: {product_data["name"]}')
        
        # Create banners
        banners_data = [
            {
                'title': 'Summer Sale - Up to 50% Off',
                'subtitle': 'Don\'t miss out on our biggest sale of the year!',
                'link': '/products',
                'button_text': 'Shop Now',
                'is_active': True,
                'banner_order': 1,
                'image_url': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop'
            },
            {
                'title': 'New Electronics Collection',
                'subtitle': 'Discover the latest gadgets and tech innovations',
                'link': '/products?category=electronics',
                'button_text': 'Explore Tech',
                'is_active': True,
                'banner_order': 2,
                'image_url': 'https://images.unsplash.com/photo-1593784991095-a4f214c8c2f1?w=1200&h=400&fit=crop'
            },
            {
                'title': 'Free Shipping on Orders Over $50',
                'subtitle': 'Shop now and enjoy free delivery on qualifying orders',
                'link': '/products',
                'button_text': 'Start Shopping',
                'is_active': True,
                'banner_order': 3,
                'image_url': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop'
            },
        ]
        
        for banner_data in banners_data:
            banner = Banner.objects.create(**banner_data)
            self.stdout.write(f'✅ Banner created: {banner_data["title"]}')
        
        self.stdout.write(self.style.SUCCESS('🎉 Fresh dummy data created successfully!'))
        self.stdout.write('\nLogin credentials:')
        self.stdout.write('Admin: admin@ecommerce.com / admin123')
        self.stdout.write('Users: john@example.com / user123')
        self.stdout.write('       jane@example.com / user123')
        self.stdout.write('       mike@example.com / user123')
