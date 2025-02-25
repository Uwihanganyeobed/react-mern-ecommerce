import React, { createContext, useContext, useState } from 'react';
import { subscription as subscriptionApi } from '../services/api';
import { useAuth } from './authContext';
import { toast } from 'react-toastify';

const SubscriberContext = createContext(null);

export const SubscriberProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    frequency: 'weekly',
    interests: [],
    subscriptionType: 'all',
    preferences: {
      newProducts: true,
      promotions: true,
      events: true,
      blogPosts: true
    }
  });

  const subscribe = async (customPreferences = {}) => {
    try {
      setLoading(true);
      const subscribeData = {
        ...preferences,
        ...customPreferences,
        email: user?.email,
        name: user?.name
      };

      const response = await subscriptionApi.subscribe(subscribeData);
      setSubscriptionStatus('subscribed');
      setPreferences(response.data.preferences);
      toast.success('Successfully subscribed to newsletter!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error subscribing to newsletter');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (token) => {
    try {
      setLoading(true);
      await subscriptionApi.unsubscribe(token);
      setSubscriptionStatus('unsubscribed');
      toast.success('Successfully unsubscribed from newsletter');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error unsubscribing from newsletter');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifySubscription = async (token) => {
    try {
      setLoading(true);
      const response = await subscriptionApi.verifySubscription(token);
      setSubscriptionStatus('subscribed');
      setPreferences(response.data.preferences);
      toast.success('Subscription verified successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error verifying subscription');
      return false;
    } finally {
      setLoading(false);
    }
  };



  return (
    <SubscriberContext.Provider value={{
      subscriptionStatus,
      preferences,
      loading,
      subscribe,
      unsubscribe,
      verifySubscription,
    }}>
      {children}
    </SubscriberContext.Provider>
  );
};

export const useSubscriber = () => {
  const context = useContext(SubscriberContext);
  if (!context) {
    throw new Error('useSubscriber must be used within a SubscriberProvider');
  }
  return context;
}; 