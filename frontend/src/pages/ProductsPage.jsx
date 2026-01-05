import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../store/slices/productSlice'
import './ProductsPage.css'

const ProductsPage = () => {
  const dispatch = useDispatch()
  const { products, categories, loading } = useSelector((state) => state.products)
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    min_price: '',
    max_price: '',
  })

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, filters])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  return (
    <div className="products-page">
      <div className="container">
        <h1>Products</h1>
        <div className="products-layout">
          <aside className="filters">
            <h3>Filters</h3>
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
              />
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleFilterChange}
                placeholder="Min"
              />
            </div>
            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                placeholder="Max"
              />
            </div>
          </aside>
          <div className="products-section">
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
                      {product.discount_percentage > 0 && (
                        <span className="discount">
                          -{product.discount_percentage}%
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage

