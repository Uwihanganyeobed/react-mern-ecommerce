import React, { createContext, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { order as orderApi } from '../services/api';
import { useOrders } from './orderContext';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
  const { getOrderById } = useOrders();
  const [loading, setLoading] = useState(false);

  const processPayment = async (orderId) => {
    try {
      setLoading(true);
      
      // Get the stripe instance
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Failed to load Stripe');

      // Create payment session
      const response = await orderApi.createPaymentSession(orderId);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create payment session');
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (error) {
        throw new Error(error.message);
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment processing failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (orderId, sessionId) => {
    try {
      setLoading(true);
      const response = await orderApi.verifyPayment(orderId, sessionId);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Payment verification failed');
      }

      const order = await getOrderById(orderId);
      toast.success('Payment successful');
      return order;
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Payment verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContext.Provider value={{
      loading,
      processPayment,
      verifyPayment
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