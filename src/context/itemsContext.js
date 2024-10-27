import { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addCartItem = (item, quantityChange = 1) => {
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
        // If quantity becomes zero or less, remove the item
        removeFromCart(item.id);
      }
    } else {
      // Add new item with quantity specified
      setCartItems([...cartItems, { ...item, quantity: Math.max(1, quantityChange) }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.new_price * item.quantity, 0);
  };

  const getItemTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

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

// Custom hook to use the Cart context
export function useCart() {
   return useContext(CartContext);
}