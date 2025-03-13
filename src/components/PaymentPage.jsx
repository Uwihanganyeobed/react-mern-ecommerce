import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../context/paymentContext';
import { ClipLoader } from 'react-spinners';

const PaymentPage = () => {
  const { orderId } = useParams();
  const { processPayment, loading } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        await processPayment(orderId);
      } catch (error) {
        navigate(`/order/${orderId}`, { 
          state: { error: 'Payment failed to initialize' } 
        });
      }
    };

    initiatePayment();
  }, [orderId, processPayment, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ClipLoader color="#4F46E5" size={50} />
          <p className="mt-4 text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentPage; 