import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <div className="mt-4">
          <h3 className="text-2xl font-semibold text-gray-800 md:text-3xl">
            Page not found
          </h3>
          <p className="mt-4 text-gray-600">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="px-6 py-3 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors duration-300"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 