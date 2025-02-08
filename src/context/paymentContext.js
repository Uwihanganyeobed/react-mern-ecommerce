import React, { createContext, useContext, useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
  // const { createOrder } = useOrders();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const initializePayment = async (amount, currency = 'usd') => {
    try {
      setProcessing(true);
      // const stripe = await stripePromise;
      
      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency }),
      });
      
      const { clientSecret } = await response.json();
      // return { stripe, clientSecret };
    } catch (error) {
      toast.error('Error initializing payment');
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const processPayment = async (paymentData, orderData) => {
    try {
      setProcessing(true);
      
      // Create order first
      // const order = await createOrder(orderData);
      
      // Process payment
      const { stripe, clientSecret } = await initializePayment(
        orderData.totalAmount * 100 // Stripe expects amount in cents
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentData.paymentMethodId,
        }
      );

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentMethod(paymentIntent.payment_method);
        toast.success('Payment processed successfully!');
        // return { order, paymentIntent };
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const savePaymentMethod = async (paymentMethodId) => {
    try {
      setProcessing(true);
      // Save payment method to your backend
      const response = await fetch('/api/save-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId }),
      });
      
      const savedMethod = await response.json();
      setPaymentMethod(savedMethod);
      toast.success('Payment method saved successfully');
    } catch (error) {
      toast.error('Error saving payment method');
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider value={{
      processing,
      paymentMethod,
      initializePayment,
      processPayment,
      savePaymentMethod
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}; 