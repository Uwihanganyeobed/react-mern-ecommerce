import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/productContext';
import { StarIcon } from '@heroicons/react/20/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const RelatedProducts = ({ id }) => {
  const { getRelatedProducts } = useProducts();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef(null);
  const productsPerPage = 4;

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const response = await getRelatedProducts(id);
      const products = response?.products || response?.data || [];
      setRelatedProducts(products);
    };
    fetchRelatedProducts();
  }, [id, getRelatedProducts]);

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  // Calculate pagination for larger screens
  const totalPages = Math.ceil(relatedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const scroll = (direction) => {
    if (isScrolling || !scrollContainerRef.current) return;

    setIsScrolling(true);
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth;
    const scrollTo = direction === 'next' 
      ? container.scrollLeft + scrollAmount 
      : container.scrollLeft - scrollAmount;

    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });

    setTimeout(() => setIsScrolling(false), 500);
  };

  const ProductCard = ({ product }) => (
    <div className="min-w-[280px] sm:min-w-[320px] md:min-w-[300px] lg:w-full flex-shrink-0 group relative border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 mb-4">
        <img
          src={product.thumbnail || (product.images && product.images.length > 0 ? product.images[0].url : '/placeholder.jpg')}
          alt={product.title}
          className="h-48 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
        />
      </div>
      
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          <Link to={`/product/${product._id || product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </Link>
        </h3>
        <p className="text-xs text-gray-500 mt-1">{product.category}</p>
      </div>
      
      <div className="flex items-center mb-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            className={`h-4 w-4 ${index < (product.rating?.average || 0) ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">
          ({product.rating?.count || 0})
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-base font-medium text-gray-900">
            ${typeof product.price === 'object' ? product.price.current?.toFixed(2) : product.price?.toFixed(2)}
          </span>
          {product.price?.original && (
            <span className="text-sm line-through text-gray-500">
              ${product.price.original.toFixed(2)}
            </span>
          )}
        </div>
        
        {product.flags && (
          <div className="flex flex-col gap-1">
            {product.flags.isNew && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                New
              </span>
            )}
            {product.flags.onSale && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Sale
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white mt-12 pb-16 relative">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Related Products</h2>
        </div>

        {/* Mobile/Tablet Carousel View */}
        <div className="relative lg:hidden">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {relatedProducts.map((product) => (
              <div key={product._id || product.id} className="snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {relatedProducts.length > 1 && (
            <>
              <button
                onClick={() => scroll('prev')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 z-10"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={() => scroll('next')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 z-10"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {relatedProducts.slice(indexOfFirstProduct, indexOfLastProduct).map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>

        {/* Desktop Pagination */}
        {totalPages > 1 && (
          <div className="hidden lg:flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentPage === index + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;