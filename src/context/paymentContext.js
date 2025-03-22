import React, { createContext, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Log the key to verify it's being loaded (remove in production)
console.log("Stripe key being used:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 
  `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY.substring(0, 8)}...` : 
  "NOT FOUND");

// Initialize Stripe with explicit key
const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 
  loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) : 
  null;

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add this function to get the Stripe instance
  const getStripe = () => {
    if (!stripePromise) {
      console.error("Stripe failed to initialize. Check your publishable key.");
      return null;
    }
    return stripePromise;
  };

  const processPayment = async (orderId, paymentMethodId, paymentType, stripe) => {
    try {
      setLoading(true);
      
      if (paymentType === 'card') {
        // Create payment intent
        const intentResponse = await axios.post('/api/payments/create-intent', {
          orderId
        });
        
        if (!intentResponse.data.success) {
          throw new Error(intentResponse.data.message || 'Failed to create payment intent');
        }
        
        const { clientSecret, paymentIntentId } = intentResponse.data;
        
        // Confirm the payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethodId
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Verify payment on backend
        const verifyResponse = await axios.post('/api/payments/verify', {
          paymentIntentId: paymentIntent.id
        });
        
        if (!verifyResponse.data.success) {
          throw new Error(verifyResponse.data.message || 'Payment verification failed');
        }
        
        toast.success('Payment successful!');
        return true;
      } else {
        // Handle alternative payment methods (cash, bank transfer)
        const response = await axios.post(`/api/orders/${orderId}/payment`, {
          paymentMethod: paymentType
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Payment processing failed');
        }
        
        toast.success(`Order placed with ${paymentType} payment method`);
        return true;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment processing failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (orderId) => {
    try {
      const response = await axios.get(`/api/orders/${orderId}/payment-status`);
      return response.data.paymentStatus;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return 'unknown';
    }
  };

  return (
    <PaymentContext.Provider value={{
      paymentMethod,
      setPaymentMethod,
      paymentStatus,
      setPaymentStatus,
      paymentError,
      setPaymentError,
      getStripe,
      loading,
      processPayment,
      checkPaymentStatus
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext); 