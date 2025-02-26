import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/productContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { getCategoryProduct, loading } = useProducts();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      const result = await getCategoryProduct(id);
      if (result.success && result.data) {
        setProduct(result.data.product);
        setCategory(result.data.category);
        setRelatedProducts(result.data.relatedProducts || []);
        
        // Set the first image as selected by default
        if (result.data.product?.images?.length > 0) {
          setSelectedImage(result.data.product.images[0].url);
        } else if (result.data.product?.thumbnail) {
          setSelectedImage(result.data.product.thumbnail);
        }
      }
    };
    
    if (id) {
      fetchProductDetails();
    }
  }, [id, getCategoryProduct]);
  
  if (loading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="h-96 bg-gray-300 rounded-lg"></div>
            <div className="mt-10 lg:mt-0">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="mt-4 h-4 bg-gray-300 rounded"></div>
              <div className="mt-2 h-4 bg-gray-300 rounded"></div>
              <div className="mt-6 h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="mt-10 h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link to={`/category/${category?.name?.toLowerCase()}`} className="ml-2 text-gray-500 hover:text-gray-700 capitalize">
                {category?.name || product.category}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-2 text-gray-900 font-medium truncate max-w-xs">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Image gallery */}
          <div className="flex flex-col">
            <div className="overflow-hidden rounded-lg mb-4">
              <img
                src={selectedImage || product.thumbnail}
                alt={product.title}
                className="h-full w-full object-cover object-center"
                style={{ height: '500px' }}
              />
            </div>
            <div className="flex space-x-4 overflow-x-auto">
              {product.images?.map((image, index) => (
                <div 
                  key={index} 
                  className={`cursor-pointer border-2 rounded-md ${
                    selectedImage === image.url ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.alt || product.title}
                    className="h-24 w-24 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product info */}
          <div className="mt-10 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>
            
            {/* Brand */}
            {product.brand && (
              <div className="mt-2">
                <h3 className="sr-only">Brand</h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
              </div>
            )}
            
            {/* Rating */}
            {product.rating && (
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      className={`h-5 w-5 flex-shrink-0 ${
                        index < Math.round(product.rating.average)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">
                  {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
                </p>
              </div>
            )}
            
            {/* Price */}
            <div className="mt-6">
              <h3 className="sr-only">Price</h3>
              <div className="flex items-center">
                <p className="text-2xl font-medium text-gray-900">
                  ${product.price?.current}
                </p>
                {product.price?.original && product.price.original > product.price.current && (
                  <p className="ml-3 text-lg text-gray-500 line-through">
                    ${product.price.original}
                  </p>
                )}
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <p className="text-base text-gray-900">{product.description}</p>
            </div>
            
            {/* Add to cart button */}
            <div className="mt-10">
              <button
                type="button"
                className="w-full bg-blue-600 py-3 px-4 rounded-md text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900">Related Products</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {relatedProducts.map((related) => (
                <div key={related._id} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      src={related.thumbnail}
                      alt={related.title}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link to={`/product/${related._id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {related.title}
                        </Link>
                      </h3>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${related.price?.current}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}