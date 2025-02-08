import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Cart() {
  // Sample cart items
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Apple iPhone 15 Pro",
      image: "/images/iphone15.jpg",
      color: "Black Titanium",
      size: "256GB",
      new_price: 1199.99,
      quantity: 1,
    },
    {
      id: "2",
      name: "Samsung Galaxy S24 Ultra",
      image: "/images/samsung_s24.jpg",
      color: "Silver",
      size: "512GB",
      new_price: 1299.99,
      quantity: 1,
    }
  ]);

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + item.new_price * item.quantity, 0);

  // Update quantity function
  const updateQuantity = (product, change) => {
    setCartItems(cartItems.map(item => 
      item.id === product.id ? { ...item, quantity: item.quantity + change } : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900 p-6">Shopping Cart</h1>

        <div className="overflow-x-auto mx-5">
          <ul className="divide-y divide-gray-200">
            {cartItems.length === 0 ? (
              <li className="py-6 text-center text-gray-500">Your cart is empty.</li>
            ) : (
              cartItems.map((product) => (
                <li key={product.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center" />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{product.name}</h3>
                      <p className="ml-4">${(product.new_price * product.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                    <p className="mt-1 text-sm text-gray-500">Size: {product.size}</p>

                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        onClick={() => updateQuantity(product, -1)}
                        className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded"
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-sm text-gray-700">{product.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product, 1)}
                        className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-1 items-end justify-between text-sm">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>

            <Link
              to="/checkout"
              className="mt-6 flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
