import React, { useState } from 'react';
import { StarIcon } from "@heroicons/react/20/solid";
import { Radio, RadioGroup } from "@headlessui/react";
import { Link, useParams } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from 'react-toastify';

// Sample product data
const sampleProduct = {
  _id: "1",
  name: "Samsung Galaxy S24 Ultra",
  description: "Experience the next-gen smartphone with the new Samsung Galaxy S24 Ultra.",
  category: "electronics",
  image: "/images/samsung_s24.jpg",
  new_price: 1299.99,
  old_price: 1499.99,
  rating: 5,
  colors: [
    { name: "Black", code: "#000000" },
    { name: "Silver", code: "#C0C0C0" },
  ],
  sizes: [
    { name: "128GB", stockLevel: 10 },
    { name: "256GB", stockLevel: 5 },
  ],
  highlights: ["120Hz AMOLED Display", "5000mAh Battery", "Quad Camera System"],
};

export default function Monoproduct() {
  const { id } = useParams();
  const product = sampleProduct; // Using sample product instead of fetching from API
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Product not found</p>
        <Link to="/products" className="text-indigo-600 hover:text-indigo-800">
          Return to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <div className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <span className="text-sm font-medium text-gray-900">{product.category}</span>
            <span className="text-sm text-gray-500">/</span>
            <span className="text-sm font-medium text-gray-600">{product.name}</span>
          </div>
        </nav>

        {/* Product Image */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <img
            alt={product.name}
            src={product.image}
            className="h-full w-full object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8">
          <div className="lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {/* Price and Reviews */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <p className="text-3xl tracking-tight text-gray-900">${product.new_price}</p>
            <p className="text-sm line-through text-gray-500">${product.old_price}</p>

            {/* Reviews */}
            <div className="mt-6 flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={rating < product.rating ? "text-yellow-400" : "text-gray-300"}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                />
              ))}
              <p className="text-sm ml-2 text-gray-600">({product.rating} stars)</p>
            </div>

            {/* Color Selection */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-2 flex space-x-4">
                {product.colors.map((color) => (
                  <Radio
                    key={color.name}
                    value={color}
                    className="cursor-pointer border rounded-full p-2 text-center"
                  >
                    <span
                      className="block w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.code }}
                    />
                  </Radio>
                ))}
              </RadioGroup>
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Storage</h3>
              <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-2 flex space-x-4">
                {product.sizes.map((size) => (
                  <Radio
                    key={size.name}
                    value={size}
                    disabled={size.stockLevel === 0}
                    className="cursor-pointer border px-4 py-2 rounded-md"
                  >
                    {size.name}
                  </Radio>
                ))}
              </RadioGroup>
            </div>

            {/* Add to Cart Button */}
            <button
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>

          {/* Product Highlights */}
          <div className="mt-10 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h3 className="text-lg font-bold text-gray-900">Highlights</h3>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
              {product.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts id={product._id} />
    </div>
  );
}
