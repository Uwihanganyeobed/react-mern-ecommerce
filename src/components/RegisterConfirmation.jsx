
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const RegisterConfirmation = () => {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification email to:
          </p>
          <p className="mt-1 text-md font-medium text-indigo-600">
            {email}
          </p>
          <div className="mt-8 text-sm text-gray-600">
            <p>Please check your email and click the verification link to complete your registration.</p>
            <p className="mt-4">Didn't receive the email? Check your spam folder or</p>
            <button
              onClick={() => {/* Add resend verification logic */}}
              className="mt-2 text-indigo-600 hover:text-indigo-500"
            >
              click here to resend
            </button>
          </div>
          <div className="mt-8">
            <Link
              to="/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmation; 