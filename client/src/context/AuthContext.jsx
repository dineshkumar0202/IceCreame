import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Date.now() / 1000;
    return payload.exp && payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userBranch = localStorage.getItem('userBranch');
    const username = localStorage.getItem('username');
    
    // Check if token exists and is not expired
    if (token && !isTokenExpired(token)) {
      return { token, role: userRole, branch: userBranch, username };
    }
    
    // If token is expired or missing, clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userBranch');
    localStorage.removeItem('username');
    return null;
  });

  // Check token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        console.log('Token expired, logging out user');
        logout();
      }
    };

    // Check immediately and then every minute
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = (token, role, branch, username) => {
    // Validate token before storing
    if (!token || isTokenExpired(token)) {
      console.error('Received invalid or expired token');
      return false;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userBranch', branch);
    localStorage.setItem('username', username);
    setUser({ token, role, branch, username });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userBranch');
    localStorage.removeItem('username');
    setUser(null);
  };

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    return user && user.token && !isTokenExpired(user.token);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
