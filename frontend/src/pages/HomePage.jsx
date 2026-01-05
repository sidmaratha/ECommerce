import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchBanners, fetchCategories } from '../store/slices/productSlice'
import BannerSlider from '../components/BannerSlider/BannerSlider'
import ProductCard from '../components/ProductCard/ProductCard'
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon,
  FireIcon,
  SparklesIcon,
  StarIcon,
  BoltIcon,
  ChevronRightIcon,
  TagIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { 
  FaLaptop,
  FaTshirt,
  FaHome,
  FaGamepad,
  FaBook,
  FaBaby,
  FaHeartbeat,
  FaMobile,
  FaHeadphones,
  FaCamera,
  FaShoePrints,
  FaDumbbell,
  FaGem,
  FaUtensils,
  FaCar
} from 'react-icons/fa'

const HomePage = () => {
  const dispatch = useDispatch()
  const { products, banners, categories, loading } = useSelector((state) => state.products)
  const [categoryProducts, setCategoryProducts] = useState({})

  useEffect(() => {
    dispatch(fetchBanners())
    dispatch(fetchCategories())
    dispatch(fetchProducts({ is_featured: true, page_size: 8 }))
    
    // Fetch products for each category
    const fetchCategoryProducts = async () => {
      const categoriesToFetch = ['electronics', 'clothing', 'home-garden', 'sports-outdoors']
      const productsByCategory = {}
      
      for (const categorySlug of categoriesToFetch) {
        try {
          const response = await fetch(`/api/products/?category=${categorySlug}&page_size=4`)
          const data = await response.json()
          if (data.results) {
            productsByCategory[categorySlug] = data.results
          }
        } catch (error) {
          console.error(`Error fetching ${categorySlug} products:`, error)
        }
      }
      
      setCategoryProducts(productsByCategory)
    }
    
    fetchCategoryProducts()
  }, [dispatch])

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Shipping',
      description: 'On orders over $50',
      color: 'blue'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Payment',
      description: '100% secure transactions',
      color: 'green'
    },
    {
      icon: ArrowPathIcon,
      title: 'Easy Returns',
      description: '30 days return policy',
      color: 'purple'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Best Quality',
      description: 'Premium products only',
      color: 'orange'
    }
  ]

  const categoryIcons = {
    'electronics': FaLaptop,
    'clothing': FaTshirt,
    'home-garden': FaHome,
    'sports-outdoors': FaGamepad,
    'books-media': FaBook,
    'toys-games': FaBaby,
    'beauty-personal-care': FaHeartbeat,
    'food-beverages': FaUtensils
  }

  const getCategoryInfo = (slug) => {
    const info = {
      'electronics': { 
        name: 'Electronics', 
        color: 'blue',
        bgGradient: 'from-blue-500 to-cyan-500',
        icon: FaLaptop
      },
      'clothing': { 
        name: "Men's Wear", 
        color: 'purple',
        bgGradient: 'from-purple-500 to-pink-500',
        icon: FaTshirt
      },
      'home-garden': { 
        name: 'Home & Living', 
        color: 'green',
        bgGradient: 'from-green-500 to-emerald-500',
        icon: FaHome
      },
      'sports-outdoors': { 
        name: 'Sports & Fitness', 
        color: 'orange',
        bgGradient: 'from-orange-500 to-red-500',
        icon: FaGamepad
      }
    }
    return info[slug] || { name: slug, color: 'gray', bgGradient: 'from-gray-500 to-gray-600', icon: FaShoppingBagIcon }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Slider */}
      <BannerSlider banners={banners} />

      {/* Flash Deals Banner */}
      <section className="relative bg-gradient-to-r from-red-500 to-orange-500 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FireIcon className="w-12 h-12 text-white animate-pulse" />
              <div>
                <h2 className="text-3xl font-bold text-white">Flash Deals</h2>
                <p className="text-red-100">Limited time offers - Up to 70% OFF!</p>
              </div>
            </div>
            <Link 
              to="/products?is_featured=true"
              className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Shop Now</span>
              <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`mx-auto w-16 h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-${feature.color}-200 transition-all duration-300 transform group-hover:scale-110`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <SparklesIcon className="w-8 h-8 text-yellow-500 mr-2" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <SparklesIcon className="w-8 h-8 text-yellow-500 ml-2" />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
                </div>
              )}
            </>
          )}

          {products && products.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                View All Products
                <ChevronRightIcon className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Category Sections */}
      {Object.entries(categoryProducts).map(([categorySlug, categoryProducts]) => {
        const categoryInfo = getCategoryInfo(categorySlug)
        const CategoryIcon = categoryInfo.icon
        
        return (
          <section key={categorySlug} className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${categoryInfo.bgGradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <CategoryIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {categoryInfo.name}
                    </h2>
                    <p className="text-gray-600">Explore our latest collection</p>
                  </div>
                </div>
                <Link
                  to={`/products?category=${categorySlug}`}
                  className={`text-${categoryInfo.color}-600 hover:text-${categoryInfo.color}-700 font-semibold flex items-center space-x-2 transition-colors duration-200`}
                >
                  <span>View All</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </Link>
              </div>

              {/* Products Grid */}
              {categoryProducts && categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <CategoryIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No {categoryInfo.name.toLowerCase()} available at the moment.</p>
                </div>
              )}
            </div>
          </section>
        )
      })}

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Shop With Us?</h2>
            <p className="text-gray-300 text-lg">We provide the best shopping experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <TagIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
              <p className="text-gray-300">Get the best deals and exclusive offers on all products</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-300">Quick and reliable delivery to your doorstep</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Care</h3>
              <p className="text-gray-300">24/7 support for all your shopping needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <BoltIcon className="w-8 h-8 text-yellow-400 mr-2" />
            <h2 className="text-3xl font-bold text-white">Stay Updated</h2>
            <BoltIcon className="w-8 h-8 text-yellow-400 ml-2" />
          </div>
          <p className="text-blue-100 text-lg mb-8">
            Subscribe to our newsletter to get the latest updates and exclusive offers
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-90 placeholder-gray-600"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default HomePage

