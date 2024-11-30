import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/ordersContext';
import { useCart } from '../context/itemsContext';
import { AuthContext } from '../context/authContext';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { orders, getOrderById } = useOrders();
  const { clearCart } = useCart();
  const { userName } = useContext(AuthContext);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Get the latest order
  const latestOrder = orders[orders.length - 1];
  useEffect(() => {
    clearCart();
    const animationTimer = setTimeout(() => {
      setShowAnimation(false);
    }, 4000);
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 3000);
    return () => {
      clearTimeout(animationTimer);
      clearTimeout(contentTimer);
    };
  }, [clearCart]);

  const renderOrderDetails = () => {
    if (!latestOrder) return null;

    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Order Details</h3>
        <div className="space-y-2">
          <p className="text-gray-700">Hello, {userName}!</p>
          <p className="text-gray-700">Order ID: {latestOrder.id}</p>
          <p className="text-gray-700">Order Date: {new Date(latestOrder.orderDate).toLocaleDateString()}</p>
          <p className="text-gray-700">Status: {latestOrder.status}</p>
          <p className="text-gray-700">Expected Delivery: {new Date(latestOrder.deliveryExpected).toLocaleDateString()}</p>
          <p className="text-gray-700">Tracking Number: {latestOrder.trackingNumber}</p>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Items Ordered:</h4>
            {latestOrder.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span>{item.title}</span>
                <span>${item.new_price} × {item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-semibold">${latestOrder.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 relative">
      {showAnimation && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Main success circle */}
            <div className="animate-scale-up bg-white rounded-2xl p-8 shadow-2xl">
              <div className="w-40 h-40 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
                {/* Shining effect */}
                <div className="absolute w-full h-full animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                
                {/* Checkmark */}
                <svg 
                  className="w-24 h-24 text-white animate-checkmark" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="3" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Floating shopping bag */}
              <div className="absolute -top-6 -right-6 animate-float">
                <svg className="w-12 h-12 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6v-2c0-2.209-1.791-4-4-4s-4 1.791-4 4v2h-5v18h18v-18h-5zm-7-2c0-1.654 1.346-3 3-3s3 1.346 3 3v2h-6v-2zm10 18h-14v-14h3v3h2v-3h6v3h2v-3h3v14z"/>
                </svg>
              </div>

              {/* Animated elements */}
              <div className="absolute -top-4 -left-4 animate-spin-slow">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                </svg>
              </div>

              {/* Confetti elements */}
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-pink-500 rounded-full animate-bounce-delay-1"></div>
              <div className="absolute -bottom-5 left-5 w-4 h-4 bg-yellow-400 rounded-full animate-bounce-delay-2"></div>
              <div className="absolute -top-2 left-10 w-5 h-5 bg-indigo-600 rounded-full animate-bounce-delay-3"></div>
            </div>
          </div>
        </div>
      )}

      {showContent && (
        <div className={`w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto relative z-30`}>
          <div className="w-full flex-col justify-start items-center lg:gap-12 gap-8 inline-flex">
            <div className="flex-col justify-start items-center gap-3 flex">
              <h2 className="text-center text-gray-900 text-3xl font-bold font-manrope leading-normal">
                Thank You for Your Order!
              </h2>
              <p className="max-w-xl text-center text-gray-500 text-lg font-normal leading-8">
                Your order is in good hands! We'll notify you once it's en route.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="w-full justify-center items-center gap-8 flex sm:flex-row flex-col">
              <button 
                onClick={() => navigate('/')}
                className="md:w-fit w-full px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 transition-all duration-700 ease-in-out rounded-xl justify-center items-center flex"
              >
                <span className="px-2 py-px text-indigo-600 text-base font-semibold leading-relaxed">
                  Back to Shopping
                </span>
              </button>
              <button 
                onClick={() => navigate('/order')}
                className="md:w-fit w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-xl shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex"
              >
                <span className="px-2 py-px text-white text-base font-semibold leading-relaxed">
                  Track My Order
                </span>
              </button>
            </div>

            {renderOrderDetails()}
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderConfirmation; 