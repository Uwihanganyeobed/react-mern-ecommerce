import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authToken } = useAuth();


  if (!isLoggedIn || !authToken) {
    return <Navigate to="/login" />;
  }

  return children; // Render children if authenticated
};

export default ProtectedRoute;
