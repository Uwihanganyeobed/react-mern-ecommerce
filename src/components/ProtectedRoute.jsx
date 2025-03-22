import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Protected route error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-w-full">
            {this.state.error && this.state.error.toString()}
          </pre>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isLoggedIn, user, loading, authChecked } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute mounted - Path:", location.pathname);
    console.log("Auth State:", { 
      isLoggedIn, 
      user: user ? `${user.email} (${user._id})` : 'None',
      loading, 
      authChecked 
    });
  }, [isLoggedIn, user, loading, authChecked, location.pathname]);

  // If still checking auth or loading, show loading spinner
  if (!authChecked || loading) {
    console.log("ProtectedRoute: Still loading or checking auth");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    console.log("ProtectedRoute: Not logged in, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If admin route but user is not admin
  if (requireAdmin && user?.role !== 'admin' && user?.role !== 'Admin') {
    console.log("ProtectedRoute: Not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute: Access granted, rendering outlet");
  
  // User is authenticated (and is admin if required)
  return (
    <ErrorBoundary>
      <div className="protected-route-content">
        <Outlet />
      </div>
    </ErrorBoundary>
  );
};

export default ProtectedRoute; 