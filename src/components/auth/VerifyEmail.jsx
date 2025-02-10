import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { ClipLoader } from 'react-spinners';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("No verification token provided");
        setVerifying(false);
        return;
      }

      try {
        const success = await verifyEmail(token);
        if (success) {
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError("Verification failed. Please try again or request a new verification email.");
        }
      } catch (err) {
        setError("Invalid or expired verification token");
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [token, verifyEmail, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Verifying Email</h2>
            <div className="mt-4">
              <ClipLoader color="#4F46E5" size={50} />
              <p className="mt-4 text-gray-600">Please wait while we verify your email...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-6 space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600">Email Verified Successfully!</h2>
          <p className="mt-2 text-gray-600">
            Your email has been verified. You will be redirected to the login page in a few seconds...
          </p>
          <div className="mt-4">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 