import React from 'react'
import './AboutPage.css'

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About Us</h1>
        <div className="about-content">
          <section>
            <h2>Welcome to E-Commerce Store</h2>
            <p>
              We are a leading online retailer committed to providing our customers with 
              the best shopping experience. Our mission is to offer high-quality products 
              at competitive prices with exceptional customer service.
            </p>
          </section>

          <section>
            <h2>Our Story</h2>
            <p>
              Founded with a vision to make online shopping simple and enjoyable, 
              E-Commerce Store has grown to become a trusted name in e-commerce. 
              We carefully curate our product selection to ensure quality and value 
              for our customers.
            </p>
          </section>

          <section>
            <h2>Why Choose Us?</h2>
            <ul>
              <li>Wide selection of quality products</li>
              <li>Competitive prices and regular discounts</li>
              <li>Fast and reliable shipping</li>
              <li>Excellent customer support</li>
              <li>Secure payment options</li>
              <li>Easy returns and refunds</li>
            </ul>
          </section>

          <section>
            <h2>Our Values</h2>
            <p>
              We believe in transparency, quality, and customer satisfaction. 
              Every decision we make is guided by our commitment to providing 
              the best possible experience for our customers.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

