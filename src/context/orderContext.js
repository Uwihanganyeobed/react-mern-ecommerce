import React, { createContext, useContext, useState } from 'react';
import { order as orderApi } from '../services/api';
import { useCart } from './cartContext';
import { toast } from 'react-toastify';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { clearCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await orderApi.createOrder(orderData);
      setCurrentOrder(response.data);
      await clearCart(); // Clear cart after successful order
      toast.success('Order placed successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMyOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getMyOrders();
      setOrders(response.data);
      return response.data;
    } catch (error) {
      toast.error('Error fetching orders');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (orderId) => {
    try {
      setLoading(true);
      const response = await orderApi.getOrderById(orderId);
      return response.data;
    } catch (error) {
      toast.error('Error fetching order details');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      await orderApi.cancelOrder(orderId);
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      ));
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error cancelling order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      currentOrder,
      createOrder,
      getMyOrders,
      getOrderById,
      cancelOrder
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