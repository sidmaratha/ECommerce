import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchBanners } from '../../store/slices/productSlice'
import api from '../../store/api/api'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import toast from 'react-toastify'

const BannerManagement = () => {
  const dispatch = useDispatch()
  const { banners, loading } = useSelector((state) => state.products)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
    button_text: 'Shop Now',
    is_active: true,
    banner_order: 0,
    image: null
  })

  useEffect(() => {
    dispatch(fetchBanners())
  }, [dispatch])

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      link: '',
      button_text: 'Shop Now',
      is_active: true,
      banner_order: 0,
      image: null
    })
    setEditingBanner(null)
  }

  const handleCreateBanner = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const handleEditBanner = (banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      link: banner.link || '',
      button_text: banner.button_text || 'Shop Now',
      is_active: banner.is_active,
      banner_order: banner.banner_order,
      image: null
    })
    setEditingBanner(banner)
    setShowCreateModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          data.append(key, formData[key])
        } else if (key !== 'image') {
          data.append(key, formData[key])
        }
      })

      if (editingBanner) {
        await api.put(`/products/banners/${editingBanner.id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Banner updated successfully')
      } else {
        await api.post('/products/banners/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Banner created successfully')
      }
      
      setShowCreateModal(false)
      resetForm()
      dispatch(fetchBanners())
    } catch (error) {
      toast.error('Failed to save banner')
    }
  }

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return
    }

    try {
      await api.delete(`/products/banners/${bannerId}/`)
      toast.success('Banner deleted successfully')
      dispatch(fetchBanners())
    } catch (error) {
      toast.error('Failed to delete banner')
    }
  }

  const handleToggleActive = async (banner) => {
    try {
      await api.patch(`/products/banners/${banner.id}/`, {
        is_active: !banner.is_active
      })
      toast.success(`Banner ${banner.is_active ? 'deactivated' : 'activated'} successfully`)
      dispatch(fetchBanners())
    } catch (error) {
      toast.error('Failed to update banner status')
    }
  }

  const moveBanner = async (bannerId, direction) => {
    const currentIndex = banners.findIndex(b => b.id === bannerId)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= banners.length) {
      return
    }

    try {
      const currentBanner = banners[currentIndex]
      const targetBanner = banners[newIndex]
      
      // Swap order values
      await Promise.all([
        api.patch(`/products/banners/${currentBanner.id}/`, {
          banner_order: targetBanner.banner_order
        }),
        api.patch(`/products/banners/${targetBanner.id}/`, {
          banner_order: currentBanner.banner_order
        })
      ])
      
      dispatch(fetchBanners())
      toast.success('Banner order updated successfully')
    } catch (error) {
      toast.error('Failed to update banner order')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-700 mr-4">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
            </div>
            
            <button
              onClick={handleCreateBanner}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Banner
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {banners && banners.length > 0 ? (
              banners.map((banner, index) => (
                <div key={banner.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {banner.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          banner.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {banner.subtitle && (
                        <p className="text-gray-600 mb-2">{banner.subtitle}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Order: {banner.banner_order}</span>
                        {banner.link && (
                          <span>Link: {banner.link}</span>
                        )}
                        <span>Button: {banner.button_text}</span>
                      </div>
                      
                      {banner.image_url && (
                        <div className="mt-4">
                          <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="h-32 w-auto object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {/* Order controls */}
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => moveBanner(banner.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowUpIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveBanner(banner.id, 'down')}
                          disabled={index === banners.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowDownIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Action buttons */}
                      <button
                        onClick={() => handleToggleActive(banner)}
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                        title={banner.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => handleEditBanner(banner)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No banners</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new banner.</p>
                <div className="mt-6">
                  <button
                    onClick={handleCreateBanner}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Banner
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingBanner ? 'Edit Banner' : 'Create Banner'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    placeholder="/products or https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.banner_order}
                    onChange={(e) => setFormData({...formData, banner_order: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {editingBanner && !formData.image && (
                    <p className="text-sm text-gray-500 mt-1">
                      Keep existing image or upload a new one
                    </p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingBanner ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BannerManagement
