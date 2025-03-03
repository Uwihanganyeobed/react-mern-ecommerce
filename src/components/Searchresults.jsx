import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSearch } from '../context/searchContext';
import { useProducts } from '../context/productContext';
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton"; // Import React Skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton styles

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchProducts, filterProducts, searchResults, loading } = useSearch();
  const { categories } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Set items per page
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  // Get all URL params
  const query = searchParams.get("q");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "newest",
    colors: searchParams.get("colors")?.split(',') || [],
    sizes: searchParams.get("sizes")?.split(',') || [],
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
    brand: searchParams.get("brand") || "",
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 10
  });

  useEffect(() => {
    const performSearch = async () => {
      try {
        // If no query or filters, fetch all products
        if (!query && !Object.values(filters).some(value => value)) {
          const results = await searchProducts({ sortBy: 'newest' });
          return;
        }

        const searchParams = {
          q: query || '',
          ...filters
        };
        
        let results;
        if (query) {
          results = await searchProducts(searchParams);
        } else {
          results = await filterProducts(filters);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    performSearch();
  }, [query, filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value || value === false || value === 0) {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    if (query) params.set('q', query);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
      colors: [],
      sizes: [],
      inStock: false,
      onSale: false,
      brand: "",
      page: 1,
      limit: 10
    });
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    setSearchParams(params);
  };

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper function to format price
  const formatPrice = (priceObj) => {
    if (!priceObj) return 'N/A';
    if (typeof priceObj === 'number') return `$${priceObj.toFixed(2)}`;
    if (typeof priceObj === 'object') {
      return {
        current: `$${priceObj.current.toFixed(2)}`,
        original: priceObj.original ? `$${priceObj.original.toFixed(2)}` : null,
        compareAt: priceObj.compareAt ? `$${priceObj.compareAt.toFixed(2)}` : null,
      };
    }
    return `$${parseFloat(priceObj).toFixed(2)}`;
  };

  // Helper function to get primary image
  const getPrimaryImage = (product) => {
    if (!product.images) return product.thumbnail;
    const primaryImage = product.images.find(img => img.isPrimary);
    return primaryImage ? primaryImage.url : product.images[0]?.url || product.thumbnail;
  };

  console.log('Current search results:', searchResults); // Debug log

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with search info and filter toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold">
          {query ? `Search Results for "${query}"` : 'All Products'}
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-2 sm:mt-0 flex items-center text-gray-600 hover:text-gray-900"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Enhanced Filters Section */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            

            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="rounded-md border-gray-300 py-2"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="rounded-md border-gray-300 py-2"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="ml-2">In Stock</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) => handleFilterChange("onSale", e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="ml-2">On Sale</span>
                </label>
              </div>
            </div>

            <input
              type="text"
              placeholder="Brand"
              value={filters.brand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              className="rounded-md border-gray-300 py-2"
            />
          </div>

          <div className="mt-4 border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="rounded-md border-gray-300 py-2 w-full sm:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-800 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 mr-1" />
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.category || filters.minPrice || filters.maxPrice || filters.sortBy !== "newest") && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (key === 'sortBy' && value === 'newest')) return null;
            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
              >
                {`${key}: ${value}`}
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {error && (
        <div className="text-red-600 mb-4 p-4 bg-red-50 rounded">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Render skeleton placeholders */}
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <Skeleton height={160} className="rounded-lg" /> {/* Image placeholder */}
                <Skeleton width="80%" height={20} className="mt-2" /> {/* Title placeholder */}
                <Skeleton width="40%" height={20} className="mt-1" /> {/* Price placeholder */}
              </div>
            ))}
        </div>
      ) : searchResults && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentItems.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="block border p-4 rounded-lg hover:shadow transition duration-300"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={getPrimaryImage(product)}
                  alt={product.title || product.name}
                  className="h-40 w-full object-cover object-center group-hover:opacity-75"
                />
                {product.flags?.isNew && (
                  <span className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 text-xs rounded">
                    New
                  </span>
                )}
                {product.flags?.onSale && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                    Sale
                  </span>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.title || product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {product.shortDescription || product.description?.substring(0, 100)}
                </p>
                <div className="mt-2">
                  {product.price && (
                    <div className="flex items-baseline space-x-2">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(product.price).current}
                      </p>
                      {product.price.original && (
                        <p className="text-sm text-red-500 line-through">
                          {formatPrice(product.price).original}
                        </p>
                      )}
                    </div>
                  )}
                  {product.rating && (
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`h-4 w-4 ${
                              index < product.rating.average
                                ? 'text-yellow-400'
                                : 'text-gray-200'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm text-gray-500">
                          ({product.rating.count})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {query 
              ? `No products found for "${query}"` 
              : 'No products match the selected filters'}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {searchResults.length > itemsPerPage && (
        <div className="flex justify-center mt-8">
          {Array(Math.ceil(searchResults.length / itemsPerPage))
            .fill()
            .map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-4 py-2 rounded-md transition duration-200 ${
                  currentPage === index + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
