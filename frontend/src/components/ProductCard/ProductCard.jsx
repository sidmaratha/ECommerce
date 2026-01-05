import React from 'react'
import { Link } from 'react-router-dom'
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="w-4 h-4 text-yellow-400" />)
    }
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="w-4 h-4 text-yellow-400" />)
    }
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }
    return stars
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <div className="aspect-w-1 aspect-h-1 w-full h-64 bg-gray-200">
            {product.primary_image ? (
              <img
                src={product.primary_image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
        </Link>
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200">
          <HeartOutlineIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>

        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{product.discount_percentage}%
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-4 py-2 rounded-md font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating */}
        {product.average_rating && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {renderStars(product.average_rating)}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({product.review_count || 0})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.compare_at_price}
              </span>
            )}
          </div>
        </div>

        {/* Category */}
        {product.category && (
          <div className="mt-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category.name}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
