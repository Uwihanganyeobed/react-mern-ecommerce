import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/productContext";
import Skeleton from "react-loading-skeleton";

export default function Categories() {
  const { categories, fetchCategories, loading } = useProducts();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="group">
                <Skeleton height={200} />
                <Skeleton width={100} className="mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {categories.map((category) => (
            <div key={category.category} className="group relative h-full">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.category}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({category.count} items)
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {category.products.slice(0, 4).map((product, idx) => (
                      <Link 
                        key={product._id}
                        to={`/product/${product._id}`}
                        className={`relative aspect-square overflow-hidden rounded-lg bg-gray-200 ${
                          idx >= category.products.length ? 'invisible' : ''
                        }`}
                      >
                        <img
                          src={product.thumbnail || product.images[0]}
                          alt={product.title}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1">
                          <p className="text-xs truncate">{product.title}</p>
                          <p className="text-xs font-medium">${product.price.current}</p>
                        </div>
                      </Link>
                    ))}
                    {/* Add placeholder items if less than 4 products */}
                    {[...Array(Math.max(0, 4 - category.products.length))].map((_, idx) => (
                      <div 
                        key={`placeholder-${idx}`}
                        className="aspect-square bg-gray-100 rounded-lg"
                      />
                    ))}
                  </div>

                  <Link
                    to={`/search?q=${category.category}`}
                    className="mt-auto inline-block w-full text-center py-2 px-4 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                  >
                    See all {category.count} items →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}