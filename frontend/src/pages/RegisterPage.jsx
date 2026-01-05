import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../store/slices/authSlice'
import { toast } from 'react-toastify'
import './AuthPage.css'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match')
      return
    }
    try {
      await dispatch(register(formData)).unwrap()
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      // Display specific validation errors
      if (error.errors) {
        setErrors(error.errors)
        Object.keys(error.errors).forEach(field => {
          const fieldErrors = error.errors[field]
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach(err => {
              toast.error(`${field}: ${err}`)
            })
          } else {
            toast.error(`${field}: ${fieldErrors}`)
          }
        })
      } else {
        toast.error(error.detail || 'Registration failed')
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">
                {Array.isArray(errors.email) ? errors.email.join(', ') : errors.email}
              </span>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={errors.first_name ? 'error' : ''}
              />
              {errors.first_name && (
                <span className="error-message">
                  {Array.isArray(errors.first_name) ? errors.first_name.join(', ') : errors.first_name}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={errors.last_name ? 'error' : ''}
              />
              {errors.last_name && (
                <span className="error-message">
                  {Array.isArray(errors.last_name) ? errors.last_name.join(', ') : errors.last_name}
                </span>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={errors.phone_number ? 'error' : ''}
            />
            {errors.phone_number && (
              <span className="error-message">
                {Array.isArray(errors.phone_number) ? errors.phone_number.join(', ') : errors.phone_number}
              </span>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-message">
                {Array.isArray(errors.password) ? errors.password.join(', ') : errors.password}
              </span>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              className={errors.password2 ? 'error' : ''}
            />
            {errors.password2 && (
              <span className="error-message">
                {Array.isArray(errors.password2) ? errors.password2.join(', ') : errors.password2}
              </span>
            )}
          </div>
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage

