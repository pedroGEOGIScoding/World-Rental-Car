import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <p>Loading authentication status...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to home page if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;