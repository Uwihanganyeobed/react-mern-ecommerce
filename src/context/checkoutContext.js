import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [checkoutData, setCheckoutData] = useState({
    billing: {},
    shipping: {},
    shippingMethod: '',
    payment: {},
    orderSummary: {}
  });
  
  const { userName, isLoggedIn } = useAuth();

  // Handle login/logout events
  useEffect(() => {
    const handleUserLogin = (event) => {
      const { userName, checkout } = event.detail;
      if (checkout) {
        setCheckoutData(checkout);
      }
    };

    const handleUserLogout = () => {
      // Save current checkout data before clearing
      if (userName) {
        localStorage.setItem(`checkout_${userName}`, JSON.stringify(checkoutData));
      }
      setCheckoutData({
        billing: {},
        shipping: {},
        shippingMethod: '',
        payment: {},
        orderSummary: {}
      });
    };

    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, [userName, checkoutData]);

  const updateCheckoutData = (step, data) => {
    if (!isLoggedIn) {
      console.warn('Please login to update checkout data');
      return;
    }

    const newData = {
      ...checkoutData,
      [step]: data
    };
    setCheckoutData(newData);
    
    if (userName) {
      localStorage.setItem(`checkout_${userName}`, JSON.stringify(newData));
    }
  };

  const clearCheckoutData = () => {
    if (userName) {
      localStorage.removeItem(`checkout_${userName}`);
    }
    setCheckoutData({
      billing: {},
      shipping: {},
      shippingMethod: '',
      payment: {},
      orderSummary: {}
    });
  };

  return (
    <CheckoutContext.Provider value={{ 
      checkoutData, 
      updateCheckoutData,
      clearCheckoutData 
    }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};