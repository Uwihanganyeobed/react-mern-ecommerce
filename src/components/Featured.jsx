import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { featuredSettings as settings } from "../utils/slickSettings";

const featuredProducts = [
  {
    _id: "1",
    name: "Sony PlayStation 5",
    image: "/images/ps5.jpg",
    new_price: 499.99,
    old_price: 599.99,
    rating: 5,
  },
  {
    _id: "2",
    name: "Apple Watch Ultra",
    image: "/images/apple_watch.jpg",
    new_price: 799.99,
    old_price: 899.99,
    rating: 4,
  },
];

export default function Featured() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        <Slider {...settings}>
          {featuredProducts.map((product) => (
            <div key={product._id} className="px-2">
              <Link to={`/featured/${product._id}`}>
                <img
                  alt={product.name}
                  src={product.image}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </Link>
              <h3 className="mt-2 text-sm text-gray-700">{product.name}</h3>
              <p className="text-sm font-medium text-red-600">${product.new_price}</p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
