import React, { useState } from 'react';
import { useProducts } from '../../context/productContext';

const ProductFilter = () => {
  const { fetchFilteredProducts, categories } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleFilter = async () => {
    const filters = {
      category: selectedCategory,
      minPrice,
      maxPrice,
    };
    await fetchFilteredProducts(filters);
  };

  return (
    <div className="product-filter p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Filter Products</h2>
      <div className="filter-group mb-4">
        <label className="block text-sm font-medium text-gray-700">Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block text-sm font-medium text-gray-700">Min Price:</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
      <div className="filter-group mb-4">
        <label className="block text-sm font-medium text-gray-700">Max Price:</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
      <button
        onClick={handleFilter}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default ProductFilter;