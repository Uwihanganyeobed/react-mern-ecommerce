import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { product as productApi } from "../services/api";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Headings() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  const slideTimerRef = useRef(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching top rated products...');
        const response = await productApi.getTopRatedProducts();
        console.log('API Response:', response);
        
        // Check all possible formats the data might be in
        let productData = [];
        if (response?.data) {
          productData = response.data;
        } else if (Array.isArray(response)) {
          productData = response;
        }
        
        console.log('Processed product data:', productData);
        
        if (productData.length > 0) {
          setProducts(productData);
        } else {
          // If still no products, try with featured instead as fallback
          console.log('No top rated products found, fetching featured products as fallback');
          const featuredResponse = await productApi.getFeaturedProducts();
          const featuredData = featuredResponse?.data || featuredResponse || [];
          setProducts(featuredData);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!products.length) return;
    
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    };

    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, products.length]);

  // Reset timer when manually changing slides
  useEffect(() => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }
    
    slideTimerRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000); // Resume auto-play after 10 seconds of inactivity
    
    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Pause auto-play when manually changing slides
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  // Format price helper
  const formatPrice = (price) => {
    if (!price) return '$0.00';
    if (typeof price === 'object' && price.current) {
      return `$${price.current.toFixed(2)}`;
    }
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-10">
          <div className="relative isolate overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 px-6 pt-16 shadow-lg sm:rounded-1xl sm:px-16 py-10 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <Skeleton height={40} width={`80%`} className="mb-4" />
              <Skeleton height={20} width={`90%`} className="mb-4" />
              <Skeleton height={30} width={`50%`} className="mb-4" />
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <Skeleton height="100%" width="100%" className="rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white py-24">
        <div className="text-center text-gray-600">
          No top rated products available
        </div>
      </div>
    );
  }

  const currentProduct = products[currentSlide];
  
  // Safety check for currentProduct
  if (!currentProduct) {
    console.log('No current product found');
    return null;
  }

  return (
    <div className="bg-white" id="headings">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-10">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 px-6 pt-16 shadow-lg sm:rounded-1xl sm:px-16 py-10 md:pt-24 lg:flex lg:flex-row lg:items-center lg:gap-x-20 lg:px-24 lg:pt-0">
          {/* Left arrow navigation */}
          <button 
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
          </button>
          
          {/* Content */}
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-1 lg:py-32 lg:text-left">
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {currentProduct.title}
                <br />
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {currentProduct.shortDescription || currentProduct.description?.substring(0, 120) + '...'}
                <span className="block mt-2 font-semibold">
                  {formatPrice(currentProduct.price)}
                  {currentProduct.discountPercentage > 0 && (
                    <span className="ml-2 text-red-600">
                      {currentProduct.discountPercentage}% OFF
                    </span>
                  )}
                </span>
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link
                  to={`/product/${currentProduct._id}`}
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all duration-300"
                >
                  Buy Now
                </Link>
                <Link
                  to={`/product/${currentProduct._id}`}
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
                >
                  View Details <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative mt-16 h-80 lg:mt-8 lg:h-96 w-full lg:w-1/2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/30 to-transparent rounded-lg"></div>
            <img
              alt={currentProduct.title}
              src={currentProduct.thumbnail || currentProduct.images?.[0]?.url || currentProduct.images?.[0]}
              className="w-full h-full rounded-lg bg-white shadow-lg ring-1 ring-gray-200 object-cover transition-all duration-500 animate-slideIn"
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </div>
          
          {/* Right arrow navigation */}
          <button 
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        
        {/* Slide indicators */}
        <div className="mt-8 flex justify-center gap-x-4">
          {products.map((_, index) => (
            <button
              key={index}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => handleSlideChange(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
      
      {/* Add these animations to your CSS or tailwind.config.js */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}