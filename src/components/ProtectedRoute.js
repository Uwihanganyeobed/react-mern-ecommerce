import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { ClipLoader } from 'react-spinners';

const ProtectedRoute = ({ children, allowedRoles = ['User', 'Admin'] }) => {
  const { user, isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 