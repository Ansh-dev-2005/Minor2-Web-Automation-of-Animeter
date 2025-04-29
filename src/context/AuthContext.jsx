import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a base API URL using environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Configure axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token and get user data
        const response = await axios.get(`${API_URL}/api/auth/me`);
        console.log('Auth check response:', response.data);
        if (response.data && response.data) {
          setCurrentUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Only remove token if there's a specific authentication error (401/403)
        // Not on network errors or server errors
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          console.log('Invalid token detected, logging out');
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        } else {
          // For other errors (network, 500, etc.), keep the token
          console.log('Non-auth error occurred, keeping token');
          setIsAuthenticated(true); // Assume token is valid until proven otherwise
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  
  // Register a new user
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };
  
  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      const { token, user } = response.data;
      
      // Save token to local storage
      localStorage.setItem('token', token);
      
      // Set authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };
  
  // Logout user
  const logout = async () => {
    try {
      // Optional: Notify backend of logout
      await axios.post(`${API_URL}/api/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/api/auth/profile`, userData);
      setCurrentUser(response.data.user);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    }
  };
  
  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await axios.put(`${API_URL}/api/auth/change-password`, { 
        currentPassword, 
        newPassword 
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      throw err;
    }
  };
  
  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setError(null);
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset');
      throw err;
    }
  };
  
  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      await axios.post(`${API_URL}/api/auth/reset-password`, { token, newPassword });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      throw err;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        requestPasswordReset,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;