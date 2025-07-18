import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authcontext'; 
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default RequireAuth;