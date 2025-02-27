import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/productContext';
import { StarIcon } from '@heroicons/react/20/solid';

const RelatedProducts = ({ id }) => {
  const { getRelatedProducts } = useProducts();
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const response = await getRelatedProducts(id);
      // Handle the response structure properly
      const products = response?.products || response?.data || [];
      console.log('Processed related products:', products);
      setRelatedProducts(products);
    };
    fetchRelatedProducts();
  }, [id, getRelatedProducts]);

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white mt-12 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Related Products</h2>
        
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {relatedProducts.map((product) => (
            <div key={product._id || product.id} className="group relative border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 mb-4">
                <img
                  src={product.thumbnail || (product.images && product.images.length > 0 ? product.images[0].url : '/placeholder.jpg')}
                  alt={product.title}
                  className="h-48 w-full object-cover object-center"
                />
              </div>
              
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-900">
                  <Link to={`/product/${product._id || product.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.title}
                  </Link>
                </h3>
                <p className="text-xs text-gray-500 mt-1">{product.category}</p>
              </div>
              
              {/* Rating display */}
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const rating = product.rating?.average || 0;
                  return (
                    <StarIcon
                      key={index}
                      className={`h-4 w-4 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                    />
                  );
                })}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.rating?.count || 0})
                </span>
              </div>
              
              {/* Price display with sale pricing */}
              <div className="flex items-center">
                {product.price ? (
                  typeof product.price === 'object' ? (
                    <>
                      <p className="text-base font-medium text-gray-900">
                        ${product.price.current ? product.price.current.toFixed(2) : '0.00'}
                      </p>
                      {product.price.original && (
                        <p className="text-sm line-through text-gray-500 ml-2">
                          ${product.price.original.toFixed(2)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-base font-medium text-gray-900">
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                    </p>
                  )
                ) : (
                  <p className="text-base font-medium text-gray-900">$0.00</p>
                )}
              </div>
              
              {/* Product badges/flags */}
              {product.flags && (
                <div className="absolute top-2 right-2 flex flex-col gap-1">
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
                  {product.flags.isBestSeller && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                      Best Seller
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;