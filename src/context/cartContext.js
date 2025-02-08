import React, { createContext, useContext, useState, useEffect } from 'react';
import { cart as cartApi } from '../services/api';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.getCart();
      setCartItems(response.data.items);
      updateCartTotals(response.data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartTotals = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total);
    setItemCount(count);
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await cartApi.addToCart({ productId, quantity });
      setCartItems(response.data.items);
      updateCartTotals(response.data.items);
      toast.success('Item added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await cartApi.updateCartItem(itemId, quantity);
      setCartItems(response.data.items);
      updateCartTotals(response.data.items);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      await cartApi.removeCartItem(itemId);
      const updatedItems = cartItems.filter(item => item._id !== itemId);
      setCartItems(updatedItems);
      updateCartTotals(updatedItems);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing item');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartApi.clearCart();
      setCartItems([]);
      updateCartTotals([]);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error clearing cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      cartTotal,
      itemCount,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 