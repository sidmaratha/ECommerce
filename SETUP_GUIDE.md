# Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)
- npm (Node package manager)

## Step-by-Step Setup

### 1. Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Windows: Download from [PostgreSQL website](https://www.postgresql.org/download/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**
   ```sql
   CREATE DATABASE ecommerce_db;
   CREATE USER postgres WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO postgres;
   ```

### 2. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env file with your settings:
   # SECRET_KEY=your-secret-key-here
   # DEBUG=True
   # DB_NAME=ecommerce_db
   # DB_USER=postgres
   # DB_PASSWORD=your_password
   # DB_HOST=localhost
   # DB_PORT=5432
   ```

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (admin account):**
   ```bash
   python manage.py createsuperuser
   # Follow prompts to create admin user
   ```

7. **Run development server:**
   ```bash
   python manage.py runserver
   ```

   Backend will be running at `http://localhost:8000`

### 3. Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
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

   Frontend will be running at `http://localhost:3000`

### 4. Verify Installation

1. **Backend:**
   - Visit `http://localhost:8000/api/docs/` - Should see Swagger UI
   - Visit `http://localhost:8000/admin/` - Login with superuser credentials

2. **Frontend:**
   - Visit `http://localhost:3000` - Should see the homepage
   - Try registering a new user
   - Try logging in

## Common Issues

### Database Connection Error

**Problem:** `django.db.utils.OperationalError: could not connect to server`

**Solutions:**
- Ensure PostgreSQL is running: `sudo service postgresql start` (Linux) or check Services (Windows)
- Verify database credentials in `.env` file
- Check if database exists: `psql -l` to list databases

### Port Already in Use

**Problem:** `Error: That port is already in use`

**Solutions:**
- Backend: Change port in `python manage.py runserver 8001`
- Frontend: Change port in `vite.config.js` or use `npm run dev -- --port 3001`

### Module Not Found Error

**Problem:** `ModuleNotFoundError: No module named 'xxx'`

**Solutions:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### CORS Error

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Ensure backend CORS settings include frontend URL
- Check `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py`

## Next Steps

1. **Create Test Data:**
   - Login to Django admin: `http://localhost:8000/admin/`
   - Create categories and products
   - Add product images

2. **Test the Application:**
   - Register a new user
   - Browse products
   - Add items to cart
   - Place an order

3. **Explore API:**
   - Visit `http://localhost:8000/api/docs/` for interactive API documentation
   - Test endpoints using Swagger UI

## Production Deployment

For production deployment, see the deployment checklist in `ARCHITECTURE.md`.

Key changes needed:
- Set `DEBUG=False`
- Configure production database
- Set up static file serving
- Configure HTTPS
- Set secure `SECRET_KEY`
- Update `ALLOWED_HOSTS`

