import React, { useState, useEffect } from 'react';
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import { Link, useParams, useLocation } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from 'react-toastify';
import { useProducts } from '../context/productContext';
import { useCart } from '../context/cartContext';

export default function MonoProduct() {
  const { id } = useParams();
  const location = useLocation();
  const { 
    getProductById, 
    getNewProduct, 
    getFeaturedProduct, 
    getCategoryProduct,
    getBlogProduct 
  } = useProducts();
  
  // Import cart context functions
  const { addToCart, loading: cartLoading } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, location.pathname, getProductById, getNewProduct, getFeaturedProduct, getCategoryProduct, getBlogProduct]);

const handleAddToCart = async () => {
  try {
    // Determine which ID to use (_id or id)
    const productId = product._id || product.id;
    
    if (!productId) {
      toast.error("Could not determine product ID");
      return;
    }
    
    // Include color and size information if available
    const options = {};
    if (selectedColor) {
      options.color = selectedColor.name || selectedColor;
    }
    if (selectedSize) {
      options.size = selectedSize.name || selectedSize;
    }
    
    // Call the addToCart function from the cart context with options
    await addToCart(productId, quantity, options);
    
    // Toast success is handled in the context
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error("Failed to add product to cart");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Product not found</p>
        <Link to="/products" className="text-indigo-600 hover:text-indigo-800">
          Return to Products
        </Link>
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
              (product.images && product.images.length > 0 ? product.images[0].url : '') ||
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
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
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

            {/* Add to Cart Button */}
            <button
              className={`mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 ${
                cartLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              {cartLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding to Cart...
                </span>
              ) : (
                'Add to Cart'
              )}
            </button>
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
    </div>
  );
}