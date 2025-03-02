// Cart.jsx - Updated to handle authentication
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext'; // Assuming you have an auth context

export default function Cart() {
  const { 
    cartItems, 
    cartTotal, 
    loading, 
    updateQuantity, 
    removeItem 
  } = useCart();
  
  const { isLoggedIn } = useAuth();

  // Handle quantity update
  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(item._id, newQuantity);
    }
  };

  // Show login message if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <h1 className="text-2xl font-bold text-gray-900 p-6">Shopping Cart</h1>
          <div className="py-12 text-center">
            <p className="text-gray-500 mb-6">Please log in to view your cart</p>
            <Link 
              to="/login" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900 p-6">Shopping Cart</h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto mx-5">
            <ul className="divide-y divide-gray-200">
              {cartItems.length === 0 ? (
                <>
                  <li className="py-6 text-center text-gray-500">Your cart is empty.</li>
                <Link
                to="/"
                className='m-6 flex items-center justify-center rounded-md bg-cyan-200 py-2'
                >Try Shopping
              </Link>
                </>
              
              ) : (
                cartItems.map((item) => (
                  <li key={item._id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img 
                        src={item.product?.thumbnail || '/placeholder.jpg'} 
                        alt={item.product?.title || 'Product'} 
                        className="h-full w-full object-cover object-center" 
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.product?.title || 'Product'}</h3>
                        <p className="ml-4">${((item.product?.price?.current || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      {item.color && <p className="mt-1 text-sm text-gray-500">Color: {item.color}</p>}
                      {item.size && <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>}

                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded disabled:opacity-50"
                          disabled={item.quantity <= 1 || loading}
                        >
                          -
                        </button>
                        <span className="text-sm text-gray-700">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded disabled:opacity-50"
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>

                      <div className="flex flex-1 items-end justify-between text-sm">
                        <button
                          onClick={() => removeItem(item._id)}
                          className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                          disabled={loading}
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
        )}

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>

            <Link
              to="/checkout"
              className={`mt-6 flex items-center justify-center rounded-md ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } px-6 py-3 text-base font-medium text-white shadow-sm`}
              onClick={(e) => loading && e.preventDefault()}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </Link>
            <Link
              to="/"
              className='mt-6 flex items-center justify-center rounded-md bg-cyan-200 py-2'
              >Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}