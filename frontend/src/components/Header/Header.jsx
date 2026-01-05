import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { 
  FaShoppingCart, 
  FaUser, 
  FaSearch, 
  FaHeart, 
  FaBars, 
  FaTimes,
  FaStore,
  FaMobileAlt,
  FaLaptop,
  FaTshirt,
  FaHome,
  FaGamepad,
  FaBook,
  FaBaby,
  FaHeartbeat
} from 'react-icons/fa'
import { MagnifyingGlassIcon, UserIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline'
import './Header.css'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesDropdown, setCategoriesDropdown] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const categories = [
    { name: 'Electronics', icon: <FaLaptop />, slug: 'electronics' },
    { name: 'Clothing', icon: <FaTshirt />, slug: 'clothing' },
    { name: 'Home & Garden', icon: <FaHome />, slug: 'home-garden' },
    { name: 'Sports & Outdoors', icon: <FaGamepad />, slug: 'sports-outdoors' },
    { name: 'Books & Media', icon: <FaBook />, slug: 'books-media' },
    { name: 'Toys & Games', icon: <FaBaby />, slug: 'toys-games' },
    { name: 'Beauty & Health', icon: <FaHeartbeat />, slug: 'beauty-personal-care' },
  ]

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="contact-info">
              <span>📞 1-800-123-4567</span>
              <span>✉️ support@ecommerce.com</span>
            </div>
            <div className="top-links">
              {isAuthenticated ? (
                <>
                  <Link to="/profile">My Account</Link>
                  <Link to="/orders">Track Order</Link>
                </>
              ) : (
                <>
                  <Link to="/login">Help</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <FaStore className="logo-icon" />
              <span className="logo-text">ShopHub</span>
            </Link>

            {/* Search Bar */}
            <form className="search-bar" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <MagnifyingGlassIcon className="search-icon" />
                </button>
              </div>
            </form>

            {/* Header Actions */}
            <div className="header-actions">
              {/* Wishlist */}
              <Link to="/wishlist" className="action-link">
                <HeartIcon className="action-icon" />
                <span>Wishlist</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="action-link cart-link">
                <ShoppingCartIcon className="action-icon" />
                <span>Cart</span>
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>

              {/* Account */}
              {isAuthenticated ? (
                <div className="account-dropdown">
                  <button className="account-btn">
                    <UserIcon className="action-icon" />
                    <span>Account</span>
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile">My Profile</Link>
                    <Link to="/orders">My Orders</Link>
                    <Link to="/wishlist">My Wishlist</Link>
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="action-link">
                  <UserIcon className="action-icon" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="main-nav">
        <div className="container">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            
            {/* Categories Dropdown */}
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => setCategoriesDropdown(true)}
              onMouseLeave={() => setCategoriesDropdown(false)}
            >
              <button className="nav-link dropdown-toggle">
                Categories <span className="dropdown-arrow">▼</span>
              </button>
              <div className={`dropdown-menu categories-menu ${categoriesDropdown ? 'show' : ''}`}>
                <div className="categories-grid">
                  {categories.map((category) => (
                    <Link 
                      key={category.slug}
                      to={`/products?category=${category.slug}`}
                      className="category-item"
                    >
                      <div className="category-icon">{category.icon}</div>
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            <li className="nav-item">
              <Link to="/products?is_featured=true" className="nav-link">Deals</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link">All Products</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
              />
              <button type="submit">
                <FaSearch />
              </button>
            </form>
          </div>
          
          <ul className="mobile-nav-menu">
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setMobileMenuOpen(false)}>All Products</Link></li>
            <li><Link to="/products?is_featured=true" onClick={() => setMobileMenuOpen(false)}>Deals</Link></li>
            <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
            
            {isAuthenticated ? (
              <>
                <li><Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</Link></li>
                <li><Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link></li>
                <li><Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>My Wishlist</Link></li>
                <li><button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link></li>
                <li><Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header

