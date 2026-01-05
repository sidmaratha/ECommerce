import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'
import './CartPage.css'

const CartPage = () => {
  const dispatch = useDispatch()
  const { items, totalPrice, loading } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [dispatch, isAuthenticated])

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    dispatch(updateCartItem({ itemId, quantity: newQuantity }))
      .then(() => dispatch(fetchCart()))
  }

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId))
      .then(() => {
        dispatch(fetchCart())
        toast.success('Item removed from cart')
      })
  }

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <p>Please login to view your cart.</p>
          <Link to="/login">Login</Link>
        </div>
      </div>
    )
  }

  if (loading) return <div className="loading">Loading...</div>

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Your Cart</h1>
          <p>Your cart is empty.</p>
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Your Cart</h1>
        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                {item.product?.primary_image && (
                  <img
                    src={item.product.primary_image}
                    alt={item.product.name}
                    className="item-image"
                  />
                )}
                <div className="item-details">
                  <Link to={`/products/${item.product?.slug}`}>
                    <h3>{item.product?.name}</h3>
                  </Link>
                  <p className="item-price">${item.product?.price}</p>
                </div>
                <div className="item-quantity">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="item-subtotal">
                  <p>${item.subtotal}</p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${(totalPrice * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(totalPrice * 1.1).toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage

