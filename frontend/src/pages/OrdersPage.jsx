import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../store/api/api'
import { useState } from 'react'
import './OrdersPage.css'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="container">
          <p>Please login to view your orders.</p>
        </div>
      </div>
    )
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.order_number}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className={`status ${order.status}`}>{order.status}</span>
                    <span className={`payment-status ${order.payment_status}`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span>${item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.total}</strong>
                  </div>
                  <Link to={`/orders/${order.id}`} className="view-order-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage

