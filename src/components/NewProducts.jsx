import React, { useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { newSettings as settings } from "../utils/slickSettings";
import { useProducts } from "../context/productContext";

export default function NewProducts() {
  const { newProducts, fetchNewProducts, loading } = useProducts();

  useEffect(() => {
    if (!newProducts || newProducts.length === 0) {
      fetchNewProducts();
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
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

  const productArray = Array.isArray(newProducts)
    ? newProducts
    : newProducts && newProducts.data && Array.isArray(newProducts.data)
    ? newProducts.data
    : [];

  if (productArray.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
          <p className="mt-4 text-gray-500">
            No new products available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
        <div className="mt-6">
          <Slider {...settings}>
            {productArray.map((product) => (
              <div key={product.id || product._id} className="px-2">
                {product.flags?.isNew && (
                  <Link
                    to="/new-products"
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md"
                  >
                    New
                  </Link>
                 )} 
                <Link to={`/product/${product.id || product._id}`}>
                  <img
                    alt={product.title}
                    src={
                      product.thumbnail ||
                      (product.images && product.images[0]?.url)
                    }
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </Link>
                <h3 className="mt-2 text-sm text-gray-700">{product.title}</h3>
                <p className="text-xs text-gray-500">
                  {product.shortDescription}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm font-medium text-red-600">
                    ${(product.price?.current || 0).toFixed(2)}
                  </p>
                  {product.price?.original && (
                    <p className="text-sm text-gray-500 line-through">
                      ${product.price.original.toFixed(2)}
                    </p>
                  )}
                </div>
                {product.stock > 0 ? (
                  <p className="text-green-600 text-xs">In Stock</p>
                ) : (
                  <p className="text-red-600 text-xs">Out of Stock</p>
                )}
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
