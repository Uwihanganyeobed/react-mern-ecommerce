import React, { createContext, useContext, useState, useEffect } from "react";
import { cart as cartApi } from "../services/api";
import { toast } from "react-toastify";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Safely update cart totals with defensive checks
const updateCartTotals = (items) => {
  // Guard against undefined or non-array items
  if (!items || !Array.isArray(items)) {
    setCartTotal(0);
    setItemCount(0);
    return;
  }

  // Safely calculate total price with fallbacks for missing data
  const total = items.reduce((sum, item) => {
    const price = Number(item?.product?.price?.current) || 0;
    const quantity = Number(item?.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  // Safely calculate item count with fallback for missing quantity
  const count = items.reduce((sum, item) => {
    return sum + (Number(item?.quantity) || 0);
  }, 0);

  setCartTotal(total);
  setItemCount(count);
};

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.getCart();
      
      // Log the response for debugging
      console.log('Cart API response:', response);
      
      // Check if response has the expected structure
      if (response && response.data && response.data.data) {
        // Access items from the correct nesting level
        const items = Array.isArray(response.data.data.items) 
          ? response.data.data.items 
          : [];
        
        console.log('Cart items from API:', items);
        setCartItems(items);
        updateCartTotals(items);
      } else {
        console.warn('Unexpected API response structure:', response);
        setCartItems([]);
        updateCartTotals([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // On error, reset cart to empty state
      setCartItems([]);
      updateCartTotals([]);
      
      // Only show error toast if it's not an initial load error
      if (cartItems.length > 0) {
        toast.error('Unable to fetch your cart. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, options = {}) => {
    if (!productId) {
      toast.error('Product ID is required');
      return;
    }

    try {
      setLoading(true);
      
      // Ensure quantity is a positive number
      const safeQuantity = Math.max(1, Number(quantity) || 1);
      
      const payload = { 
        productId, 
        quantity: safeQuantity,
        ...options  // Include color, size, etc.
      };
      
      const response = await cartApi.addToCart(payload);
      
      // Verify response has expected structure
      if (response && response.data && Array.isArray(response.data.items)) {
        setCartItems(response.data.items);
        updateCartTotals(response.data.items);
        toast.success('Item added to cart');
      } else {
        console.warn('Unexpected API response structure:', response);
        // Refresh cart to ensure consistency
        fetchCart();
        toast.success('Item added to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      
      // Extract error message from response if available
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Error adding item to cart';
                      
      toast.error(errorMsg);
      
      // Refresh cart to ensure UI is in sync with backend
      fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!itemId) {
      toast.error("Item ID is required");
      return;
    }

    // Ensure quantity is a positive number
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    try {
      setLoading(true);
      const response = await cartApi.updateCartItem(itemId, safeQuantity);

      if (response && response.data && Array.isArray(response.data.items)) {
        setCartItems(response.data.items);
        updateCartTotals(response.data.items);
        // Only show success toast for significant changes
        if (Math.abs(safeQuantity - getItemQuantity(itemId)) > 1) {
          toast.success("Quantity updated");
        }
      } else {
        console.warn("Unexpected API response structure:", response);
        // Refresh cart to ensure consistency
        fetchCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);

      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error updating quantity";

      toast.error(errorMsg);

      // Refresh cart to ensure UI is in sync with backend
      fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Helper to get current quantity of an item
  const getItemQuantity = (itemId) => {
    const item = cartItems.find((item) => item._id === itemId);
    return item ? item.quantity : 0;
  };

  const removeItem = async (itemId) => {
    if (!itemId) {
      toast.error("Item ID is required");
      return;
    }

    try {
      setLoading(true);
      await cartApi.removeCartItem(itemId);

      // Optimistically update UI
      const updatedItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(updatedItems);
      updateCartTotals(updatedItems);

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);

      const errorMsg =
        error.response?.data?.message || error.message || "Error removing item";

      toast.error(errorMsg);

      // Refresh cart to ensure UI is in sync with backend
      fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartApi.clearCart();

      // Reset cart state
      setCartItems([]);
      updateCartTotals([]);

      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);

      const errorMsg =
        error.response?.data?.message || error.message || "Error clearing cart";

      toast.error(errorMsg);

      // Refresh cart to ensure UI is in sync with backend
      fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Initialize cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        cartTotal,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
