import React from 'react';
import { useAuth } from '../context/authContext';

const AuthDebug = () => {
  const { isLoggedIn, user, loading, authChecked } = useAuth();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        maxHeight: '200px',
        overflow: 'auto'
      }}
    >
      <div><strong>Auth Status:</strong></div>
      <div>Logged In: {isLoggedIn ? '✅' : '❌'}</div>
      <div>Loading: {loading ? '⏳' : '✅'}</div>
      <div>Auth Checked: {authChecked ? '✅' : '❌'}</div>
      <div>User: {user ? user.email : 'None'}</div>
      <div>Role: {user ? user.role : 'None'}</div>
      <div>Token: {localStorage.getItem('token') ? '✅' : '❌'}</div>
      <div>
        <button 
          onClick={() => console.log('Current user:', user)}
          style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            padding: '2px 5px',
            borderRadius: '3px',
            marginTop: '5px',
            cursor: 'pointer'
          }}
        >
          Log User
        </button>
      </div>
    </div>
  );
};

export default AuthDebug; 