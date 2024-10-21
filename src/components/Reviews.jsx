import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, Radio, RadioGroup } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'

const product = {
  name: 'Basic Tee 6-Pack ',
  price: '$192',
  rating: 3.9,
  reviewCount: 117,
  href: '#',
  imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-quick-preview-02-detail.jpg',
  imageAlt: 'Two each of gray, white, and black shirts arranged on table.',
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  ],
  sizes: [
    { name: 'XXS', inStock: true },
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: true },
    { name: 'XXL', inStock: true },
    { name: 'XXXL', inStock: false },
  ],
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Reviews() {
  const [open, setOpen] = useState(true) // Set to true for testing
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[2])

  return (
    <div>
      {/* Button to open dialog */}
      <button
        onClick={() => setOpen(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Open Product Review
      </button>

      {/* Dialog component */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full px-4 py-6 sm:px-0">
            <DialogPanel className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                <div className="sm:col-span-4">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="sm:col-span-8">
                  <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                  <p className="mt-2 text-gray-900 text-2xl">{product.price}</p>

                  {/* Ratings */}
                  <div className="mt-4 flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            product.rating > rating ? 'text-yellow-500' : 'text-gray-300',
                            'h-5 w-5'
                          )}
                        />
                      ))}
                    </div>
                    <p className="ml-3 text-sm text-indigo-600">{product.reviewCount} reviews</p>
                  </div>

                  {/* Colors */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Color</h4>
                    <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-2 flex space-x-3">
                      {product.colors.map((color) => (
                        <Radio
                          key={color.name}
                          value={color}
                          className={classNames(
                            color.selectedClass,
                            'w-8 h-8 rounded-full'
                          )}
                        />
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Sizes */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900">Size</h4>
                    <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-2 grid grid-cols-4 gap-4">
                      {product.sizes.map((size) => (
                        <Radio
                          key={size.name}
                          value={size}
                          className={classNames(
                            size.inStock
                              ? 'cursor-pointer text-gray-900'
                              : 'cursor-not-allowed bg-gray-100 text-gray-400',
                            'p-2 rounded-md text-sm'
                          )}
                          disabled={!size.inStock}
                        >
                          {size.name}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Add to bag button */}
                  <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md">
                    Add to bag
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
