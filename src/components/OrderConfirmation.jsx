import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrders } from '../context/orderContext';
import { ClipLoader } from 'react-spinners';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = location.state?.orderId;
    if (!orderId) {
      navigate('/order');
      return;
    }

    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.state, navigate, getOrderById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="text-center mb-8">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-2xl font-medium text-gray-900">Order Confirmed!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Order #{order._id}
            </p>
          </div>

          <div className="border-t border-gray-200 py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
            
            <div className="space-y-4">
              {/* Shipping Information */}
              <div>
                <h4 className="font-medium text-gray-900">Shipping Address</h4>
                <p className="mt-2 text-sm text-gray-600">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="font-medium text-gray-900">Payment Method</h4>
                <p className="mt-2 text-sm text-gray-600 capitalize">
                  {order.paymentMethod}
                </p>
              </div>

              {/* Order Status */}
              <div>
                <h4 className="font-medium text-gray-900">Order Status</h4>
                <p className="mt-2 text-sm text-gray-600 capitalize">
                  {order.status}
                </p>
              </div>

              {/* Order Date */}
              <div>
                <h4 className="font-medium text-gray-900">Order Date</h4>
                <p className="mt-2 text-sm text-gray-600">
                  {format(new Date(order.createdAt), 'PPP')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => navigate('/order-history')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
