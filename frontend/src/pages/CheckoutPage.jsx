import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart } from '../store/slices/cartSlice'
import { fetchUserProfile } from '../store/slices/authSlice'
import api from '../store/api/api'
import { toast } from 'react-toastify'
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

  useEffect(() => {
    dispatch(fetchCart())
    dispatch(fetchUserProfile())
    fetchAddresses()
  }, [dispatch])

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/users/addresses/')
      setAddresses(response.data)
      const defaultShipping = response.data.find((addr) => addr.is_default && addr.address_type === 'shipping')
      if (defaultShipping) {
        setShippingAddressId(defaultShipping.id)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!shippingAddressId) {
      toast.error('Please select a shipping address')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/orders/create/', {
        shipping_address_id: parseInt(shippingAddressId),
        billing_address_id: billingAddressId ? parseInt(billingAddressId) : null,
        notes,
      })
      toast.success('Order placed successfully!')
      navigate(`/orders/${response.data.id}`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <p>Your cart is empty.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            <div className="checkout-details">
              <section className="address-section">
                <h2>Shipping Address</h2>
                <select
                  value={shippingAddressId}
                  onChange={(e) => setShippingAddressId(e.target.value)}
                  required
                >
                  <option value="">Select shipping address</option>
                  {addresses
                    .filter((addr) => addr.address_type === 'shipping')
                    .map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.street_address}, {addr.city}, {addr.state} {addr.postal_code}
                      </option>
                    ))}
                </select>
              </section>

              <section className="address-section">
                <h2>Billing Address</h2>
                <select
                  value={billingAddressId}
                  onChange={(e) => setBillingAddressId(e.target.value)}
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

              <section>
                <h2>Order Notes</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  rows="4"
                />
              </section>
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Tax:</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Shipping:</span>
                <span>$10.00</span>
              </div>
              <div className="summary-item total">
                <span>Total:</span>
                <span>${(totalPrice * 1.1 + 10).toFixed(2)}</span>
              </div>
              <button type="submit" disabled={loading} className="place-order-btn">
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage

