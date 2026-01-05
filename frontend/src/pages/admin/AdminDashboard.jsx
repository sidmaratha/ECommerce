import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchUserProfile, logout } from '../../store/slices/authSlice'
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  TagIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  PhotoIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, user])

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Products',
      value: '124',
      change: '+12%',
      changeType: 'positive',
      icon: ShoppingBagIcon,
      link: '/admin/products'
    },
    {
      name: 'Total Orders',
      value: '89',
      change: '+8%',
      changeType: 'positive',
      icon: ChartBarIcon,
      link: '/admin/orders'
    },
    {
      name: 'Total Users',
      value: '1,234',
      change: '+23%',
      changeType: 'positive',
      icon: UsersIcon,
      link: '/admin/users'
    },
    {
      name: 'Categories',
      value: '8',
      change: '0%',
      changeType: 'neutral',
      icon: TagIcon,
      link: '/admin/categories'
    }
  ]

  const quickActions = [
    {
      name: 'Manage Products',
      description: 'Add, edit, or remove products',
      icon: ShoppingBagIcon,
      link: '/admin/products',
      color: 'bg-blue-500'
    },
    {
      name: 'Manage Banners',
      description: 'Configure homepage banners',
      icon: PhotoIcon,
      link: '/admin/banners',
      color: 'bg-purple-500'
    },
    {
      name: 'Manage Categories',
      description: 'Organize product categories',
      icon: TagIcon,
      link: '/admin/categories',
      color: 'bg-green-500'
    },
    {
      name: 'Settings',
      description: 'Store configuration',
      icon: Cog6ToothIcon,
      link: '/admin/settings',
      color: 'bg-gray-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <HomeIcon className="h-6 w-6 text-gray-600 mr-2" />
                <span className="text-xl font-semibold text-gray-900">Admin Portal</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name || user?.email}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || 'Admin'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              to={stat.link}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === 'positive'
                          ? 'text-green-600'
                          : stat.changeType === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.link}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">{action.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order #{1000 + order}</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((product) => (
                <div key={product} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Product {product}</p>
                    <p className="text-xs text-gray-500">Added 1 day ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
