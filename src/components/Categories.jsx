import React, { useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { categorySettings as settings } from "../utils/slickSettings";
import { useProducts } from "../context/productContext";

export default function Categories() {
  const { categories, loading } = useProducts();
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
            {categories.map((cat) => (
              <div key={cat._id} className="p-2">
                <Link to={`/category/${cat._id}`}>
                  <img 
                    className="w-full h-64 object-cover rounded-lg" 
                    src={cat.image || "/path/to/default-image.jpg"} 
                    alt={cat.category} 
                  />
                </Link>
                <h3 className="mt-2 text-center font-medium">{cat.category}</h3>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
  
}
