# E-Commerce Backend API

Production-ready Django REST Framework backend for e-commerce application.

## Setup Instructions

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up PostgreSQL database:**
- Create a database named `ecommerce_db` (or update settings.py)
- Update `.env` file with database credentials

4. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser:**
```bash
python manage.py createsuperuser
```

6. **Run development server:**
```bash
python manage.py runserver
```

## API Documentation

- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## Environment Variables

Copy `.env.example` to `.env` and update with your settings.

