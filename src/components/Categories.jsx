import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Import the Slick carousel
import "slick-carousel/slick/slick.css"; // Slick Carousel CSS
import "slick-carousel/slick/slick-theme.css"; // Slick Theme CSS
import { Link } from "react-router-dom"; // Assuming you're using react-router-dom for linking
import Skeleton from "react-loading-skeleton"; // Import Skeleton loader
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles
import axios from "axios"; // Import axios
import { categorySettings as settings } from "../utils/slickSettings";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch products from backend or update based on search results
  useEffect(() => {


  // Fetch products and filter by unique categories
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://react-mern-back-end.onrender.com/products/"
      );
      const uniqueCategories = filterUniqueCategories(response.data);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
});
  // Filter unique categories excluding 'logo-admin'
  const filterUniqueCategories = (products) => {
    const uniqueCategories = [];
    const seenCategories = new Set();

    products.forEach((product) => {
      if (
        product.category !== "logo-admin" &&
        !seenCategories.has(product.category)
      ) {
        seenCategories.add(product.category);
        uniqueCategories.push(product); // Add one product per category excluding 'logo-admin'
      }
    });

    return uniqueCategories;
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Categories</h2>
            <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-2">
                  <Skeleton height={200} className="rounded-lg mb-2" /> {/* Image Skeleton */}
                  <Skeleton height={20} width="80%" /> {/* Category Skeleton */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100" id="categories">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Categories</h2>

          {/* Slick Carousel */}
          <Slider {...settings} className="mt-6">
            {categories.map((categoryProduct) => (
              <div key={categoryProduct._id} className="group relative p-2">
                <Link to={`/category/${categoryProduct._id}`} className="block">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64 transition duration-300 ease-in-out transform hover:scale-105">
                    <img
                      alt={categoryProduct.name}
                      src={categoryProduct.image}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-6 text-sm text-gray-500">
                    <span>{categoryProduct.category}</span>
                  </h3>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
