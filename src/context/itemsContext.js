import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./authContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { userName, isLoggedIn } = useAuth();

  // Load cart items when user logs in
  useEffect(() => {
    const handleUserLogin = (event) => {
      const { userName, cart } = event.detail;
      if (cart) {
        setCartItems(cart);
      }
    };

    const handleUserLogout = () => {
      // Save current cart before clearing
      if (userName) {
        localStorage.setItem(`cart_${userName}`, JSON.stringify(cartItems));
      }
      setCartItems([]);
    };

    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, [userName, cartItems]);

  // Save cart items whenever they change
  useEffect(() => {
    if (isLoggedIn && userName) {
      localStorage.setItem(`cart_${userName}`, JSON.stringify(cartItems));
    }
  }, [cartItems, userName, isLoggedIn]);

  const addCartItem = (item, quantityChange = 1) => {
    if (!isLoggedIn) {
      console.warn('Please login to add items to cart');
      return;
    }

    const isInCart = cartItems.find((cartItem) => cartItem.id === item.id);

    if (isInCart) {
      const newQuantity = isInCart.quantity + quantityChange;
      if (newQuantity > 0) {
        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          )
        );
      } else {
        removeFromCart(item.id);
      }
    } else {
      setCartItems([...cartItems, { ...item, quantity: Math.max(1, quantityChange) }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.id !== id));
  };

  const clearCart = () => {
    if (userName) {
      localStorage.removeItem(`cart_${userName}`);
    }
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.new_price * item.quantity, 0);
  };

  const getItemTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getItemTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
   return useContext(CartContext);
}