import React, { useEffect, useState } from 'react';
import { useUser } from '../context/userContext';
import { useCart } from '../context/cartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { HeartIcon, ShoppingCartIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading: userLoading } = useUser();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    setLoading(userLoading);
  }, [userLoading]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      setActionLoading(prev => ({ ...prev, [productId]: 'remove' }));
      await removeFromWishlist(productId);
      toast.success('Product removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: null }));
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setActionLoading(prev => ({ ...prev, [productId]: 'cart' }));
      await addToCart(productId, 1);
      toast.success('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Start adding products you love to your wishlist.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {wishlist.map(product => (
            <div key={product._id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Product Image with Quick Actions Overlay */}
              <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 group-hover:opacity-75">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300'}
                    alt={product.title}
                    className="w-full h-64 object-cover object-center"
                  />
                </Link>
                
                {/* Quick Action Buttons */}
                <div className="absolute top-0 right-0 p-2">
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    disabled={actionLoading[product._id] === 'remove'}
                    className="inline-flex items-center justify-center p-2 rounded-full bg-white shadow-md hover:bg-gray-100 focus:outline-none"
                  >
                    {actionLoading[product._id] === 'remove' ? (
                      <ClipLoader color="#4F46E5" size={16} />
                    ) : (
                      <HeartSolid className="h-5 w-5 text-red-500" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  <Link to={`/product/${product._id}`} className="hover:text-indigo-600">
                    {product.title}
                  </Link>
                </h3>
                
                {/* Category & Rating */}
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-xs text-gray-500">{product.category}</p>
                  {product.rating && (
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-xs text-gray-600">
                        {typeof product.rating === 'number' 
                          ? product.rating.toFixed(1) 
                          : typeof product.rating === 'object' && product.rating.rate 
                            ? product.rating.rate.toFixed(1)
                            : '0.0'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Price */}
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-900">${product.price?.current.toFixed(2)}</p>
                    {product.price?.original > product.price?.current && (
                      <p className="text-sm text-gray-500 line-through">${product.price?.original.toFixed(2)}</p>
                    )}
                  </div>
                  
                  {/* Stock Status */}
                  <div className="text-xs font-medium">
                    {product.stock > 0 ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={actionLoading[product._id] === 'cart' || product.stock <= 0}
                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      product.stock > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {actionLoading[product._id] === 'cart' ? (
                      <ClipLoader color="#ffffff" size={16} />
                    ) : (
                      <>
                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    disabled={actionLoading[product._id] === 'remove'}
                    className="w-full mt-2 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {actionLoading[product._id] === 'remove' ? (
                      <ClipLoader color="#4F46E5" size={16} />
                    ) : (
                      <>
                        <TrashIcon className="h-4 w-4 mr-2 text-red-500" />
                        Remove from Wishlist
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 