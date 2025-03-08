import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/orderContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const { orders, getMyOrders, cancelOrder } = useOrders();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        await getMyOrders();
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter(order => 
    activeFilter === 'all' ? true : order.status === activeFilter
  );

  const handleCancelOrder = async (orderId) => {
    try {
      setIsLoading(true);
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      // Refresh orders list
      await getMyOrders();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Your Orders
          </h1>
          
          {/* Filter Links - Scrollable on small screens */}
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex gap-2 sm:gap-4 min-w-max pb-2 sm:pb-0">
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors
                    ${activeFilter === filter
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b">
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <span className="text-sm lg:text-base text-gray-500">Order #{order.orderNumber}</span>
                    <span className="text-sm lg:text-base text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs lg:text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="font-medium lg:text-lg">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <img
                          src={item.productDetails?.thumbnail || '/placeholder.jpg'}
                          alt={item.productDetails?.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {item.productDetails?.title}
                          </p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-500">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="px-4 sm:px-6 py-3 bg-gray-50 flex justify-end gap-3">
                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View Details
                  </button>
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isLoading}
                      className={`text-sm text-red-600 hover:text-red-800 transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory; 