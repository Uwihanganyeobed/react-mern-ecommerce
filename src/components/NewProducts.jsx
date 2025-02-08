import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { newSettings as settings } from "../utils/slickSettings";

const newProducts = [
  {
    _id: "1",
    name: "Apple iPhone 15 Pro",
    image: "/images/iphone15.jpg",
    new_price: 999.99,
    category: "electronics",
    rating: 5,
  },
  {
    _id: "2",
    name: "Nike Air Max 2024",
    image: "/images/nike.jpg",
    new_price: 199.99,
    category: "shoes",
    rating: 4,
  },
  {
    _id: "3",
    name: "Sony WH-1000XM5",
    image: "/images/sony_wh1000.jpg",
    new_price: 349.99,
    category: "electronics",
    rating: 5,
  },
];

export default function NewProducts() {
  return (
    <section className="py-24 bg-gray-50" id="newProducts">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-bold text-4xl text-black mb-8 text-center">
          New Arrivals
        </h2>
        <Slider {...settings}>
          {newProducts.map((product) => (
            <div key={product._id} className="p-4">
              <Link
                to={`/new/${product._id}`}
                className="relative bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
              >
                <img
                  className="rounded-t-lg object-cover w-full h-56"
                  src={product.image}
                  alt={product.name}
                />
                <div className="p-4">
                  <h6 className="font-semibold text-base text-black">
                    {product.name}
                  </h6>
                  <h6 className="font-semibold text-base text-indigo-600 text-right">
                    ${product.new_price}
                  </h6>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`h-4 w-4 ${
                          index < product.rating ? "text-orange-600" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .587l3.668 7.429L24 9.188c.285.041.396.391.191.586l-5.93 5.773L19.399 24c.049.285-.248.506-.495.372L12 18.896l-7.642 4.006c-.247.134-.544-.087-.495-.372l1.399-8.151L0 .587c-.205-.195-.094-.545.191-.586l8.209-1.188L12 .587z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
