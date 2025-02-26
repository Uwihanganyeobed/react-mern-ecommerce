import React, { useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { categorySettings as settings } from "../utils/slickSettings";
import { useProducts } from "../context/productContext";

export default function Categories() {
  const { categories, fetchCategories, loading } = useProducts();
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading || !categories || categories.length === 0) {
    return (
      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Categories</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
                <div className="mt-2 h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Shop by Categories</h2>
        <div className="mt-6">
          <Slider {...settings}>
          {categories
  .filter((cat) => cat?.category) // Only include categories with valid 'category' property
  .map((cat) => (
    <div key={cat._id} className="p-2">
      <Link to={`/category/${cat.category.toLowerCase()}`}>
        <div className="relative h-64 overflow-hidden rounded-lg group">
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            src={cat.image || "/path/to/default-image.jpg"}
            alt={cat.category}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
        </div>
        <h3 className="mt-2 text-center font-medium text-gray-900">{cat.category}</h3>
      </Link>
    </div>
  ))}

          </Slider>
        </div>
      </div>
    </div>
  );
}