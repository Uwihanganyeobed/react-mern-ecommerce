import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useOrders } from '../context/orderContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getOrderById, cancelOrder } = useOrders();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isNewOrder] = useState(location.state?.isNewOrder || false);
  
  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const data = await getOrderById(id);
        if (isMounted) {
          setOrder(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error('Failed to load order details');
          navigate('/order-history');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      fetchOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      await cancelOrder(id);
      
      // Fetch updated order details
      const updatedOrder = await getOrderById(id);
      setOrder(updatedOrder);
      
      toast.success('Order cancelled successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel order';
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const renderCancelButton = () => {
    if (!order || !order.canBeCancelled || order.status !== 'pending') {
      return null;
    }

    return (
      <button
        onClick={handleCancelOrder}
        disabled={isCancelling}
        className={`px-4 py-2 ${
          isCancelling 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-700'
        } text-white text-sm font-medium rounded-md transition-colors duration-200`}
      >
        {isCancelling ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Cancelling...
          </span>
        ) : (
          'Cancel Order'
        )}
      </button>
    );
  };

  if (isLoading || !order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);
  const formattedDate = format(orderDate, 'PPP');

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {isNewOrder && (
          <div className="mb-8 bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Order Confirmed!</h3>
                <p className="mt-2 text-sm text-green-700">
                  Thank you for your order. We'll notify you once it's on its way.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Order Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Order Details
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Order #{order.orderNumber} • Placed on {formattedDate}
            </p>
          </div>

          {/* Order Items */}
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-20 h-20">
                    <img
                      src={item.productDetails?.thumbnail || item.product?.thumbnail || '/placeholder.jpg'}
                      alt={item.productDetails?.title || item.product?.title}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.productDetails?.title || item.product?.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    {item.variant && (
                      <p className="mt-1 text-sm text-gray-500">
                        {item.variant.color && `Color: ${item.variant.color}`}
                        {item.variant.size && ` • Size: ${item.variant.size}`}
                      </p>
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${order.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">Free</span>
              </div>
              <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${order.total}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="px-6 py-4 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
            <address className="not-italic text-sm text-gray-600">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </address>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/order-history')}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                ← Back to Orders
              </button>
              {renderCancelButton()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 