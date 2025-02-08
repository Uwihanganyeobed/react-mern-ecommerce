import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { product as productApi } from "../services/api";

export default function Headings() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching featured products...');
        const response = await productApi.getFeaturedProducts();
        console.log('API Response:', response);
        
        if (response.success && response.data) {
          const featuredProducts = response.data.filter(product => 
            product.flags?.isFeatured || product.flags?.isNew
          );
          console.log('Filtered Featured Products:', featuredProducts);
          setProducts(featuredProducts);
        } else {
          console.log('No products found in response');
          setProducts([]);
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

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  // Format price helper
  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return `$${price.current.toFixed(2)}`;
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
          No featured products available
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

  console.log('Rendering product:', currentProduct);

  return (
    <div className="bg-white" id="headings">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-10">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 px-6 pt-16 shadow-lg sm:rounded-1xl sm:px-16 py-10 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {currentProduct.title}
              <br />
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {currentProduct.shortDescription}
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
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/30 to-transparent rounded-lg"></div>
            <img
              alt={currentProduct.title}
              src={currentProduct.thumbnail || currentProduct.images?.[0]?.url}
              className="absolute left-0 top-10 w-[550px] h-[350px] max-w-none rounded-lg bg-white shadow-lg ring-1 ring-gray-200 object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-x-4">
          {products.map((_, index) => (
            <button
              key={index}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-8 bg-gray-900"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => handleSlideChange(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
