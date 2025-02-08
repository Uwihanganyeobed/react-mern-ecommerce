import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSearch } from '../context/searchContext';
import Skeleton from "react-loading-skeleton"; // Import React Skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton styles

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // Extract 'q' from the URL
  const { searchProducts, searchResults, loading } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Set items per page

  useEffect(() => {
    let isSubscribed = true;

    const performSearch = async () => {
      if (!query) return;
      
      try {
        const results = await searchProducts({ q: query });
        if (isSubscribed) {
          console.log('Search completed:', results);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    performSearch();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isSubscribed = false;
    };
  }, [query, searchProducts]); // Only re-run when query or searchProducts changes

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
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>

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
        <p className="text-center text-lg font-semibold text-gray-600 mt-6">
        <span role="img" aria-label="sad face" className="mr-2">😞</span>
        No products found for "<span className="text-indigo-600 font-bold">{query}</span>".
      </p>
      
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
