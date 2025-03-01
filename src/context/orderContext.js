import React, { createContext, useContext, useState, useCallback } from 'react';
import { order as orderApi } from '../services/api';
import { useCart } from './cartContext';
import { useAuth } from './authContext';
import { toast } from 'react-toastify';
import { orderSchema } from '../utils/validations';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetError = () => setError(null);

  // Use useCallback for functions that are used in useEffect dependencies
  const getMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getMyOrders();
      setOrders(response.data.orders || []);
      return response.data.orders;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching orders';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props or state

  const getOrderById = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getOrderById(orderId);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching order';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = async (orderData) => {
    try {
      if (!isLoggedIn) {
        throw new Error('User not logged in');
      }

      setLoading(true);
      setError(null);

      try {
        orderSchema.parse(orderData);
      } catch (validationError) {
        const errorMessages = validationError.errors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join('\n');
        throw new Error(`Validation failed:\n${errorMessages}`);
      }

      const response = await orderApi.createOrder(orderData);
      await clearCart();
      setCurrentOrder(response.data.data);
      
      // Refresh orders list after creating new order
      await getMyOrders();
      
      toast.success('Order placed successfully!');
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error creating order';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderApi.cancelOrder(orderId);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        )
      );

      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel order';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // State
    orders,
    currentOrder,
    loading,
    error,
    // Methods
    resetError,
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
  };

  return (
    <OrderContext.Provider value={value}>
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