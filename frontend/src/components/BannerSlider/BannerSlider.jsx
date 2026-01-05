import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const BannerSlider = ({ banners }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const NextArrow = (props) => {
    const { className, style, onClick } = props
    return (
      <ChevronRightIcon
        className={className}
        style={{ ...style, display: 'block', color: '#1f2937', width: '40px', height: '40px' }}
        onClick={onClick}
      />
    )
  }

  const PrevArrow = (props) => {
    const { className, style, onClick } = props
    return (
      <ChevronLeftIcon
        className={className}
        style={{ ...style, display: 'block', color: '#1f2937', width: '40px', height: '40px' }}
        onClick={onClick}
      />
    )
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div>
        <ul className="m-0 p-0"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-3 h-3 bg-gray-300 rounded-full hover:bg-blue-500 transition-colors duration-200"></div>
    )
  }

  if (!mounted || !banners || banners.length === 0) {
    return (
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-96 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-xl md:text-2xl mb-8">Discover amazing products at great prices</p>
          <Link 
            to="/products" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 z-10"></div>
            <img
              src={banner.image_url}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className="text-lg md:text-xl lg:text-2xl mb-8 animate-slide-up">
                    {banner.subtitle}
                  </p>
                )}
                {banner.link && (
                  <Link
                    to={banner.link}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 animate-slide-up"
                  >
                    {banner.button_text || 'Shop Now'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default BannerSlider
