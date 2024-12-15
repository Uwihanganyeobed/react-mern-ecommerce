import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton"; // Import React Skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton styles

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // Extract 'q' from the URL
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Set items per page

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        const response = await fetch(
          `https://react-mern-back-end.onrender.com/products/search?q=${query}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>

      {isLoading ? (
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
      ) : currentItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentItems.map((product) => (
            <Link
              key={product._id}
              to={`/${product._id}`}
              className="block border p-4 rounded-lg hover:shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover rounded-lg"
              />
              <h3 className="mt-2 text-lg font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">${product.new_price}</p>
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
      <div className="flex justify-center mt-4">
        {Array(Math.ceil(results.length / itemsPerPage))
          .fill()
          .map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
      </div>
    </div>
  );
}
