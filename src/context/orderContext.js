import React, { createContext, useContext, useState, useCallback } from 'react';
import { order as orderApi } from '../services/api';
import { useCart } from './cartContext';
import { useAuth } from './authContext';
import { toast } from 'react-hot-toast';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { clearCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all orders for the current user
  const getMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderApi.getMyOrders();
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
      
      setOrders(response.data.orders);
      return response.data.orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching your orders');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single order by ID
  const getOrderById = async (orderId) => {
    try {
      setLoading(true);
      const response = await orderApi.getOrderById(orderId);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch order');
      }

      const orderData = response.data.data;
      setCurrentOrder(orderData);
      return orderData;
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      console.log('Creating order with data:', orderData);

      const response = await orderApi.createOrder(orderData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create order');
      }

      const newOrder = response.data.data;
      setCurrentOrder(newOrder);
      setOrders(prev => [newOrder, ...prev]);
      
      await clearCart();
      return newOrder;
    } catch (error) {
      console.error('Order creation error:', error);
      const message = error.response?.data?.message || 'Failed to create order';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await orderApi.cancelOrder(orderId);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to cancel order');
      }

      // Update local state
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      
      if (currentOrder?._id === orderId) {
        setCurrentOrder(prev => ({ ...prev, status: 'cancelled' }));
      }

      toast.success('Order cancelled successfully');
      return response.data.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get order tracking information
  const getOrderTracking = async (orderId) => {
    try {
      setLoading(true);
      const response = await orderApi.getOrderTracking(orderId);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get tracking info');
      }

      return response.data.tracking;
    } catch (error) {
      console.error('Error fetching tracking:', error);
      toast.error('Failed to load tracking information');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      currentOrder,
      loading,
      error,
      getMyOrders,
      getOrderById,
      createOrder,
      cancelOrder,
      getOrderTracking
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};