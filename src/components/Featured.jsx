import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton loader
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Featured() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products/');
        const featured = response.data.filter(product => product.is_featured); // Filter featured products based on `is_featured`
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Helper function to render rating stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.68h4.905c.969 0 1.371 1.24.588 1.81l-3.97 2.907 1.518 4.681c.3.922-.755 1.688-1.54 1.11l-3.97-2.906-3.97 2.906c-.784.578-1.838-.188-1.54-1.11l1.518-4.68-3.97-2.907c-.784-.57-.38-1.81.588-1.81h4.905l1.518-4.68z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Featured Products
        </h2>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="px-2">
                <Skeleton height={200} className="rounded-md mb-2" /> {/* Image Skeleton */}
                <Skeleton height={20} width={`80%`} className="mb-2" /> {/* Title Skeleton */}
                <Skeleton height={20} width={`50%`} /> {/* Price Skeleton */}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            {featuredProducts.length > 0 ? (
              <Slider {...settings}>
                {featuredProducts.map((product) => (
                  <div key={product._id} className="px-2">
                    <div className="group relative">
                      {/* Rating */}
                      <div className="absolute top-2 left-2 flex">
                        {renderStars(product.rating)}
                      </div>

                      {/* Image with Hover */}
                      <Link to={`/product/${product._id}`}>
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 cursor-pointer">
                          <img
                            alt={product.name}
                            src={product.image}
                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                          />
                        </div>
                      </Link>

                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">
                            <Link to={`/product/${product._id}`}>
                              <span aria-hidden="true" className="absolute inset-0" />
                              {product.name}
                            </Link>
                          </h3>
                          {/* Displaying old and new price */}
                          {product.old_price ? (
                            <div className="flex items-center space-x-2">
                              <p className="text-sm line-through text-gray-500">${product.old_price}</p>
                              <p className="text-sm font-medium text-red-600">${product.new_price}</p>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-gray-900">${product.new_price}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p>No featured products available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}