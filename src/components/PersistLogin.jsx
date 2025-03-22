import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PersistLogin = () => {
  const { isLoggedIn, user, checkAuthStatus, loading, authChecked } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const verifyAuth = async () => {
      try {
        console.log("PersistLogin: Verifying authentication", { 
          isLoggedIn, 
          user: user ? user.email : 'None',
          authChecked
        });
        
        // Only try to refresh auth if not already logged in or if user data is missing
        if (!isLoggedIn || !user) {
          console.log("PersistLogin: Need to check auth status");
          await checkAuthStatus();
        } else {
          console.log("PersistLogin: Already logged in with user data, skipping check");
        }
      } catch (error) {
        console.error('PersistLogin verification error:', error);
      } finally {
        if (isMounted) {
          console.log("PersistLogin: Finished loading");
          setIsLoading(false);
        }
      }
    };

    // If we haven't checked auth yet, verify
    if (!authChecked) {
      console.log("PersistLogin: Auth not checked yet, verifying");
      verifyAuth();
    } else {
      console.log("PersistLogin: Auth already checked, skipping verification");
      setIsLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [checkAuthStatus, isLoggedIn, authChecked, user]);

  console.log("PersistLogin render - isLoading:", isLoading, "loading:", loading, "authChecked:", authChecked, "isLoggedIn:", isLoggedIn, "user:", user ? user.email : 'None');

  return (
    <>
      {isLoading || loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin; 