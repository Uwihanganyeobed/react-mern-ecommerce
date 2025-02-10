import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const RegisterConfirmation = () => {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <EnvelopeIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              We've sent a verification email to
            </p>
            <p className="text-sm font-medium text-indigo-600">{email}</p>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Click the link in the email to verify your account. If you don't see it,
            check your spam folder.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmation; 