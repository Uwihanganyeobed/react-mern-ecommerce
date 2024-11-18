import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton"; // Import Skeleton loader
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles

export default function Headings() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://react-mern-back-end.onrender.com/products/");
        // Filter products by category 'logo-admin'
        const filteredProducts = response.data.filter(
          (product) => product.category === "automotive"
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === products.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-10">
          <div className="relative isolate overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 px-6 pt-16 shadow-lg sm:rounded-1xl sm:px-16 py-10 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <Skeleton height={40} width={`80%`} className="mb-4" />{" "}
              {/* Title Skeleton */}
              <Skeleton height={20} width={`90%`} className="mb-4" />{" "}
              {/* Description Skeleton */}
              <Skeleton height={30} width={`50%`} className="mb-4" />{" "}
              {/* Button Skeleton */}
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <Skeleton height="100%" width="100%" className="rounded-lg" />{" "}
              {/* Image Skeleton */}
            </div>
          </div>
        </div>
      </div>
    ); // Show skeletons until products are fetched
  }

  return (
    <div className="bg-white" id="headings">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-10">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 px-6 pt-16 shadow-lg sm:rounded-1xl sm:px-16 py-10 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {products[currentSlide].name}
              <br />
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              This is one of our top products, {products[currentSlide].name}, at
              a discounted price of ${products[currentSlide].new_price}. Don't
              miss this great offer!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link
                to={`/blog/${products[currentSlide]._id}`}
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all duration-300"
              >
                Buy Now
              </Link>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/30 to-transparent rounded-lg"></div>
            <img
              alt={products[currentSlide].name}
              src={products[currentSlide].image}
              className="absolute left-0 top-10 w-[550px] h-[350px] max-w-none rounded-lg bg-white shadow-lg ring-1 ring-gray-200 object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
        {/* Pagination Controls */}
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
