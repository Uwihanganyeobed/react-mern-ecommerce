import React, { useState, useEffect } from 'react';
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from 'react-toastify';
import { useProducts } from '../context/productContext';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import { useUser } from '../context/userContext';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { ClipLoader } from 'react-spinners';
import RatingForm from './RatingForm';

export default function MonoProduct() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    getProductById, 
    getNewProduct, 
    getFeaturedProduct, 
    getCategoryProduct,
    getBlogProduct,
    getRelatedProducts
  } = useProducts();
  
  // Import cart context functions
  const { addToCart, loading: cartLoading } = useCart();
  const { isLoggedIn } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useUser();
  
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      let response = null;
      
      // Determine which API to use based on the URL path
      const path = location.pathname;
      
      try {
        if (path.includes('/new/')) {
          response = await getNewProduct(id);
        } else if (path.includes('/featured/')) {
          response = await getFeaturedProduct(id);
        } else if (path.includes('/category/')) {
          response = await getCategoryProduct(id);
        } else if (path.includes('/blog/')) {
          response = await getBlogProduct(id);
        } else {
          // Default product route
          response = await getProductById(id);
        }
        
        // Handle different response structures
        let productData = null;
        
        if (response && response.success && response.product) {
          // Handle {success: true, product: {...}} structure
          productData = response.product;
        } else if (response && response.data) {
          // Handle {data: {...}} structure
          productData = response.data;
        } else {
          // Handle direct product data structure
          productData = response;
        }
        
        if (productData) {
          console.log('Processed Product Data:', productData);
          setProduct(productData);
          
          // Set default color and size if available
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
          }
          
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
        }

        // Get related products
        const related = await getRelatedProducts(id);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, location.pathname, getProductById, getNewProduct, getFeaturedProduct, getCategoryProduct, getBlogProduct, getRelatedProducts]);

  // Check if product is in wishlist
  useEffect(() => {
    if (product && wishlist) {
      const productInWishlist = wishlist.some(item => item._id === product._id);
      setIsInWishlist(productInWishlist);
    }
  }, [product, wishlist]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.info('Please login to add items to cart');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      toast.info('Please login to add items to wishlist');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    try {
      setWishlistLoading(true);
      
      if (isInWishlist) {
        await removeFromWishlist(product._id);
        toast.success('Removed from wishlist');
        setIsInWishlist(false);
      } else {
        await addToWishlist(product._id);
        toast.success('Added to wishlist');
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleRatingSubmit = (data) => {
    setProduct(prev => ({
      ...prev,
      averageRating: data.averageRating
    }));
    setShowRatingForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <div className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <span className="text-sm font-medium text-gray-900">{product.category}</span>
            <span className="text-sm text-gray-500">/</span>
            <span className="text-sm font-medium text-gray-600">{product.title}</span>
          </div>
        </nav>

        {/* Product Image */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <img
            alt={product.title}
            src={
              selectedColor?.image || 
              product.thumbnail || 
              (product.images && product.images.length > 0 ? product.images[selectedImage].url : '') ||
              '/placeholder.jpg'
            }
            className="h-full w-full object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8">
          <div className="lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.title}
            </h1>
          </div>

          {/* Price and Reviews */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            {/* Price - Handle different price structures */}
            <div>
              {product.price ? (
                typeof product.price === 'object' ? (
                  <>
                    <p className="text-3xl tracking-tight text-gray-900">
                      ${product.price.current ? product.price.current.toFixed(2) : '0.00'}
                    </p>
                    {product.price.original && (
                      <p className="text-sm line-through text-gray-500">
                        ${product.price.original.toFixed(2)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-3xl tracking-tight text-gray-900">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </p>
                )
              ) : (
                <p className="text-3xl tracking-tight text-gray-900">$0.00</p>
              )}
            </div>

            {/* Reviews */}
            <div className="mt-6 flex items-center">
              {Array.from({ length: 5 }).map((_, index) => {
                const rating = product.rating?.average || product.rating || 0;
                return (
                  <StarIcon
                    key={index}
                    className={index < rating ? "text-yellow-400" : "text-gray-300"}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  />
                );
              })}
              <p className="text-sm ml-2 text-gray-600">
                ({product.rating?.count || 0} reviews)
              </p>
            </div>

            {/* Color Selection - Show only if colors are available */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Color or Variant</h3>
                <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-2 flex space-x-4">
                  {product.colors.map((color) => (
                    <RadioGroup.Option
                      key={color.name}
                      value={color}
                      className="cursor-pointer border rounded-full p-2 text-center"
                    >
                      <span
                        className="block w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.code }}
                      />
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Size Selection - Show only if sizes are available */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-2 flex space-x-4">
                  {product.sizes.map((size) => (
                    <RadioGroup.Option
                      key={size.name}
                      value={size}
                      disabled={size.stockLevel === 0}
                      className={({ active, checked, disabled }) =>
                        `cursor-pointer border px-4 py-2 rounded-md 
                        ${checked ? 'bg-indigo-600 text-white' : 'bg-white'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${active ? 'ring-2 ring-indigo-500' : ''}`
                      }
                    >
                      {size.name}
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Quantity Selector - New Addition */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="flex items-center mt-2 space-x-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className={`px-3 py-1 border border-gray-300 rounded-md ${
                    quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                >
                  -
                </button>
                <span className="text-gray-700">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Product Actions Section - Redesigned */}
            <div className="mt-8 space-y-6">
              {/* Add to Cart and Wishlist Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock <= 0}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {addingToCart ? (
                    <ClipLoader color="#ffffff" size={24} />
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </button>

                {/* Wishlist Button - Redesigned */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  className={`flex items-center justify-center px-6 py-3 border rounded-lg shadow-sm text-base font-medium transition-all duration-200 ${
                    isInWishlist 
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlistLoading ? (
                    <ClipLoader color="#4F46E5" size={24} />
                  ) : isInWishlist ? (
                    <>
                      <HeartSolid className="h-6 w-6 text-red-500" />
                      <span className="ml-2 hidden sm:inline">In Wishlist</span>
                    </>
                  ) : (
                    <>
                      <HeartOutline className="h-6 w-6 text-gray-400" />
                      <span className="ml-2 hidden sm:inline">Add to Wishlist</span>
                    </>
                  )}
                </button>
              </div>

              {/* Product Rating Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={`${
                            product.averageRating > rating ? 'text-yellow-400' : 'text-gray-300'
                          } h-5 w-5 flex-shrink-0`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-700">
                      {product.averageRating ? product.averageRating.toFixed(1) : 'No ratings yet'} 
                      {product.ratings?.length > 0 && (
                        <span className="ml-1 text-gray-500">({product.ratings.length} {product.ratings.length === 1 ? 'review' : 'reviews'})</span>
                      )}
                    </p>
                  </div>
                  
                  {isLoggedIn && (
                    <button
                      onClick={() => setShowRatingForm(!showRatingForm)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                    >
                      {showRatingForm ? 'Cancel' : 'Write a Review'}
                      {!showRatingForm && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5z" />
                      </svg>}
                    </button>
                  )}
                </div>
                
                {/* Rating Form - Animated Slide Down */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showRatingForm ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {showRatingForm && (
                    <RatingForm 
                      productId={product._id} 
                      onRatingSubmit={handleRatingSubmit} 
                    />
                  )}
                </div>
              </div>

              {/* Recent Reviews Section */}
              {product.ratings && product.ratings.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Recent Reviews</h3>
                  <div className="mt-2 space-y-4 max-h-80 overflow-y-auto pr-2">
                    {product.ratings.slice(0, 3).map((review, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {review.user.avatar ? (
                                <img className="h-10 w-10 rounded-full" src={review.user.avatar} alt="" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <span className="text-indigo-800 font-medium text-sm">
                                    {review.user.name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{review.user.name || 'Anonymous'}</p>
                              <div className="flex items-center mt-1">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <StarIcon
                                    key={rating}
                                    className={`${
                                      review.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                                    } h-4 w-4`}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {review.review && (
                          <p className="mt-2 text-sm text-gray-600">{review.review}</p>
                        )}
                      </div>
                    ))}
                    {product.ratings.length > 3 && (
                      <button 
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mt-2 flex items-center"
                        onClick={() => {/* Show all reviews */}}
                      >
                        View all {product.ratings.length} reviews
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Highlights */}
          {product.features && product.features.length > 0 && (
            <div className="mt-10 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h3 className="text-lg font-bold text-gray-900">Highlights</h3>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Product Description */}
          {product.description && (
            <div className="mt-10 lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900">Description</h3>
              <p className="mt-2 text-sm text-gray-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Product Details */}
      <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-10 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900">Product Details</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                <dl className="grid grid-cols-1 gap-1">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 text-sm">
                      <dt className="capitalize text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                      <dd className="text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            
            {/* Dimensions */}
            {product.dimensions && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Dimensions</h4>
                <dl className="grid grid-cols-1 gap-1">
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-500">Width</dt>
                    <dd className="text-gray-900">{product.dimensions.width} {product.dimensions.unit}</dd>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-500">Height</dt>
                    <dd className="text-gray-900">{product.dimensions.height} {product.dimensions.unit}</dd>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-500">Depth</dt>
                    <dd className="text-gray-900">{product.dimensions.depth} {product.dimensions.unit}</dd>
                  </div>
                </dl>
              </div>
            )}
            
            {/* Shipping Information */}
            {product.shipping && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
                <dl className="grid grid-cols-1 gap-1">
                  {product.shipping.freeShipping && (
                    <div className="flex items-center py-1 text-sm text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Free Shipping
                    </div>
                  )}
                  {product.shipping.handlingTime && (
                    <div className="flex justify-between py-1 text-sm">
                      <dt className="text-gray-500">Handling Time</dt>
                      <dd className="text-gray-900">
                        {product.shipping.handlingTime.min}-{product.shipping.handlingTime.max} {product.shipping.handlingTime.unit}
                      </dd>
                    </div>
                  )}
                  {product.shipping.dimensions && (
                    <div className="flex justify-between py-1 text-sm">
                      <dt className="text-gray-500">Package Dimensions</dt>
                      <dd className="text-gray-900">
                        {product.shipping.dimensions.width}×{product.shipping.dimensions.height}×{product.shipping.dimensions.depth} {product.shipping.dimensions.unit}
                      </dd>
                    </div>
                  )}
                  {product.shipping.weight && (
                    <div className="flex justify-between py-1 text-sm">
                      <dt className="text-gray-500">Shipping Weight</dt>
                      <dd className="text-gray-900">{product.shipping.weight} kg</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
            
            {/* Additional Information */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
              <dl className="grid grid-cols-1 gap-1">
                {product.brand && (
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-500">Brand</dt>
                    <dd className="text-gray-900">{product.brand}</dd>
                  </div>
                )}
                {product.sku && (
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-500">SKU</dt>
                    <dd className="text-gray-900">{product.sku}</dd>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-500">Weight</dt>
                    <dd className="text-gray-900">{product.weight.value} {product.weight.unit}</dd>
                  </div>
                )}
                {product.warrantyInformation && (
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-500">Warranty</dt>
                    <dd className="text-gray-900">{product.warrantyInformation}</dd>
                  </div>
                )}
                {product.returnPolicy && (
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-500">Return Policy</dt>
                    <dd className="text-gray-900">{product.returnPolicy}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products - Only show if product ID exists */}
      {(product._id || product.id) && <RelatedProducts id={product._id || product.id} />}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900">Related Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct._id} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                  <img
                    src={relatedProduct.thumbnail}
                    alt={relatedProduct.title}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={`/product/${relatedProduct._id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {relatedProduct.title}
                      </a>
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${relatedProduct.price?.current.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}