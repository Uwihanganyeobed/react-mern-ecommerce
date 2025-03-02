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
        {/* Header - Larger on lg screens */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">Your Orders</h1>
          
          {/* Filter Links - Larger on lg screens */}
          <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 text-sm lg:text-base">
            {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`${
                  activeFilter === filter
                    ? 'text-indigo-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                } transition-colors duration-200`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-10 lg:py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg lg:text-xl font-medium text-gray-900">No orders found</h3>
            <p className="mt-2 text-gray-500 lg:text-lg">Start shopping to create your first order</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 lg:mt-6 px-4 py-2 lg:px-6 lg:py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 lg:text-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b">
                  <div className="flex flex-col">
                    <span className="text-sm lg:text-base text-gray-500">Order #{order.orderNumber}</span>
                    <span className="text-sm lg:text-base text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-2 lg:gap-4">
                    <span className={`px-2 py-1 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="font-medium lg:text-lg">${order.total}</span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-wrap gap-4 lg:gap-6">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item._id} className="flex items-center gap-3 lg:gap-4">
                        <img
                          src={item.productDetails?.thumbnail || '/placeholder.jpg'}
                          alt={item.productDetails?.title}
                          className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm lg:text-base font-medium truncate max-w-[200px] lg:max-w-[300px]">
                            {item.productDetails?.title}
                          </p>
                          <p className="text-sm lg:text-base text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm lg:text-base text-gray-500 self-center">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="px-4 sm:px-6 lg:px-8 py-3 lg:py-4 bg-gray-50 flex justify-end gap-4 lg:gap-6">
                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="text-sm lg:text-base text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                  >
                    View Details
                  </button>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="text-sm lg:text-base text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory; 