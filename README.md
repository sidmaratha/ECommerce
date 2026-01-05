# Production-Ready E-Commerce Platform

A full-stack e-commerce application built with Django REST Framework and React.js.

## Features

- ✅ User authentication with JWT
- ✅ Product catalog with categories
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ User profiles and addresses
- ✅ Product reviews and ratings
- ✅ Admin panel for product management
- ✅ RESTful API architecture
- ✅ Responsive design
- ✅ Secure and scalable


## Tech Stack

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- PostgreSQL
- JWT Authentication (djangorestframework-simplejwt)
- Django CORS Headers
- Swagger/OpenAPI documentation

### Frontend
- React 18.2.0
- Redux Toolkit
- React Router DOM
- Axios
- Vite
- React Hook Form
- React Toastify

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create superuser:**
```bash
python manage.py createsuperuser
```

7. **Run development server:**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Project Structure

```
.
├── backend/              # Django backend
│   ├── apps/
│   │   ├── users/       # User management
│   │   ├── products/    # Product catalog
│   │   ├── cart/        # Shopping cart
│   │   └── orders/      # Order management
│   └── config/          # Django settings
│
└── frontend/            # React frontend
    └── src/
        ├── components/  # Reusable components
        ├── pages/       # Page components
        └── store/       # Redux store
```

## API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/auth/token/` - Login
- `POST /api/auth/token/refresh/` - Refresh token

### Products
- `GET /api/products/` - List products
- `GET /api/products/<slug>/` - Product details
- `GET /api/products/categories/` - List categories

### Cart
- `GET /api/cart/` - Get cart
- `POST /api/cart/items/` - Add to cart
- `PATCH /api/cart/items/<id>/` - Update quantity
- `DELETE /api/cart/items/<id>/delete/` - Remove item

### Orders
- `GET /api/orders/` - List orders
- `POST /api/orders/create/` - Create order
- `GET /api/orders/<id>/` - Order details

### Users
- `GET /api/users/profile/` - User profile
- `GET /api/users/addresses/` - List addresses
- `POST /api/users/addresses/` - Create address

## API Documentation

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

## Database Schema

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed database schema and relationships.

## User Roles

### Regular User
- Browse products
- Add to cart
- Place orders
- Manage profile

### Admin
- All user permissions
- Manage products
- Manage categories
- Update order status
- Approve reviews

## Security Features

- JWT authentication
- Password hashing
- CORS configuration
- Input validation
- SQL injection protection
- XSS protection

## Development

### Running Tests
```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

### Code Formatting
```bash
# Backend
black .
isort .

# Frontend
npm run lint
```

## Production Deployment

See [ARCHITECTURE.md](./ARCHITECTURE.md) for deployment checklist and best practices.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

