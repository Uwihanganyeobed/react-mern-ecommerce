import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrders } from '../context/orderContext';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrder, getOrderById } = useOrders();
  const [isAnimating, setIsAnimating] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderId = location.state?.orderId;
        if (orderId) {
          const orderData = await getOrderById(orderId);
          setOrderDetails(orderData);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        navigate('/order-history');
      }
    };

    if (location.state?.orderId) {
      fetchOrderDetails();
    } else if (currentOrder) {
      setOrderDetails(currentOrder);
    } else {
      // If no order details are available, redirect to order history
      navigate('/order-history');
    }

    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 5000);

    return () => clearTimeout(animationTimer);
  }, [location.state, currentOrder, getOrderById, navigate]);

  const handleViewDetails = () => {
    if (orderDetails?._id) {
      navigate(`/order/${orderDetails._id}`, {
        state: { isNewOrder: true }
      });
    }
  };

  const renderOrderItem = (item) => {
    if (!item || !item.product) {
      return null;
    }

    const imageUrl = item.product.thumbnail 
      || (item.product.images && item.product.images.length > 0 && item.product.images[0].url)
      || '/placeholder-image.jpg';

    return (
      <div key={item._id} className="flex items-center gap-4 py-4">
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={imageUrl}
            alt={item.product.title || 'Product'}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
              e.target.onerror = null;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-gray-900 truncate">
            {item.product.title || 'Untitled Product'}
          </h4>
          <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
            {item.variant && (
              <>
                {item.variant.color && (
                  <>
                    <p>Color: {item.variant.color}</p>
                    <span>•</span>
                  </>
                )}
                {item.variant.size && <p>Size: {item.variant.size}</p>}
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            ${item.price || 0} × {item.quantity || 1}
          </p>
          <p className="text-sm text-gray-500">
            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
          </p>
        </div>
      </div>
    );
  };

  const renderOrderDetails = () => {
    if (!orderDetails) return null;

    return (
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
          <p className="mt-2 text-sm text-gray-600">
            Order #{orderDetails.orderNumber} • {new Date(orderDetails.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="px-6 py-4">
          <div className="flow-root">
            <div className="-my-4 divide-y divide-gray-200">
              {orderDetails.items?.map(item => renderOrderItem(item))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${orderDetails.total || 0}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">Free</span>
          </div>
          <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-200">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${orderDetails.total || 0}</span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">Shipping Address</h4>
          <address className="mt-2 not-italic text-sm text-gray-600">
            {orderDetails.shippingAddress?.firstName} {orderDetails.shippingAddress?.lastName}<br />
            {orderDetails.shippingAddress?.address}<br />
            {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.state} {orderDetails.shippingAddress?.postalCode}<br />
            {orderDetails.shippingAddress?.country}
          </address>
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
                Continue Shopping
              </span>
            </button>
            <button 
              onClick={handleViewDetails}
              className="md:w-fit w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-xl shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex"
            >
              <span className="px-2 py-px text-white text-base font-semibold leading-relaxed">
                View Order Details
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
