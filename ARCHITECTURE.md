# E-Commerce Architecture Documentation

## Overview

This is a production-ready, full-stack e-commerce application built with:
- **Backend**: Django + Django REST Framework
- **Frontend**: React.js with Redux Toolkit
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
.
├── backend/                 # Django backend
│   ├── apps/               # Django applications
│   │   ├── users/         # User management & authentication
│   │   ├── products/      # Product catalog management
│   │   ├── cart/          # Shopping cart functionality
│   │   └── orders/        # Order management
│   ├── config/            # Django project settings
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── pages/         # Page components
    │   ├── store/         # Redux store & slices
    │   │   ├── slices/    # Redux slices (auth, cart, products)
    │   │   └── api/       # API configuration
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    ├── package.json
    └── vite.config.js
```

## Database Schema

### Core Tables

#### 1. Users (`users`)
- **id**: Primary key
- **email**: Unique email address (used for login)
- **username**: Unique username
- **password**: Hashed password
- **first_name**, **last_name**: User names
- **role**: 'admin' or 'user' (default: 'user')
- **phone_number**: Optional contact number
- **is_verified**: Email verification status
- **is_active**: Account status
- **created_at**, **updated_at**: Timestamps

**Relationships:**
- One-to-One with Cart
- One-to-Many with Orders
- One-to-Many with Addresses
- One-to-Many with ProductReviews

#### 2. Addresses (`addresses`)
- **id**: Primary key
- **user_id**: Foreign key to Users
- **address_type**: 'shipping' or 'billing'
- **street_address**: Street address
- **city**, **state**, **postal_code**, **country**: Location details
- **is_default**: Default address flag
- **created_at**, **updated_at**: Timestamps

**Relationships:**
- Many-to-One with User
- One-to-Many with Orders (shipping_address, billing_address)

#### 3. Categories (`categories`)
- **id**: Primary key
- **name**: Category name (unique)
- **slug**: URL-friendly identifier (unique)
- **description**: Category description
- **image**: Category image
- **is_active**: Active status
- **created_at**, **updated_at**: Timestamps

**Relationships:**
- One-to-Many with Products

#### 4. Products (`products`)
- **id**: Primary key
- **name**: Product name
- **slug**: URL-friendly identifier (unique)
- **description**: Product description
- **category_id**: Foreign key to Categories
- **price**: Current price (Decimal)
- **compare_at_price**: Original price for discounts
- **sku**: Stock Keeping Unit (unique)
- **stock_quantity**: Available inventory
- **is_active**: Active status
- **is_featured**: Featured product flag
- **created_at**, **updated_at**: Timestamps

**Relationships:**
- Many-to-One with Category
- One-to-Many with ProductImages
- One-to-Many with ProductReviews
- One-to-Many with CartItems
- One-to-Many with OrderItems

#### 5. Product Images (`product_images`)
- **id**: Primary key
- **product_id**: Foreign key to Products
- **image**: Image file path
- **alt_text**: Alternative text
- **is_primary**: Primary image flag
- **order**: Display order
- **created_at**: Timestamp

**Relationships:**
- Many-to-One with Product

#### 6. Product Reviews (`product_reviews`)
- **id**: Primary key
- **product_id**: Foreign key to Products
- **user_id**: Foreign key to Users
- **rating**: 1-5 star rating
- **title**: Review title
- **comment**: Review text
- **is_approved**: Admin approval status
- **created_at**, **updated_at**: Timestamps

**Relationships:**
- Many-to-One with Product
- Many-to-One with User
- Unique constraint: (product, user)

#### 7. Carts (`carts`)
- **id**: Primary key
- **user_id**: Foreign key to Users (unique)
- **created_at**, **updated_at**: Timestamps

**Relationships:**
- One-to-One with User
- One-to-Many with CartItems

#### 8. Cart Items (`cart_items`)
- **id**: Primary key
- **cart_id**: Foreign key to Carts
- **product_id**: Foreign key to Products
- **quantity**: Item quantity
- **created_at**, **updated_at**: Timestamps

**Relationships:**
- Many-to-One with Cart
- Many-to-One with Product
- Unique constraint: (cart, product)

#### 9. Orders (`orders`)
- **id**: Primary key
- **order_number**: Unique order identifier
- **user_id**: Foreign key to Users
- **status**: 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
- **payment_status**: 'pending', 'paid', 'failed', 'refunded'
- **shipping_address_id**: Foreign key to Addresses
- **billing_address_id**: Foreign key to Addresses
- **subtotal**: Order subtotal
- **tax**: Tax amount
- **shipping_cost**: Shipping cost
- **total**: Total amount
- **notes**: Order notes
- **created_at**, **updated_at**: Timestamps

**Relationships:**
- Many-to-One with User
- Many-to-One with Address (shipping)
- Many-to-One with Address (billing)
- One-to-Many with OrderItems

#### 10. Order Items (`order_items`)
- **id**: Primary key
- **order_id**: Foreign key to Orders
- **product_id**: Foreign key to Products (nullable - product may be deleted)
- **product_name**: Product name (stored for historical record)
- **product_sku**: Product SKU (stored for historical record)
- **quantity**: Item quantity
- **price**: Price at time of order
- **subtotal**: Item subtotal
- **created_at**: Timestamp

**Relationships:**
- Many-to-One with Order
- Many-to-One with Product (nullable)

## Authentication Flow (JWT)

### 1. User Registration
```
POST /api/users/register/
Request: { username, email, password, password2, first_name, last_name }
Response: { message, user: { id, email, username, ... } }
```

### 2. User Login
```
POST /api/auth/token/
Request: { email, password }
Response: { access: "JWT_ACCESS_TOKEN", refresh: "JWT_REFRESH_TOKEN" }
```

### 3. Token Storage
- Access token stored in `localStorage` (1 hour lifetime)
- Refresh token stored in `localStorage` (7 days lifetime)

### 4. Authenticated Requests
- Frontend includes token in header: `Authorization: Bearer <access_token>`
- Backend validates token on each request

### 5. Token Refresh
- When access token expires (401 response)
- Frontend automatically calls: `POST /api/auth/token/refresh/`
- New access token is obtained and stored
- Original request is retried

### 6. Logout
- Tokens removed from `localStorage`
- User redirected to login page

## API Flow Between React and Django

### Request Flow

1. **User Action** → React Component dispatches Redux action
2. **Redux Thunk** → Calls API service function
3. **Axios Interceptor** → Adds JWT token to request header
4. **Django Backend** → Validates token, processes request
5. **Response** → Returns JSON data
6. **Redux Slice** → Updates state with response data
7. **React Component** → Re-renders with new data

### Example: Adding Product to Cart

```
1. User clicks "Add to Cart" button
   ↓
2. ProductDetailPage dispatches addToCart({ product, quantity })
   ↓
3. cartSlice.js: addToCart thunk executes
   ↓
4. api.js: POST /api/cart/items/ with Bearer token
   ↓
5. Django: CartItemCreateView validates token & creates cart item
   ↓
6. Response: { id, product, quantity, subtotal, ... }
   ↓
7. Redux: cartSlice updates state
   ↓
8. Component: Toast notification shown, cart badge updates
```

### API Endpoints

#### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/auth/token/` - Login (get JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token

#### Users
- `GET /api/users/profile/` - Get current user profile
- `PATCH /api/users/profile/update/` - Update profile
- `POST /api/users/change-password/` - Change password
- `GET /api/users/addresses/` - List user addresses
- `POST /api/users/addresses/` - Create address
- `GET /api/users/addresses/<id>/` - Get address
- `PATCH /api/users/addresses/<id>/` - Update address
- `DELETE /api/users/addresses/<id>/` - Delete address

#### Products
- `GET /api/products/` - List products (with filters)
- `GET /api/products/<slug>/` - Get product details
- `POST /api/products/create/` - Create product (admin)
- `PATCH /api/products/<slug>/update/` - Update product (admin)
- `DELETE /api/products/<slug>/delete/` - Delete product (admin)
- `GET /api/products/categories/` - List categories
- `GET /api/products/categories/<slug>/` - Get category
- `GET /api/products/<slug>/reviews/` - List product reviews
- `POST /api/products/<slug>/reviews/` - Create review

#### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/items/` - Add item to cart
- `PATCH /api/cart/items/<id>/` - Update cart item quantity
- `DELETE /api/cart/items/<id>/delete/` - Remove item from cart
- `DELETE /api/cart/clear/` - Clear entire cart

#### Orders
- `GET /api/orders/` - List user's orders
- `POST /api/orders/create/` - Create order from cart
- `GET /api/orders/<id>/` - Get order details
- `PATCH /api/orders/<id>/update/` - Update order (admin)
- `POST /api/orders/<id>/cancel/` - Cancel order

## User Roles & Permissions

### Regular User (`role='user'`)
- Can browse products
- Can add items to cart
- Can place orders
- Can view own orders
- Can manage own profile & addresses
- Can write product reviews

### Admin (`role='admin'` or `is_superuser=True`)
- All user permissions +
- Can create/update/delete products
- Can manage categories
- Can approve product reviews
- Can update order status
- Can access Django admin panel

### Permission Implementation
- **Django REST Framework**: Uses `permissions.IsAuthenticated` and custom checks
- **Frontend**: Uses `ProtectedRoute` and `AdminRoute` components
- **Backend**: Checks `user.is_admin` property or `is_superuser` flag

## Security Features

### Backend Security
1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: Django's PBKDF2 password hasher
3. **CORS Configuration**: Restricted to frontend origin
4. **SQL Injection Protection**: Django ORM prevents SQL injection
5. **XSS Protection**: Django's built-in XSS protection
6. **CSRF Protection**: Enabled for session-based requests
7. **Input Validation**: Serializer validation on all inputs
8. **Rate Limiting**: Can be added with django-ratelimit

### Frontend Security
1. **Token Storage**: JWT tokens in localStorage (consider httpOnly cookies for production)
2. **XSS Protection**: React's built-in XSS protection
3. **Input Sanitization**: React Hook Form validation
4. **HTTPS**: Required in production (configured in settings)

## Scalability Considerations

### Database
- **Indexes**: Added on frequently queried fields (slug, category, status)
- **Select Related**: Using `select_related()` and `prefetch_related()` to reduce queries
- **Pagination**: All list endpoints support pagination

### Caching (Future Enhancement)
- Redis for session storage
- Cache product listings
- Cache category data

### Performance
- **Image Optimization**: Use Pillow for image processing
- **CDN**: Serve static/media files via CDN in production
- **Database Connection Pooling**: Configured in production settings

## Deployment Checklist

### Backend
- [ ] Set `DEBUG=False` in production
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set secure `SECRET_KEY`
- [ ] Configure PostgreSQL database
- [ ] Set up static file serving (WhiteNoise or CDN)
- [ ] Configure media file storage (S3 or similar)
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up logging
- [ ] Configure email backend for notifications

### Frontend
- [ ] Update API base URL for production
- [ ] Build production bundle (`npm run build`)
- [ ] Serve via Nginx or similar
- [ ] Configure HTTPS
- [ ] Set up environment variables

## API Documentation

Interactive API documentation available at:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

## Testing (Future Enhancement)

### Backend Tests
- Unit tests for models
- API endpoint tests
- Authentication tests
- Permission tests

### Frontend Tests
- Component tests (React Testing Library)
- Integration tests
- E2E tests (Cypress/Playwright)

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

