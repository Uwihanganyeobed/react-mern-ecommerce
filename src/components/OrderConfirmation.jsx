/*
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/ordersContext';
import { useCart } from '../context/itemsContext';
import { AuthContext } from '../context/authContext';
import { sendOrderConfirmationEmail } from '../services/emailService';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { clearCart } = useCart();
  const { userName, userEmail } = useContext(AuthContext);
  const [isAnimating, setIsAnimating] = useState(true);

  // Get the latest order
  const latestOrder = orders[orders.length - 1];
  
  useEffect(() => {
    clearCart();
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    // Send email notification
    if (latestOrder && userEmail) {
      sendOrderConfirmationEmail(latestOrder, userEmail)
        .then(() => {
          console.log('Order confirmation email sent successfully');
        })
        .catch((error) => {
          console.error('Failed to send order confirmation email:', error);
        });
    }

    return () => {
      clearTimeout(animationTimer);
    };
  }, [clearCart, latestOrder, userEmail]);

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
      {isAnimating && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 flex items-center space-x-4 animate-fadeInOut">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg 
                  className="h-6 w-6 text-green-500 animate-bounce" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Order Confirmed!</p>
              <p className="text-sm text-gray-500">Your order has been successfully placed</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto relative z-30">
        <div className="w-full flex-col justify-start items-center lg:gap-12 gap-8 inline-flex">
          <div className="flex-col justify-start items-center gap-3 flex">
            <h2 className="text-center text-gray-900 text-3xl font-bold font-manrope leading-normal">
              Thank You for Your Order!
            </h2>
            <p className="max-w-xl text-center text-gray-500 text-lg font-normal leading-8">
              Your order is in good hands! We'll notify you once it's en route.
            </p>
          </div>

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
    </section>
  );
};

export default OrderConfirmation;
*/


import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/ordersContext';
import { useCart } from '../context/itemsContext';
import { AuthContext } from '../context/authContext';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { clearCart } = useCart();
  const { userName } = useContext(AuthContext);
  const [isAnimating, setIsAnimating] = useState(true);

  // Get the latest order
  const latestOrder = orders[orders.length - 1];
  
  useEffect(() => {
    clearCart();
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 5000);

    return () => {
      clearTimeout(animationTimer);
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
      {isAnimating && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 flex items-center space-x-4 animate-fadeInOut">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg 
                  className="h-6 w-6 text-green-500 animate-bounce" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Order Confirmed!</p>
              <p className="text-sm text-gray-500">Your order has been successfully placed</p>
              <p className="text-sm text-blue-400">We will send you an email with the order details</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto relative z-30">
        <div className="w-full flex-col justify-start items-center lg:gap-12 gap-8 inline-flex">
          <div className="flex-col justify-start items-center gap-3 flex">
            <h2 className="text-center text-gray-900 text-3xl font-bold font-manrope leading-normal">
              Thank You for Your Order!
            </h2>
            <p className="max-w-xl text-center text-gray-500 text-lg font-normal leading-8">
              Your order is in good hands! We'll notify you once it's en route.
            </p>
          </div>

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
    </section>
  );
};

export default OrderConfirmation;
