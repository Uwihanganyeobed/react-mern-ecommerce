import React, { useEffect, useState } from 'react';
import { useOrders } from '../contexts/OrdersContext';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();

  const recentOrders = orders.slice(0, 3); // Get last 3 orders

  return (
    <div className="relative group">
      {/* ... existing user menu button ... */}
      
      <div className="absolute right-0 w-72 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
        {/* ... other menu items ... */}
        
        {recentOrders.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">Recent Orders</h3>
            <div className="mt-2 space-y-2">
              {recentOrders.map(order => (
                <button
                  key={order._id}
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <span>#{order.orderNumber}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
              <button
                onClick={() => navigate('/order-history')}
                className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500 py-1"
              >
                View All Orders →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu; 