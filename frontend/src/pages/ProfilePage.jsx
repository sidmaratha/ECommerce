import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile } from '../store/slices/authSlice'
import api from '../store/api/api'
import { toast } from 'react-toastify'
import './ProfilePage.css'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    address_type: 'shipping',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    is_default: false,
  })

  useEffect(() => {
    dispatch(fetchUserProfile())
    fetchAddresses()
  }, [dispatch])

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/users/addresses/')
      setAddresses(response.data)
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/users/addresses/', addressForm)
      toast.success('Address added successfully')
      setShowAddressForm(false)
      setAddressForm({
        address_type: 'shipping',
        street_address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'United States',
        is_default: false,
      })
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to add address')
    }
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>
        <div className="profile-content">
          <section className="profile-section">
            <h2>Account Information</h2>
            <div className="profile-info">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
              <p><strong>Role:</strong> {user?.role}</p>
            </div>
          </section>

          <section className="profile-section">
            <div className="section-header">
              <h2>Addresses</h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="add-address-btn"
              >
                {showAddressForm ? 'Cancel' : 'Add Address'}
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="address-form">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={addressForm.address_type}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, address_type: e.target.value })
                    }
                  >
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={addressForm.street_address}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, street_address: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      value={addressForm.postal_code}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, postal_code: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, country: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn">
                  Add Address
                </button>
              </form>
            )}

            <div className="addresses-list">
              {addresses.map((address) => (
                <div key={address.id} className="address-card">
                  <div className="address-header">
                    <strong>{address.address_type}</strong>
                    {address.is_default && <span className="default-badge">Default</span>}
                  </div>
                  <p>
                    {address.street_address}, {address.city}, {address.state}{' '}
                    {address.postal_code}
                  </p>
                  <p>{address.country}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

