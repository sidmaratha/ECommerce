import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'
import './ProductDetailPage.css'

const ProductDetailPage = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { product, loading } = useSelector((state) => state.products)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    dispatch(fetchProduct(slug))
  }, [dispatch, slug])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }
    dispatch(addToCart({ product, quantity }))
    toast.success('Product added to cart!')
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          <div className="product-images">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].image}
                alt={product.name}
                className="main-image"
              />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          <div className="product-details">
            <h1>{product.name}</h1>
            <div className="price-section">
              <span className="price">${product.price}</span>
              {product.compare_at_price && (
                <span className="compare-price">${product.compare_at_price}</span>
              )}
              {product.discount_percentage > 0 && (
                <span className="discount-badge">
                  -{product.discount_percentage}% OFF
                </span>
              )}
            </div>
            <p className="description">{product.description}</p>
            <div className="stock-info">
              {product.in_stock ? (
                <span className="in-stock">In Stock ({product.stock_quantity})</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="add-to-cart-btn"
              >
                Add to Cart
              </button>
            </div>
            {product.reviews && product.reviews.length > 0 && (
              <div className="reviews-section">
                <h3>Reviews</h3>
                {product.reviews.map((review) => (
                  <div key={review.id} className="review">
                    <div className="review-header">
                      <strong>{review.user.email}</strong>
                      <span className="rating">⭐ {review.rating}/5</span>
                    </div>
                    <h4>{review.title}</h4>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage

