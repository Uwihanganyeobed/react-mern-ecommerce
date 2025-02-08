import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsletter } from '../services/api';
import { toast } from 'react-toastify';

const Unsubscribe = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleUnsubscribe = async () => {
    try {
      setIsLoading(true);
      await newsletter.unsubscribe(email);
      toast.success('Successfully unsubscribed from newsletter');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to unsubscribe. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Unsubscribe from Newsletter</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to unsubscribe {email} from our newsletter?
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleUnsubscribe}
          disabled={isLoading}
          className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:bg-red-300"
        >
          {isLoading ? 'Processing...' : 'Unsubscribe'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Unsubscribe; 