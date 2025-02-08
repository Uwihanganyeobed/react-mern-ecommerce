import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { ClipLoader } from 'react-spinners';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  if (!isLoggedIn) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute; 