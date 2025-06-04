# AWS Cognito Authentication Implementation

This document explains how AWS Cognito authentication has been implemented in the World Rental Car application.

## Overview

AWS Cognito provides user authentication, authorization, and user management for web and mobile applications. In this implementation, we've integrated Cognito using the OAuth 2.0 authorization code flow to provide secure authentication for users of the World Rental Car application.

## Implementation Details

### Configuration

The AWS Cognito User Pool is configured with the following parameters:

```javascript
const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_W7NoSP6pZ",
  client_id: "4iobb3l8qaopve3h8sca6d75on",
  redirect_uri: "http://localhost:8080/callback",
  response_type: "code",
  scope: "email openid phone",
  post_logout_redirect_uri: "http://localhost:8080",
  silent_redirect_uri: "http://localhost:8080/silent-refresh.html",
};
```

### Core Components

The authentication system consists of several key components:

#### 1. AuthContext (src/main/frontend/auth/AuthContext.tsx)

A React context that manages authentication state throughout the application:
- Handles login/logout operations
- Manages and stores user information
- Tracks authentication state (loading, error, authenticated)
- Provides authentication methods to other components
- Implements simplified logout process that redirects users to home

```typescript
// Usage example
const { isAuthenticated, user, login, logout } = useAuth();
```

#### 2. Protected Route (src/main/frontend/auth/ProtectedRoute.tsx)

A component that restricts access to routes based on authentication status:
- Redirects unauthenticated users
- Shows a loading state during authentication checks
- Renders the protected content when authenticated

```typescript
// Usage example
<ProtectedRoute>
  <SecureComponent />
</ProtectedRoute>
```

#### 3. Callback Handler (src/main/frontend/views/callback.tsx)

A page that handles the OAuth redirect after successful authentication:
- Processes the authorization code from Cognito
- Exchanges the code for tokens
- Redirects to the application after successful login
- Hidden from the application's navigation menu using `menu: { exclude: true }`

#### 4. Application Layout Integration (src/main/frontend/views/@layout.tsx)

The main layout is integrated with authentication state:
- Drawer menu items are disabled for unauthenticated users
- Visual indicators show which routes require authentication
- Only the home page remains accessible without authentication
- Status messages indicate when authentication is required

### Authentication Flow

1. **Login Initiation**:
   - User clicks the "Login to book a car or register" button
   - Application redirects to the Cognito hosted UI

2. **Authentication**:
   - User authenticates with their credentials on the Cognito hosted UI
   - Cognito redirects back to the application with an authorization code

3. **Token Exchange**:
   - The callback page exchanges the authorization code for access and ID tokens
   - User information is extracted from the tokens

4. **Application State**:
   - The application updates its state to reflect the authenticated user
   - Protected routes become accessible to the user
   - Drawer menu items become interactive

5. **Session Management**:
   - Tokens are stored securely
   - Silent refresh maintains the session without user intervention

6. **Logout Process**:
   - User clicks logout button
   - Local authentication state is cleared
   - User is redirected to the homepage in an unauthenticated state

### Integration with Application Features

The authentication system is integrated with the application's car booking flow:
- The home page conditionally displays login or booking options based on authentication status
- Car booking functionality is protected and requires authentication
- User information from Cognito can be used for personalization and user-specific features

#### Car Booking Flow Integration

The authentication system works seamlessly with the existing car booking features:

1. **User Authentication Required**: Before accessing the car selection and booking features
2. **Car Filtering**: After authentication, users can access the filtering system to find cars based on:
   - Delegation matching for pickup locations
   - Date availability checking
   - Complete rental period verification
3. **Car Selection UI**: The authenticated user can interact with the enhanced car selection UI with:
   - Responsive card components
   - Visual details and car images
   - "Select This Car" buttons
4. **Booking Confirmation**: After selecting a car, users can complete the booking process:
   - Review comprehensive booking details
   - See total price calculation based on rental duration
   - Confirm or cancel their booking

## How to Extend This Implementation

### Adding New Protected Routes

To protect additional routes or features:

```typescript
// Import the ProtectedRoute component
import ProtectedRoute from '../auth/ProtectedRoute';

// Wrap your component with ProtectedRoute
<ProtectedRoute>
  <YourSecureComponent />
</ProtectedRoute>
```

### Accessing User Information

To access user details in any component:

```typescript
import { useAuth } from '../auth/AuthContext';

function UserProfile() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user?.profile?.name || 'User'}</h1>
      <p>Email: {user?.profile?.email}</p>
    </div>
  );
}
```

### Customizing the Authentication Experience

To modify the login/logout UI or behavior, edit the relevant sections in:
- `src/main/frontend/views/@index.tsx` for the login button
- `src/main/frontend/auth/AuthContext.tsx` for authentication logic
- `src/main/frontend/views/@layout.tsx` for menu authentication integration

## Security Considerations

This implementation follows OAuth 2.0 and OpenID Connect best practices:
- Authorization code flow with PKCE for secure authentication
- Token-based authentication with refresh capabilities
- Secure handling of authentication state
- Proper separation of authentication concerns
- Visual and interactive safeguards to prevent unauthorized access

## Dependencies

The authentication system relies on:
- `oidc-client-ts`: Handles the OAuth 2.0 and OpenID Connect protocols
- React context API: Manages authentication state
- React Router: Manages navigation and protected routes

---

*Note: For production deployment, ensure that the Cognito User Pool settings, especially redirect URIs, are updated to match the production environment.*
