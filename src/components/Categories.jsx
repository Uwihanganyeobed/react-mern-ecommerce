import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { categorySettings as settings } from "../utils/slickSettings";

const categories = [
  {
    _id: "1",
    category: "Laptops",
    image: "/images/laptops.jpg",
  },
  {
    _id: "2",
    category: "Headphones",
    image: "/images/headphones.jpg",
  },
];

export default function Categories() {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Shop by Categories</h2>
        <Slider {...settings}>
          {categories.map((cat) => (
            <div key={cat._id} className="p-2">
              <Link to={`/category/${cat._id}`}>
                <img className="w-full h-64 object-cover rounded-lg" src={cat.image} alt={cat.category} />
              </Link>
              <h3 className="mt-2 text-center">{cat.category}</h3>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
