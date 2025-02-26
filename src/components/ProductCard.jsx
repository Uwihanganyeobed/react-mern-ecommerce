import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';

const ProductCard = ({ product }) => {
  // Calculate discount percentage if available
  const discountPercentage = product.discountPercentage || 
    (product.price && product.price.original && product.price.current 
      ? Math.round(((product.price.original - product.price.current) / product.price.original) * 100)
      : 0);

  // Handle rating display
  const rating = product.rating?.average || 0;
  const totalStars = 5;

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 h-80">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.thumbnail || (product.images && product.images[0]?.url) || "/path/to/placeholder.jpg"}
            alt={product.title}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </Link>
        
        {/* Sale badge if on sale */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 font-medium">
            <Link to={`/product/${product._id}`}>
              {product.title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
          
          {/* Star ratings */}
          <div className="mt-1 flex items-center">
            {[...Array(totalStars)].map((_, index) => (
              <StarIcon
                key={index}
                className={`h-4 w-4 ${
                  index < rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                aria-hidden="true"
              />
            ))}
            {product.rating?.count > 0 && (
              <span className="ml-1 text-xs text-gray-500">
                ({product.rating.count})
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          {/* If there's a discount, show original price */}
          {discountPercentage > 0 && product.price?.original && (
            <p className="text-xs text-gray-500 line-through">
              ${typeof product.price.original === 'number' ? product.price.original.toFixed(2) : product.price.original}
            </p>
          )}
          
          {/* Current price */}
          <p className="text-sm font-medium text-gray-900">
            ${typeof product.price?.current === 'number' 
              ? product.price.current.toFixed(2) 
              : (product.price || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;