import { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export const useAuthCheck = (requireAdmin = false) => {
  const { isLoggedIn, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        navigate('/login');
      } else if (requireAdmin && user?.role !== 'admin') {
        navigate('/');
      }
    }
  }, [isLoggedIn, loading, user, requireAdmin, navigate]);

  return { isLoggedIn, user, loading };
}; 