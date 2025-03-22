import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { payment } from '../services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !orderId) {
        setError('Missing payment information');
        setLoading(false);
        return;
      }
      
      try {
        await payment.verifyCheckoutSession(sessionId, orderId);
        setTimeout(() => {
          navigate(`/order-confirmation`, {
            state: { orderId, isNewOrder: true }
          });
        }, 2000);
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('Failed to verify payment. Please contact support.');
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [sessionId, orderId, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">Verifying your payment...</p>
        <ClipLoader color="#4F46E5" size={40} />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md">
          <h1 className="text-xl font-bold text-red-700 mb-4">Payment Verification Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex justify-between">
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              View Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default PaymentSuccess; 