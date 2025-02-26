import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { useProducts } from '../../context/productContext';

const CategoryProducts = () => {
  const { category } = useParams();
  const { getProductsByCategory, loading } = useProducts();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const data = await getProductsByCategory(category);
        if (data && data.data) {
          setCategoryProducts(data.data);
        } else if (Array.isArray(data)) {
          setCategoryProducts(data);
        } else {
          setCategoryProducts([]);
        }
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Failed to load products. Please try again later.');
      }
    };

    if (category) {
      fetchCategoryProducts();
    }
  }, [category, getProductsByCategory]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 8].map((item) => (
            <div key={item} className="group relative">
              <div className="h-80 w-full overflow-hidden rounded-lg bg-gray-200"></div>
              <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
          {category.charAt(0).toUpperCase() + category.slice(1)} Products
        </h1>
        
        {categoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900">No products found</h2>
            <p className="mt-2 text-gray-600">Try checking another category or return to the home page.</p>
            <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;