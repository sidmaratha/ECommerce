"""
Script to populate the database with sample categories and products.
Run this to get started with test data.
"""
import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.products.models import Category, Product, ProductImage
from apps.users.models import User

print("Creating sample data...\n")

# Create Categories
categories_data = [
    {
        'name': 'Electronics',
        'slug': 'electronics',
        'description': 'Latest electronic gadgets and devices'
    },
    {
        'name': "Men's Fashion",
        'slug': 'mens-fashion',
        'description': 'Stylish clothing and accessories for men'
    },
    {
        'name': "Women's Fashion",
        'slug': 'womens-fashion',
        'description': 'Trendy clothing and accessories for women'
    },
    {
        'name': 'Clothing',
        'slug': 'clothing',
        'description': 'Fashionable clothing for all occasions'
    },
    {
        'name': 'Books',
        'slug': 'books',
        'description': 'Books for all reading interests'
    },
    {
        'name': 'Home & Kitchen',
        'slug': 'home-kitchen',
        'description': 'Everything for your home and kitchen'
    },
]

categories = {}
for cat_data in categories_data:
    category, created = Category.objects.get_or_create(
        slug=cat_data['slug'],
        defaults={
            'name': cat_data['name'],
            'description': cat_data['description'],
            'is_active': True
        }
    )
    categories[cat_data['slug']] = category
    if created:
        print(f"[OK] Created category: {category.name}")
    else:
        print(f"[EXISTS] Category already exists: {category.name}")

print()

# Create Products
products_data = [
    # Electronics Products
    {
        'name': 'Wireless Bluetooth Headphones',
        'slug': 'wireless-bluetooth-headphones',
        'description': 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
        'category': 'electronics',
        'price': Decimal('79.99'),
        'compare_at_price': Decimal('99.99'),
        'sku': 'ELEC-001',
        'stock_quantity': 50,
        'is_featured': True
    },
    {
        'name': 'Smartphone 128GB',
        'slug': 'smartphone-128gb',
        'description': 'Latest generation smartphone with advanced camera, fast processor, and long-lasting battery. Includes charger and protective case.',
        'category': 'electronics',
        'price': Decimal('599.99'),
        'compare_at_price': Decimal('699.99'),
        'sku': 'ELEC-002',
        'stock_quantity': 25,
        'is_featured': True
    },
    {
        'name': 'Laptop Stand',
        'slug': 'laptop-stand',
        'description': 'Ergonomic aluminum laptop stand. Adjustable height and angle. Fits laptops up to 17 inches.',
        'category': 'electronics',
        'price': Decimal('34.99'),
        'compare_at_price': Decimal('44.99'),
        'sku': 'ELEC-003',
        'stock_quantity': 60,
        'is_featured': False
    },
    {
        'name': 'Smart Watch',
        'slug': 'smart-watch',
        'description': 'Feature-rich smartwatch with fitness tracking, heart rate monitor, and smartphone notifications. Water-resistant design.',
        'category': 'electronics',
        'price': Decimal('199.99'),
        'compare_at_price': Decimal('249.99'),
        'sku': 'ELEC-004',
        'stock_quantity': 35,
        'is_featured': True
    },
    {
        'name': 'Wireless Mouse',
        'slug': 'wireless-mouse',
        'description': 'Ergonomic wireless mouse with long battery life and precise tracking. Compatible with all operating systems.',
        'category': 'electronics',
        'price': Decimal('29.99'),
        'compare_at_price': Decimal('39.99'),
        'sku': 'ELEC-005',
        'stock_quantity': 80,
        'is_featured': False
    },
    {
        'name': 'Tablet 10 inch',
        'slug': 'tablet-10-inch',
        'description': '10-inch tablet with high-resolution display, fast processor, and all-day battery life. Perfect for work and entertainment.',
        'category': 'electronics',
        'price': Decimal('299.99'),
        'compare_at_price': Decimal('349.99'),
        'sku': 'ELEC-006',
        'stock_quantity': 20,
        'is_featured': True
    },
    {
        'name': 'USB-C Charging Cable',
        'slug': 'usb-c-charging-cable',
        'description': 'Fast charging USB-C cable, 6 feet long. Compatible with all USB-C devices. Durable braided design.',
        'category': 'electronics',
        'price': Decimal('12.99'),
        'compare_at_price': Decimal('19.99'),
        'sku': 'ELEC-007',
        'stock_quantity': 150,
        'is_featured': False
    },
    
    # Men's Fashion Products
    {
        'name': "Men's Casual T-Shirt",
        'slug': 'mens-casual-t-shirt',
        'description': 'Comfortable 100% cotton t-shirt for men. Available in multiple colors and sizes. Perfect for everyday wear.',
        'category': 'mens-fashion',
        'price': Decimal('24.99'),
        'compare_at_price': Decimal('34.99'),
        'sku': 'MEN-001',
        'stock_quantity': 100,
        'is_featured': True
    },
    {
        'name': "Men's Denim Jeans",
        'slug': 'mens-denim-jeans',
        'description': 'Classic fit denim jeans for men. Made from premium cotton denim. Available in various sizes and washes.',
        'category': 'mens-fashion',
        'price': Decimal('59.99'),
        'compare_at_price': Decimal('79.99'),
        'sku': 'MEN-002',
        'stock_quantity': 75,
        'is_featured': True
    },
    {
        'name': "Men's Leather Jacket",
        'slug': 'mens-leather-jacket',
        'description': 'Genuine leather jacket for men. Classic design with modern fit. Perfect for casual and semi-formal occasions.',
        'category': 'mens-fashion',
        'price': Decimal('149.99'),
        'compare_at_price': Decimal('199.99'),
        'sku': 'MEN-003',
        'stock_quantity': 30,
        'is_featured': True
    },
    {
        'name': "Men's Dress Shirt",
        'slug': 'mens-dress-shirt',
        'description': 'Formal dress shirt for men. Wrinkle-resistant fabric. Available in white, blue, and other colors.',
        'category': 'mens-fashion',
        'price': Decimal('39.99'),
        'compare_at_price': Decimal('54.99'),
        'sku': 'MEN-004',
        'stock_quantity': 60,
        'is_featured': False
    },
    {
        'name': "Men's Running Shoes",
        'slug': 'mens-running-shoes',
        'description': 'Lightweight running shoes for men with cushioned sole and breathable mesh upper. Perfect for daily runs and workouts.',
        'category': 'mens-fashion',
        'price': Decimal('89.99'),
        'compare_at_price': Decimal('119.99'),
        'sku': 'MEN-005',
        'stock_quantity': 50,
        'is_featured': True
    },
    {
        'name': "Men's Sneakers",
        'slug': 'mens-sneakers',
        'description': 'Stylish casual sneakers for men. Comfortable and durable. Great for everyday wear.',
        'category': 'mens-fashion',
        'price': Decimal('69.99'),
        'compare_at_price': Decimal('89.99'),
        'sku': 'MEN-006',
        'stock_quantity': 65,
        'is_featured': False
    },
    {
        'name': "Men's Watch",
        'slug': 'mens-watch',
        'description': 'Elegant wristwatch for men. Stainless steel case with leather strap. Water-resistant.',
        'category': 'mens-fashion',
        'price': Decimal('79.99'),
        'compare_at_price': Decimal('99.99'),
        'sku': 'MEN-007',
        'stock_quantity': 40,
        'is_featured': True
    },
    {
        'name': "Men's Polo Shirt",
        'slug': 'mens-polo-shirt',
        'description': 'Classic polo shirt for men. Made from premium cotton blend. Available in multiple colors.',
        'category': 'mens-fashion',
        'price': Decimal('34.99'),
        'compare_at_price': Decimal('44.99'),
        'sku': 'MEN-008',
        'stock_quantity': 85,
        'is_featured': False
    },
    
    # Women's Fashion Products
    {
        'name': "Women's Summer Dress",
        'slug': 'womens-summer-dress',
        'description': 'Beautiful summer dress for women. Lightweight and comfortable fabric. Perfect for warm weather occasions.',
        'category': 'womens-fashion',
        'price': Decimal('49.99'),
        'compare_at_price': Decimal('69.99'),
        'sku': 'WOMEN-001',
        'stock_quantity': 90,
        'is_featured': True
    },
    {
        'name': "Women's High Heels",
        'slug': 'womens-high-heels',
        'description': 'Elegant high heels for women. Comfortable padding and stylish design. Available in multiple colors.',
        'category': 'womens-fashion',
        'price': Decimal('59.99'),
        'compare_at_price': Decimal('79.99'),
        'sku': 'WOMEN-002',
        'stock_quantity': 55,
        'is_featured': True
    },
    {
        'name': "Women's Handbag",
        'slug': 'womens-handbag',
        'description': 'Stylish leather handbag for women. Spacious interior with multiple compartments. Perfect for daily use.',
        'category': 'womens-fashion',
        'price': Decimal('79.99'),
        'compare_at_price': Decimal('99.99'),
        'sku': 'WOMEN-003',
        'stock_quantity': 45,
        'is_featured': True
    },
    {
        'name': "Women's Jeans",
        'slug': 'womens-jeans',
        'description': 'Comfortable fit jeans for women. Stretch denim fabric. Available in various sizes and styles.',
        'category': 'womens-fashion',
        'price': Decimal('54.99'),
        'compare_at_price': Decimal('74.99'),
        'sku': 'WOMEN-004',
        'stock_quantity': 70,
        'is_featured': False
    },
    {
        'name': "Women's Blouse",
        'slug': 'womens-blouse',
        'description': 'Elegant blouse for women. Perfect for office and casual wear. Available in multiple colors and patterns.',
        'category': 'womens-fashion',
        'price': Decimal('39.99'),
        'compare_at_price': Decimal('54.99'),
        'sku': 'WOMEN-005',
        'stock_quantity': 80,
        'is_featured': True
    },
    {
        'name': "Women's Sandals",
        'slug': 'womens-sandals',
        'description': 'Comfortable sandals for women. Cushioned sole and adjustable straps. Perfect for summer.',
        'category': 'womens-fashion',
        'price': Decimal('34.99'),
        'compare_at_price': Decimal('44.99'),
        'sku': 'WOMEN-006',
        'stock_quantity': 95,
        'is_featured': False
    },
    {
        'name': "Women's Jewelry Set",
        'slug': 'womens-jewelry-set',
        'description': 'Beautiful jewelry set including necklace, earrings, and bracelet. Elegant design for special occasions.',
        'category': 'womens-fashion',
        'price': Decimal('89.99'),
        'compare_at_price': Decimal('129.99'),
        'sku': 'WOMEN-007',
        'stock_quantity': 35,
        'is_featured': True
    },
    {
        'name': "Women's Cardigan",
        'slug': 'womens-cardigan',
        'description': 'Soft and cozy cardigan for women. Perfect for layering. Available in multiple colors.',
        'category': 'womens-fashion',
        'price': Decimal('44.99'),
        'compare_at_price': Decimal('59.99'),
        'sku': 'WOMEN-008',
        'stock_quantity': 60,
        'is_featured': False
    },
    {
        'name': "Women's Sneakers",
        'slug': 'womens-sneakers',
        'description': 'Comfortable sneakers for women. Lightweight and stylish. Perfect for everyday wear and light exercise.',
        'category': 'womens-fashion',
        'price': Decimal('64.99'),
        'compare_at_price': Decimal('84.99'),
        'sku': 'WOMEN-009',
        'stock_quantity': 75,
        'is_featured': True
    },
]

created_count = 0
for prod_data in products_data:
    category = categories[prod_data['category']]
    product, created = Product.objects.get_or_create(
        slug=prod_data['slug'],
        defaults={
            'name': prod_data['name'],
            'description': prod_data['description'],
            'category': category,
            'price': prod_data['price'],
            'compare_at_price': prod_data.get('compare_at_price'),
            'sku': prod_data['sku'],
            'stock_quantity': prod_data['stock_quantity'],
            'is_active': True,
            'is_featured': prod_data['is_featured']
        }
    )
    if created:
        created_count += 1
        print(f"[OK] Created product: {product.name} (${product.price})")
    else:
        print(f"[EXISTS] Product already exists: {product.name}")

print(f"\n{'='*60}")
print(f"Summary:")
print(f"  Categories: {len(categories)}")
print(f"  Products created: {created_count}")
print(f"  Total products: {Product.objects.filter(is_active=True).count()}")
print(f"{'='*60}")
print("\n[SUCCESS] Sample data populated successfully!")
print("\nYou can now:")
print("  - View products at: http://localhost:3000/products")
print("  - Access admin panel at: http://localhost:8000/admin/")
print("  - Test the shopping cart and checkout flow")

