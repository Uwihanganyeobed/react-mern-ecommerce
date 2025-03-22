import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from "react";
import { auth, setAuthToken, removeAuthToken, initializeAuth } from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage to prevent flash of unauthenticated content
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [authChecked, setAuthChecked] = useState(false);
  const authCheckAttempted = useRef(false);

  // Function to check authentication status
  const checkAuthStatus = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (authCheckAttempted.current) return;
    authCheckAttempted.current = true;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log("Checking auth status, token exists:", !!token);
      
      if (!token) {
        // No token found, user is not logged in
        console.log("No token found, user is not logged in");
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('user');
        setAuthChecked(true);
        return false;
      }
      
      // Set token for API requests
      setAuthToken(token);
      
      // Verify token by getting current user
      console.log("Verifying token by getting current user");
      const response = await auth.getCurrentUser();
      
      console.log("Auth check response:", response);
      
      if (response && response.data) {
        // User is authenticated - handle the nested data structure
        const userData = response.data.data || response.data;
        console.log("User is authenticated:", userData);
        
        // Store the user data
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoggedIn(true);
        setAuthChecked(true);
        return true;
      } else {
        // Invalid response, clear token
        console.log("Invalid response, clearing token");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        removeAuthToken();
        setIsLoggedIn(false);
        setUser(null);
        setAuthChecked(true);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      removeAuthToken();
      setIsLoggedIn(false);
      setUser(null);
      setAuthChecked(true);
      return false;
    } finally {
      setLoading(false);
      authCheckAttempted.current = false;
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await auth.login(credentials);
      
      console.log("Login response:", response.data);
      
      if (response.data.token) {
        // Save token to localStorage and set in axios headers
        localStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        // Save user data - handle nested data structure
        const userData = response.data.user || response.data.data || response.data;
        console.log("Saving user data:", userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setAuthToken(response.data.token);
        setUser(userData);
        setIsLoggedIn(true);
        
        toast.success("Logged in successfully");
        return true;
      } else {
        toast.error("Login failed - no token received");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear auth state regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      removeAuthToken();
      setUser(null);
      setIsLoggedIn(false);
      toast.success("Logged out successfully");
    }
  };

  // Check auth status on initial load
  useEffect(() => {
    console.log("AuthProvider mounted, initializing auth");
    
    // Initialize auth from localStorage first
    initializeAuth();
    
    // Then verify with the server
    checkAuthStatus();
    
    // Add event listener for storage changes (for multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          // Token was removed
          setIsLoggedIn(false);
          setUser(null);
        } else if (e.newValue !== e.oldValue) {
          // Token was changed
          checkAuthStatus();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuthStatus]);

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await auth.register(userData);

      if (response.data.success) {
        toast.success(
          "Registration successful! Please check your email to verify your account.",
          { autoClose: 5000 }
        );
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await auth.forgotPassword(email);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await auth.resetPassword(token, newPassword);
      toast.success("Password successfully reset! Please login.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      throw error;
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await auth.verifyEmail(token);

      // Check if the response contains data and success status
      if (response.data && response.data.isEmailVerified) {
        // or whatever success flag your API returns
        toast.success("Email verified successfully! Please login to continue.");
        return true;
      }
      return false;
    } catch (error) {
      // Don't show toast here since VerifyEmail component will handle the UI
      console.error("Verification error:", error);
      return false;
    }
  };

  const resendVerification = async () => {
    try {
      await auth.resendVerification();
      toast.success("Verification email sent!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification"
      );
    }
  };

  const value = {
    user,
    loading,
    isLoggedIn,
    authChecked,
    login,
    register,
    logout,
    checkAuthStatus,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
  };

  console.log("AuthProvider rendering with state:", { 
    user: user ? `${user.email} (${user._id})` : 'None', 
    isLoggedIn, 
    authChecked, 
    loading 
  });

  // Only render children after initial auth check
  if (!authChecked && loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
