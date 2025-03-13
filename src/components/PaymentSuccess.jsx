import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../context/paymentContext';
import { ClipLoader } from 'react-spinners';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { verifyPayment, loading } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const sessionId = searchParams.get('session_id');

    if (orderId && sessionId) {
      verifyPayment(orderId, sessionId)
        .then((order) => {
          navigate('/order-confirmation', { 
            state: { orderId: order._id } 
          });
        })
        .catch(() => {
          navigate(`/order/${orderId}`);
        });
    }
  }, [searchParams, verifyPayment, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <ClipLoader color="#4F46E5" size={50} />
        <p className="mt-4 text-gray-600">Verifying payment...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess; 