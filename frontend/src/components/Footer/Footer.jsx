import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3>E-Commerce Store</h3>
            <p>Your trusted online shopping destination. We offer the best products at competitive prices with excellent customer service.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns & Refunds</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/support">Support Center</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="contact-info">
              <li>
                <FaMapMarkerAlt />
                <span>123 Shopping Street, City, State 12345</span>
              </li>
              <li>
                <FaPhone />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <FaEnvelope />
                <span>support@ecommerce.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          <h4>We Accept</h4>
          <div className="payment-icons">
            <span className="payment-icon">Visa</span>
            <span className="payment-icon">Mastercard</span>
            <span className="payment-icon">PayPal</span>
            <span className="payment-icon">Amex</span>
            <span className="payment-icon">Discover</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
          <p className="footer-links">
            <Link to="/privacy">Privacy</Link> | 
            <Link to="/terms">Terms</Link> | 
            <Link to="/sitemap">Sitemap</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

