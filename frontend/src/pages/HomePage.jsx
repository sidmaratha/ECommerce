import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../store/slices/productSlice'
import './HomePage.css'

const HomePage = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts({ is_featured: true, page_size: 8 }))
  }, [dispatch])

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at great prices</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="product-card"
                >
                  {product.primary_image && (
                    <img
                      src={product.primary_image}
                      alt={product.name}
                      className="product-image"
                    />
                  )}
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage

