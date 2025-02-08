import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, setAuthToken, removeAuthToken } from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update the useEffect to properly handle auth state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const checkAuth = async () => {
      if (token) {
        setAuthToken(token);
        try {
          const response = await auth.getCurrentUser();
          if (response.data) {
            setUser(response.data);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          removeAuthToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await auth.login(credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      // Set user data immediately from login response
      setUser(userData);
      setIsLoggedIn(true);
      
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await auth.register(userData);
      
      if (response.data.success) {
        toast.success(
          "Registration successful! Please check your email to verify your account.",
          { autoClose: 5000 }
        );
        return true;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      toast.error(errorMsg);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout(); // Call logout endpoint
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      removeAuthToken();
      setUser(null);
      setIsLoggedIn(false);
      toast.success("Successfully logged out!");
    }
  };

  const forgotPassword = async (email) => {
    try {
      await auth.forgotPassword(email);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
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
      if (response.data && response.data.isEmailVerified) {  // or whatever success flag your API returns
        toast.success("Email verified successfully! Please login to continue.");
        return true;
      }
      return false;
    } catch (error) {
      // Don't show toast here since VerifyEmail component will handle the UI
      console.error('Verification error:', error);
      return false;
    }
  };

  const resendVerification = async () => {
    try {
      await auth.resendVerification();
      toast.success("Verification email sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend verification");
    }
  };

  const value = {
    user,
    loading,
    isLoggedIn,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};