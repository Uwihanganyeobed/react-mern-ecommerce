import React, { createContext, useContext, useState, useEffect } from 'react';
import { feedback as feedbackApi } from '../services/api';
import { toast } from 'react-toastify';

const FeedbackContext = createContext(null);

export const FeedbackProvider = ({ children }) => {
  const [publicFeedback, setPublicFeedback] = useState([]);
  const [myFeedback, setMyFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPublicFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackApi.getPublicFeedback();
      setPublicFeedback(response.data);
    } catch (error) {
      console.error('Error fetching public feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackApi.getMyFeedback();
      setMyFeedback(response.data);
    } catch (error) {
      console.error('Error fetching my feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (feedbackData) => {
    try {
      setLoading(true);
      const response = await feedbackApi.submitFeedback(feedbackData);
      setMyFeedback([...myFeedback, response.data]);
      
      if (feedbackData.isPublic) {
        setPublicFeedback([...publicFeedback, response.data]);
      }
      
      toast.success('Feedback submitted successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting feedback');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = async (feedbackId, updatedData) => {
    try {
      setLoading(true);
      const response = await feedbackApi.updateFeedback(feedbackId, updatedData);
      
      setMyFeedback(myFeedback.map(feedback => 
        feedback._id === feedbackId ? response.data : feedback
      ));

      if (updatedData.isPublic) {
        setPublicFeedback(publicFeedback.map(feedback => 
          feedback._id === feedbackId ? response.data : feedback
        ));
      }

      toast.success('Feedback updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating feedback');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (feedbackId) => {
    try {
      setLoading(true);
      await feedbackApi.deleteFeedback(feedbackId);
      
      setMyFeedback(myFeedback.filter(feedback => feedback._id !== feedbackId));
      setPublicFeedback(publicFeedback.filter(feedback => feedback._id !== feedbackId));
      
      toast.success('Feedback deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting feedback');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicFeedback();
  }, []);

  return (
    <FeedbackContext.Provider value={{
      publicFeedback,
      myFeedback,
      loading,
      submitFeedback,
      updateFeedback,
      deleteFeedback,
      fetchMyFeedback,
      fetchPublicFeedback
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}; 