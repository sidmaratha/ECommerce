import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import './Header.css'

const Header = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>E-Commerce</h1>
        </Link>
        <nav className="nav">
          <Link to="/products">Products</Link>
          <Link to="/admin/login" className="admin-link">Admin</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders">Orders</Link>
              <Link to="/profile" className="profile-link">
                <FaUser /> {user?.email}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <Link to="/cart" className="cart-link">
            <FaShoppingCart />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header

