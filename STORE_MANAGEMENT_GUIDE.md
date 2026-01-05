# Store Management Guide

## Quick Access Links

- **Frontend Store:** http://localhost:3000
- **Django Admin Panel:** http://localhost:8000/admin/
- **API Documentation:** http://localhost:8000/api/docs/
- **Admin Login:**
  - Username: `Sid`
  - Password: `admin123` (change after first login)

## Sample Data Created

✅ **4 Categories:**
- Electronics
- Clothing
- Books
- Home & Kitchen

✅ **10 Products:**
- Wireless Bluetooth Headphones - $79.99
- Smartphone 128GB - $599.99
- Cotton T-Shirt - $19.99
- Denim Jeans - $49.99
- Python Programming Book - $39.99
- Web Development Guide - $44.99
- Coffee Maker - $89.99
- Stainless Steel Cookware Set - $149.99
- Laptop Stand - $34.99
- Running Shoes - $79.99

## Managing Your Store

### 1. Create Categories

**Via Django Admin:**
1. Go to http://localhost:8000/admin/
2. Login with your admin credentials
3. Navigate to **Products → Categories**
4. Click **"Add Category"**
5. Fill in:
   - Name (e.g., "Sports")
   - Slug (auto-generated from name)
   - Description
   - Upload image (optional)
   - Check "Is active"
6. Click **"Save"**

**Via API:**
```bash
POST /api/products/categories/
{
  "name": "Sports",
  "slug": "sports",
  "description": "Sports equipment and gear",
  "is_active": true
}
```

### 2. Add Products

**Via Django Admin:**
1. Go to **Products → Products**
2. Click **"Add Product"**
3. Fill in product details:
   - **Name:** Product name
   - **Slug:** URL-friendly identifier (auto-generated)
   - **Description:** Detailed product description
   - **Category:** Select from dropdown
   - **Price:** Product price (e.g., 29.99)
   - **Compare at price:** Original price for showing discounts (optional)
   - **SKU:** Stock Keeping Unit (unique identifier)
   - **Stock quantity:** Available inventory
   - **Is active:** Check to make product visible
   - **Is featured:** Check to feature on homepage
4. Click **"Save"**
5. Add product images:
   - Scroll down to **"Product images"** section
   - Click **"Add another Product image"**
   - Upload image and set as primary if needed

**Via API:**
```bash
POST /api/products/create/
Authorization: Bearer <admin_token>
{
  "name": "New Product",
  "slug": "new-product",
  "description": "Product description",
  "category": 1,
  "price": "29.99",
  "sku": "PROD-001",
  "stock_quantity": 50,
  "is_active": true,
  "is_featured": false
}
```

### 3. Manage Orders

**Via Django Admin:**
1. Go to **Orders → Orders**
2. View all orders with:
   - Order number
   - Customer email
   - Status (pending, processing, shipped, delivered, cancelled)
   - Payment status
   - Total amount
   - Order date
3. Click on an order to:
   - View order details
   - Update order status
   - Update payment status
   - View order items
   - View shipping/billing addresses

**Order Statuses:**
- **Pending:** Order just placed
- **Processing:** Order being prepared
- **Shipped:** Order has been shipped
- **Delivered:** Order delivered to customer
- **Cancelled:** Order cancelled
- **Refunded:** Payment refunded

**Via API:**
```bash
# List all orders (admin only)
GET /api/orders/

# Update order status
PATCH /api/orders/<order_id>/update/
{
  "status": "shipped",
  "payment_status": "paid"
}
```

### 4. View User Data

**Via Django Admin:**
1. Go to **Users → Users**
2. View all registered users with:
   - Email
   - Username
   - Role (admin/user)
   - Verification status
   - Account status
   - Registration date
3. Click on a user to:
   - View user details
   - Edit user information
   - View user addresses
   - View user orders
   - Change user role
   - Activate/deactivate account

**User Information Available:**
- Personal details (name, email, phone)
- Addresses (shipping/billing)
- Order history
- Cart contents
- Product reviews

**Via API:**
```bash
# Get user profile
GET /api/users/profile/

# List all users (admin only - requires custom endpoint)
# Or use Django admin for user management
```

### 5. Manage Product Reviews

**Via Django Admin:**
1. Go to **Products → Product reviews**
2. View all reviews with:
   - Product name
   - User email
   - Rating (1-5 stars)
   - Review title and comment
   - Approval status
3. Click on a review to:
   - Approve/disapprove review
   - Edit review content
   - Delete inappropriate reviews

**Via API:**
```bash
# List reviews for a product
GET /api/products/<slug>/reviews/

# Create a review (authenticated users)
POST /api/products/<slug>/reviews/
{
  "rating": 5,
  "title": "Great product!",
  "comment": "Really satisfied with my purchase."
}
```

## Testing the Store

### Customer Flow:
1. **Browse Products:**
   - Visit http://localhost:3000/products
   - Filter by category, price range
   - Search for products

2. **View Product Details:**
   - Click on any product
   - See images, description, reviews
   - Check stock availability

3. **Add to Cart:**
   - Click "Add to Cart"
   - Select quantity
   - View cart at http://localhost:3000/cart

4. **Checkout:**
   - Register/Login if not already
   - Add shipping address
   - Review order
   - Place order

5. **View Orders:**
   - Go to "Orders" page
   - View order history
   - Track order status

### Admin Flow:
1. **Login to Admin:**
   - http://localhost:8000/admin/
   - Use credentials: Sid / admin123

2. **Manage Products:**
   - Add/edit/delete products
   - Update stock quantities
   - Feature products on homepage

3. **Process Orders:**
   - View new orders
   - Update order status
   - Track shipments

4. **Manage Users:**
   - View customer accounts
   - Handle customer support
   - Manage user roles

## Useful Commands

### Add More Sample Data
```bash
cd backend
python populate_sample_data.py
```

### Create Additional Superuser
```bash
cd backend
python manage.py createsuperuser
```

### Reset Database (Development Only)
```bash
cd backend
python manage.py flush  # WARNING: Deletes all data!
python populate_sample_data.py  # Recreate sample data
```

### View Database
```bash
cd backend
python manage.py dbshell  # Opens SQLite shell
```

## API Testing

Use the interactive API documentation:
- **Swagger UI:** http://localhost:8000/api/docs/
- **ReDoc:** http://localhost:8000/api/redoc/

Test endpoints directly from the browser or use tools like:
- Postman
- Insomnia
- curl
- httpie

## Tips

1. **Product Images:** Add product images via Django admin for better store appearance
2. **Featured Products:** Mark products as "featured" to show them on homepage
3. **Stock Management:** Keep stock quantities updated to prevent overselling
4. **Order Tracking:** Update order status regularly for customer satisfaction
5. **Reviews:** Approve customer reviews to build trust
6. **Categories:** Organize products into logical categories for better navigation

## Security Reminders

- ✅ Change default admin password
- ✅ Use strong passwords for admin accounts
- ✅ Regularly backup database
- ✅ Keep dependencies updated
- ✅ Use environment variables for sensitive data
- ✅ Enable HTTPS in production

Happy managing! 🛍️

