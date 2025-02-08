import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute; 