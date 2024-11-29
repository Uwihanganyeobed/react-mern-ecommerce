import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const storedAuthToken = localStorage.getItem("authToken");
    const storedUserName = localStorage.getItem("userName");
    
    if (storedAuthToken && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      setAuthToken(storedAuthToken);
    }
  }, []);

  const login = (token, name) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userName", name);
    setIsLoggedIn(true);
    setUserName(name);
    setAuthToken(token);

    // Load user-specific data from localStorage
    const userCart = localStorage.getItem(`cart_${name}`);
    const userOrders = localStorage.getItem(`orders_${name}`);
    const userCheckout = localStorage.getItem(`checkout_${name}`);

    // Dispatch events to notify other contexts
    window.dispatchEvent(new CustomEvent('userLogin', { 
      detail: { 
        userName: name,
        cart: userCart ? JSON.parse(userCart) : [],
        orders: userOrders ? JSON.parse(userOrders) : [],
        checkout: userCheckout ? JSON.parse(userCheckout) : {}
      } 
    }));
  };

  const logout = () => {
    const currentUser = userName;
    
    // Clear auth state
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    setAuthToken("");

    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('userLogout', { 
      detail: { userName: currentUser } 
    }));
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      userName, 
      authToken, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};