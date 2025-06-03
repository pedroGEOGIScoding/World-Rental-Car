import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserManager, User, UserManagerSettings } from 'oidc-client-ts';

// Define the authentication configuration
const cognitoAuthConfig: UserManagerSettings = {
  authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_W7NoSP6pZ",
  client_id: "4iobb3l8qaopve3h8sca6d75on",
  redirect_uri: "http://localhost:8080/callback",
  response_type: "code",
  scope: "email openid phone",
  post_logout_redirect_uri: "http://localhost:8080",
  silent_redirect_uri: "http://localhost:8080/silent-refresh.html",
};

// Create user manager instance
const userManager = new UserManager(cognitoAuthConfig);

// Type definitions
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  error: null,
  loading: true,
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const getUser = async () => {
      try {
        const currentUser = await userManager.getUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to get user', err);
        setError('Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Add event listeners for user changes
    const handleUserLoaded = (loadedUser: User) => {
      setUser(loadedUser);
      setError(null);
    };

    const handleUserUnloaded = () => {
      setUser(null);
    };

    const handleSilentRenewError = (err: Error) => {
      console.error('Silent renew error', err);
      setError('Session renewal failed');
    };

    const handleUserSignedOut = () => {
      setUser(null);
    };

    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addSilentRenewError(handleSilentRenewError);
    userManager.events.addUserSignedOut(handleUserSignedOut);

    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeSilentRenewError(handleSilentRenewError);
      userManager.events.removeUserSignedOut(handleUserSignedOut);
    };
  }, []);

  // Login function
  const login = async () => {
    try {
      await userManager.signinRedirect();
    } catch (err) {
      console.error('Login failed', err);
      setError('Login failed');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear user from state first
      setUser(null);
      
      // Remove tokens and user data from storage
      await userManager.removeUser();
      
      // If available, try to revoke tokens (may not be supported by all providers)
      try {
        await userManager.revokeTokens();
      } catch (revokeError) {
        console.log('Token revocation not supported or failed, continuing logout');
      }
      
      // Force navigation to home page
      window.location.href = "/";
    } catch (err) {
      console.error('Logout failed', err);
      setError('Logout failed');
      
      // If logout fails, still try to redirect to home
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user && !user.expired,
        user,
        login,
        logout,
        error,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Export userManager for callback handling
export { userManager };
