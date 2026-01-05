import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../../store/slices/cartSlice'
import { createOrder } from '../../store/slices/orderSlice'
import { toast } from 'react-toastify'
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  WalletIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

const PaymentGateway = ({ cartItems, totalAmount, shippingAddress, orderData, onBack }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Pay using UPI, Credit Card, Debit Card, Net Banking',
      icon: <CreditCardIcon className="w-6 h-6" />,
      popular: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive the order',
      icon: <BanknotesIcon className="w-6 h-6" />
    },
    {
      id: 'wallet',
      name: 'Wallet',
      description: 'Pay using your wallet balance',
      icon: <WalletIcon className="w-6 h-6" />
    }
  ]

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait...')
      return
    }

    setLoading(true)

    try {
      // Use orderData if provided, otherwise create from cartItems
      const orderPayload = orderData || {
        items: cartItems.map(item => ({
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_method: 'razorpay'
      }

      const response = await fetch('/api/payments/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(orderPayload)
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_u1DRIWH5V7YPoY',
        amount: totalAmount * 100, // Razorpay works in paise
        currency: 'INR',
        name: 'ShopHub',
        description: `Order #${order.id}`,
        order_id: order.razorpay_order_id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/payments/verify/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id
              })
            })

            if (verifyResponse.ok) {
              toast.success('Payment successful! Order placed successfully.')
              dispatch(clearCart())
              navigate(`/orders/${order.id}`)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.')
            console.error('Payment verification error:', error)
          }
        },
        prefill: {
          name: user?.first_name || 'User',
          email: user?.email || '',
          contact: user?.phone_number || ''
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            toast.info('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      toast.error('Failed to initiate payment. Please try again.')
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCashOnDelivery = async () => {
    setLoading(true)

    try {
      // Use orderData if provided, otherwise create from cartItems
      const orderPayload = orderData || {
        items: cartItems.map(item => ({
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_method: 'cod'
      }

      const response = await fetch('/api/payments/cod/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(orderPayload)
      })

      if (response.ok) {
        toast.success('Order placed successfully! Pay when you receive the order.')
        dispatch(clearCart())
        navigate(`/orders/${response.data.id}`)
      } else {
        throw new Error('Failed to create order')
      }

    } catch (error) {
      toast.error('Failed to place order. Please try again.')
      console.error('COD order error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment()
    } else if (paymentMethod === 'cod') {
      handleCashOnDelivery()
    } else if (paymentMethod === 'wallet') {
      toast.info('Wallet payment coming soon!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Checkout
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Payment Method</h1>
          <p className="text-gray-600 mt-2">Choose your preferred payment method</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Total Amount:</p>
                <p className="text-2xl font-bold text-blue-600">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  paymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className={`p-2 rounded-lg ${
                      paymentMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {method.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900">{method.name}</h3>
                      {method.popular && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <ShieldCheckIcon className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h3 className="font-medium text-green-900">Secure Payment</h3>
              <p className="text-sm text-green-700">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading || !razorpayLoaded}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processing...
            </>
          ) : (
            <>
              <LockClosedIcon className="w-5 h-5 mr-2" />
              Pay ₹{totalAmount.toFixed(2)}
            </>
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By completing this payment, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default PaymentGateway
