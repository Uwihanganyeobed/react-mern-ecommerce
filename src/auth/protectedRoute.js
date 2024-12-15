import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authToken } = useContext(AuthContext);

  if (!isLoggedIn || !authToken) {
    return <Navigate to="/login" />;
  }

  return children; // Render children if authenticated
};

export default ProtectedRoute;
