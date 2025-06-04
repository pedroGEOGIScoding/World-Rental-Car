import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { userManager } from '../auth/AuthContext';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';

// Hide from navigation menu
export const config: ViewConfig = {
  title: 'Authentication Callback',
  menu: { exclude: true },
};

export default function CallbackView() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processSignInCallback = async () => {
      try {
        await userManager.signinRedirectCallback();
        // Redirect to home page after successful login
        navigate('/');
      } catch (err) {
        console.error('Error processing sign-in callback:', err);
        setError('Failed to complete authentication. Please try again.');
        // Redirect to home page after a delay if there's an error
        setTimeout(() => navigate('/'), 3000);
      }
    };

    processSignInCallback();
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '0 20px',
        textAlign: 'center',
      }}
    >
      {error ? (
        <div>
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <p>Redirecting to home page...</p>
        </div>
      ) : (
        <div>
          <h2>Completing Login</h2>
          <p>Please wait while we complete your authentication...</p>
        </div>
      )}
    </div>
  );
}