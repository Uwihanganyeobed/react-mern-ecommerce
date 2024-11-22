import { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [checkoutData, setCheckoutData] = useState({
    billing: {},
    shipping: {},
    shippingMethod: '',
    payment: {},
    orderSummary: {}
  });

  const updateCheckoutData = (step, data) => {
    setCheckoutData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  return (
    <CheckoutContext.Provider value={{ checkoutData, updateCheckoutData }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};