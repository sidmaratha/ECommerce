# Complete E-Commerce Setup Guide

This guide will help you set up a full-featured e-commerce platform with MySQL database, modern UI, and admin management capabilities.

## 🚀 Features Implemented

- ✅ **MySQL Database Migration** - Complete migration from SQLite to MySQL
- ✅ **Modern E-commerce UI** - Amazon-inspired design with TailwindCSS
- ✅ **Homepage Banner Slider** - Configurable image carousel for admins
- ✅ **Admin Authentication System** - Secure admin login and dashboard
- ✅ **Product Management** - Full CRUD with image upload
- ✅ **Banner Management** - Admin can configure homepage banners
- ✅ **Enhanced Product Cards** - Modern design with ratings and wishlist

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MySQL Server (v8.0 or higher)
- Git

## 🗄️ MySQL Database Setup

### 1. Create Database and User

```sql
-- Login to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional, but recommended)
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Import Database Schema

```bash
# Navigate to backend directory
cd backend

# Import the SQL schema
mysql -u root -p ecommerce_db < setup_mysql_database.sql
```

### 3. Configure Backend Environment

```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your MySQL credentials
```

Example `.env` file:
```env
SECRET_KEY=django-insecure-your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Settings (MySQL)
USE_SQLITE=False
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 🛠️ Backend Setup

### 1. Install Dependencies

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Install MySQL client if not already installed
pip install mysqlclient
```

### 2. Run Migrations

```bash
# Apply Django migrations
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Superuser

```bash
# Create admin user
python manage.py createsuperuser

# Or use the provided script
python create_superuser.py
```

### 4. Start Backend Server

```bash
# Start Django development server
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend

# Install Node.js dependencies
npm install
```

### 2. Update Dependencies (if needed)

The frontend now includes these additional packages:
- `react-slick` - For banner carousel
- `slick-carousel` - Carousel styles
- `@heroicons/react` - Modern icon library
- `tailwindcss` - Utility-first CSS framework
- `autoprefixer` - CSS vendor prefixes
- `postcss` - CSS processing

### 3. Start Frontend Server

```bash
# Start Vite development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🔧 Configuration

### Backend URLs

- **API Base**: `http://localhost:8000/api/`
- **Admin Panel**: `http://localhost:8000/admin/`
- **API Documentation**: `http://localhost:8000/api/docs/`

### Frontend Routes

- **Home**: `http://localhost:3000/`
- **Products**: `http://localhost:3000/products`
- **Admin Login**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`
- **Product Management**: `http://localhost:3000/admin/products`
- **Banner Management**: `http://localhost:3000/admin/banners`

## 📸 Image Upload Configuration

### Backend Media Settings

The backend is configured to handle:
- **Product Images**: `/media/products/`
- **Category Images**: `/media/categories/`
- **Banner Images**: `/media/banners/`

### Frontend Image Handling

The frontend supports:
- **Multiple Product Images**: Upload up to 10 images per product
- **Primary Image Selection**: First image is marked as primary
- **Image Preview**: Real-time preview before upload
- **Image Validation**: Only image files accepted

## 🎯 Admin Features

### 1. Admin Dashboard
- **Statistics Overview**: Products, orders, users, categories
- **Quick Actions**: Direct access to management pages
- **Recent Activity**: Latest orders and products

### 2. Product Management
- **Create/Edit Products**: Full CRUD operations
- **Image Upload**: Multiple images with preview
- **Stock Management**: Track inventory
- **Pricing**: Set regular and compare-at prices
- **Status Control**: Activate/deactivate products
- **Featured Products**: Mark products as featured

### 3. Banner Management
- **Create/Edit Banners**: Full CRUD operations
- **Image Upload**: Banner images with preview
- **Order Control**: Reorder banners with drag-and-drop
- **Status Control**: Activate/deactivate banners
- **Link Configuration**: Set banner links and button text

### 4. Authentication
- **Secure Login**: JWT-based authentication
- **Role-based Access**: Admin-only access to management pages
- **Session Management**: Automatic logout on token expiry

## 🎨 UI/UX Features

### Homepage
- **Amazon-style Banner Slider**: Auto-playing carousel with navigation
- **Feature Cards**: Shipping, security, returns, quality badges
- **Featured Products Grid**: Modern product cards with hover effects
- **Newsletter Signup**: Email capture section

### Product Cards
- **Modern Design**: Clean, professional appearance
- **Hover Effects**: Scale and shadow animations
- **Rating Display**: Star ratings with review count
- **Discount Badges**: Visual discount indicators
- **Wishlist Button**: Quick wishlist access
- **Stock Status**: Clear availability indicators

### Responsive Design
- **Mobile First**: Optimized for all screen sizes
- **TailwindCSS**: Modern utility-first styling
- **Smooth Animations**: Professional transitions and effects

## 🚀 Production Deployment

### Backend Production Settings

1. **Set DEBUG=False** in `.env`
2. **Configure ALLOWED_HOSTS** with your domain
3. **Set up SSL/HTTPS**
4. **Configure static files serving**
5. **Set up production database**

### Frontend Production Build

```bash
cd frontend

# Build for production
npm run build

# The build will be in the 'dist' folder
```

## 🔍 Troubleshooting

### Common Issues

1. **MySQL Connection Error**
   - Check MySQL server is running
   - Verify credentials in `.env` file
   - Ensure database exists

2. **Frontend Build Error**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

3. **Image Upload Not Working**
   - Check media folder permissions
   - Verify file size limits
   - Check allowed file types

4. **Admin Login Issues**
   - Create superuser if not exists
   - Check JWT settings in backend
   - Verify CORS configuration

### Debug Mode

Enable debug mode by setting `DEBUG=True` in backend `.env` file for detailed error messages.

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the API documentation at `/api/docs/`
3. Check browser console for frontend errors
4. Check Django logs for backend errors

## 🔄 Updates and Maintenance

### Regular Tasks
- **Database Backups**: Regular MySQL backups
- **Log Rotation**: Clean up old logs
- **Security Updates**: Keep dependencies updated
- **Performance Monitoring**: Monitor site performance

### Feature Enhancements
The system is built to be easily extensible. Common additions include:
- **Order Management**: Complete order processing
- **Payment Integration**: Stripe, PayPal, etc.
- **Shipping Integration**: Real-time shipping rates
- **Email Notifications**: Transactional emails
- **Advanced Analytics**: Sales and user analytics

---

## 🎉 You're All Set!

Your e-commerce platform is now ready with:
- ✅ MySQL database
- ✅ Modern Amazon-inspired UI
- ✅ Admin management system
- ✅ Image upload capabilities
- ✅ Banner management
- ✅ Product management

Start by logging into the admin panel and creating your first products and banners!
