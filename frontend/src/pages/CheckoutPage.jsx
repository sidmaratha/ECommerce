import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart } from '../store/slices/cartSlice'
import { fetchUserProfile } from '../store/slices/authSlice'
import api from '../store/api/api'
import { toast } from 'react-toastify'
import PaymentGateway from '../components/Payment/PaymentGateway'
import './CheckoutPage.css'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, totalPrice } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const [addresses, setAddresses] = useState([])
  const [shippingAddressId, setShippingAddressId] = useState('')
  const [billingAddressId, setBillingAddressId] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    dispatch(fetchCart())
    dispatch(fetchUserProfile())
    fetchAddresses()
  }, [dispatch])

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/users/addresses/')
      const addressesData = Array.isArray(response.data) ? response.data : []
      setAddresses(addressesData)
      const defaultShipping = addressesData.find((addr) => addr.is_default && addr.address_type === 'shipping')
      if (defaultShipping) {
        setShippingAddressId(defaultShipping.id)
        setSelectedAddress(defaultShipping)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      setAddresses([])
    }
  }

  const calculateTotal = () => {
    const subtotal = totalPrice || 0
    const tax = subtotal * 0.1
    const shipping = subtotal > 500 ? 0 : 50 // Free shipping over ₹500
    return subtotal + tax + shipping
  }

  const handleProceedToPayment = async (e) => {
    e.preventDefault()
    if (!shippingAddressId) {
      toast.error('Please select a shipping address')
      return
    }

    const address = addresses && addresses.find(addr => addr.id === parseInt(shippingAddressId))
    if (!address) {
      toast.error('Selected address not found')
      return
    }
    
    setSelectedAddress(address)
    
    // Create order data for payment
    const orderData = {
      items: items.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shipping_address: address,
      billing_address: addresses && addresses.find(addr => addr.id === parseInt(billingAddressId)) || address,
      payment_method: 'razorpay', // Default to Razorpay
      notes,
      subtotal: totalPrice,
      tax: totalPrice * 0.1,
      shipping_cost: totalPrice > 500 ? 0 : 50,
      total_amount: calculateTotal()
    }
    
    setShowPayment(true)
    setOrderData(orderData)
  }

  const handleBackToCheckout = () => {
    setShowPayment(false)
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart to proceed with checkout</p>
            <button 
              onClick={() => navigate('/products')}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showPayment && orderData) {
    return (
      <PaymentGateway
        cartItems={items}
        totalAmount={calculateTotal()}
        shippingAddress={selectedAddress}
        orderData={orderData}
        onBack={handleBackToCheckout}
      />
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className="step active">
              <span className="step-number">1</span>
              <span className="step-name">Address</span>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-name">Payment</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-name">Complete</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleProceedToPayment} className="checkout-form">
          <div className="checkout-content">
            <div className="checkout-details">
              <section className="address-section">
                <h2>Shipping Address</h2>
                {addresses.filter(addr => addr.address_type === 'shipping').length > 0 ? (
                  <div className="address-list">
                    {addresses
                      .filter((addr) => addr.address_type === 'shipping')
                      .map((addr) => (
                        <div key={addr.id} className="address-card">
                          <label className="address-label">
                            <input
                              type="radio"
                              name="shipping_address"
                              value={addr.id}
                              checked={shippingAddressId === addr.id.toString()}
                              onChange={(e) => setShippingAddressId(e.target.value)}
                              required
                            />
                            <div className="address-content">
                              <div className="address-header">
                                <strong>{addr.address_type}</strong>
                                {addr.is_default && <span className="default-badge">Default</span>}
                              </div>
                              <p>{addr.street_address}</p>
                              <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                              <p>{addr.country}</p>
                            </div>
                          </label>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="no-addresses">
                    <p>No shipping addresses found</p>
                    <button 
                      type="button"
                      onClick={() => navigate('/profile')}
                      className="add-address-btn"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </section>

              <section className="address-section">
                <h2>Billing Address</h2>
                <select
                  value={billingAddressId}
                  onChange={(e) => setBillingAddressId(e.target.value)}
                  className="address-select"
                >
                  <option value="">Same as shipping</option>
                  {addresses
                    .filter((addr) => addr.address_type === 'billing')
                    .map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.street_address}, {addr.city}, {addr.state} {addr.postal_code}
                      </option>
                    ))}
                </select>
              </section>

              <section className="notes-section">
                <h2>Order Notes</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for delivery..."
                  rows="4"
                  className="notes-textarea"
                />
              </section>
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-items">
                {items.map((item, index) => (
                  <div key={index} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%):</span>
                  <span>₹{(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{totalPrice > 500 ? 'FREE' : `₹50.00`}</span>
                </div>
                {totalPrice <= 500 && (
                  <div className="shipping-note">
                    <p>Add ₹{(500 - totalPrice).toFixed(2)} more for free shipping!</p>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="proceed-payment-btn">
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/cart')}
                className="back-to-cart-btn"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage

