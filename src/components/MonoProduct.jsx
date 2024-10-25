import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { Radio, RadioGroup } from '@headlessui/react';
import { Link, useParams } from "react-router-dom"; // useParams to get the product ID from URL

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Monoproduct() { 
  const [product, setProduct] = useState(null); // Set product to null initially
  const [selectedColor, setSelectedColor] = useState(null); // Color from backend
  const [selectedSize, setSelectedSize] = useState(null); // Size from backend
  const { id } = useParams(); // Get the product ID from URL params

  // Fetch product by ID when component mounts
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`http://localhost:5000/products/${id}`); // Use the product ID to fetch data
        const data = await response.json();
        setProduct(data); // Set the fetched product
        setSelectedColor(data.colors[0]); // Set default selected color
        setSelectedSize(data.sizes[0]); // Set default selected size
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // Display loading state while fetching
  }

  const reviews = {
    average: product.rating,
    totalCount: 117 // Static for now
  };

  return (
    <div className="bg-white">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <li key={product.category}>
              <div className="flex items-center">
                <a href="#" className="mr-2 text-sm font-medium text-gray-900">
                  {product.category}
                </a>
                <svg
                  fill="currentColor"
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <a href="#" aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              alt={product.name}
              src={product.image} // Main image from backend
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">${product.new_price}</p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <form className="mt-10">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>

                <fieldset aria-label="Choose a color" className="mt-4">
                  <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex items-center space-x-3">
                    {product.colors.map((color) => (
                      <Radio
                        key={color._id}
                        value={color}
                        aria-label={color.name}
                        className="cursor-pointer"
                      >
                        <span className="h-8 w-8 rounded-full border border-black border-opacity-10" />
                        <span className="ml-2">{color.name}</span>
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div>

              {/* Sizes */}
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <fieldset aria-label="Choose a size" className="mt-4">
                  <RadioGroup value={selectedSize} onChange={setSelectedSize} className="grid grid-cols-4 gap-4">
                    {product.sizes.map((size) => (
                      <Radio key={size._id} value={size} className="cursor-pointer">
                        <span>{size.name}</span>
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div>
              <Link to='/cart'>
              <button
                type="submit"
                className="mt-10 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
              >
                Add to Cart
              </button>
              </Link>
              
            </form>
          </div>

          {/* Description */}
          <div className="py-10 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            <h3 className="text-base font-bold text-gray-900">Description</h3>
            <p className="text-base text-gray-900 mt-4">{product.description}</p>

            <h3 className="text-sm font-medium text-gray-900 mt-10">Highlights</h3>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              {product.highlights.map((highlight, index) => (
                <li key={index} className="text-sm text-gray-600">{highlight}</li>
              ))}
            </ul>

            <h3 className="text-sm font-medium text-gray-900 mt-10">Details</h3>
            <p className="text-sm text-gray-600 mt-2">{product.details}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
