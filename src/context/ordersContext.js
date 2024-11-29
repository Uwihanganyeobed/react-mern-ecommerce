import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const { userName, isLoggedIn } = useAuth();

  // Handle login/logout events
  useEffect(() => {
    const handleUserLogin = (event) => {
      const { userName, orders } = event.detail;
      if (orders) {
        setOrders(orders);
      }
    };

    const handleUserLogout = () => {
      // Save current orders before clearing
      if (userName) {
        localStorage.setItem(`orders_${userName}`, JSON.stringify(orders));
      }
      setOrders([]);
    };

    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, [userName, orders]);

  // Save orders whenever they change
  useEffect(() => {
    if (isLoggedIn && userName) {
      localStorage.setItem(`orders_${userName}`, JSON.stringify(orders));
    }
  }, [orders, userName, isLoggedIn]);

  const addOrder = (orderData) => {
    if (!isLoggedIn) {
      console.warn('Please login to create an order');
      return null;
    }

    const newOrder = {
      ...orderData,
      id: `order_${Date.now()}`,
      userName,
      orderDate: new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'completed',
      deliveryExpected: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const getUserOrders = () => {
    if (!isLoggedIn) return [];
    return orders;
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    if (!isLoggedIn) return;
    
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const clearOrders = () => {
    if (userName) {
      localStorage.removeItem(`orders_${userName}`);
    }
    setOrders([]);
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder,
      getUserOrders,
      getOrderById,
      updateOrderStatus,
      clearOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
