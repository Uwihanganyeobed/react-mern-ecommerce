import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    
    // Show error message
    toast.error('Payment was cancelled');

    // Redirect back to order page after a short delay
    const timer = setTimeout(() => {
      navigate(orderId ? `/order/${orderId}` : '/orders');
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-12 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-medium text-gray-900">Payment Cancelled</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your payment was cancelled. You will be redirected back to your order.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel; 