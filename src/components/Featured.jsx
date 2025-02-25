import React, { useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { featuredSettings as settings } from "../utils/slickSettings";
import { useProducts } from "../context/productContext";

export default function Featured() {
  const { featuredProducts, fetchFeaturedProducts, loading } = useProducts();

  // Only fetch on initial mount, not on every render
  useEffect(() => {
    // Don't fetch if we already have products
    if (!featuredProducts || featuredProducts.length === 0) {
      fetchFeaturedProducts();
    }
    // Empty dependency array means this only runs once on mount
  }, []);

  if (loading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
                <div className="mt-2 h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="mt-1 h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Normalize product array with safeguards
  const productArray = Array.isArray(featuredProducts) 
    ? featuredProducts 
    : (featuredProducts && featuredProducts.data && Array.isArray(featuredProducts.data)) 
      ? featuredProducts.data 
      : [];

  if (productArray.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <p className="mt-4 text-gray-500">No featured products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        <div className="mt-6">
          <Slider {...settings}>
            {productArray.map((product) => (
              <div key={product.id || product._id} className="px-2">
                <Link to={`/product/${product.id || product._id}`}>
                  <img
                    alt={product.title}
                    src={product.thumbnail || (product.images && product.images[0]?.url)}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </Link>
                <h3 className="mt-2 text-sm text-gray-700">{product.title}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm font-medium text-red-600">
                    ${(product.price?.current || (product.variants && product.variants[0]?.price) || 0).toFixed(2)}
                  </p>
                  {product.price?.original && (
                    <p className="text-sm text-gray-500 line-through">
                      ${product.price.original.toFixed(2)}
                    </p>
                  )}
                </div>
                {product.rating && (
                  <div className="mt-1 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating.average || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-xs text-gray-500">
                      ({(product.rating.count || 0)})
                    </span>
                  </div>
                )}
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}