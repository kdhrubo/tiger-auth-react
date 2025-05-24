import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from './AuthService'; // Your existing AuthService
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To handle initial auth state loading
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await authService.getUser();
      if (currentUser && !currentUser.expired) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser(); // Load user on initial mount

    // Event listeners for oidc-client-ts events
    const onUserLoaded = (loadedUser) => {
      console.log('AuthContext: User loaded', loadedUser);
      setUser(loadedUser);
      setIsLoading(false);
    };
    const onUserUnloaded = () => {
      console.log('AuthContext: User unloaded');
      setUser(null);
      setIsLoading(false);
    };
    const onAccessTokenExpired = async () => {
      console.log('AuthContext: Access token expired, attempting silent renew');
      setIsLoading(true);
      try {
        await authService.renewToken(); // UserManager handles setting the new user
        // The userLoaded event should fire if renew is successful
      } catch (error) {
        console.error('AuthContext: Silent renew failed, user needs to login again.', error);
        setUser(null); // Clear user as renew failed
        setIsLoading(false);
        // Optionally navigate to login: navigate('/login');
      }
    };

    authService.userManager.events.addUserLoaded(onUserLoaded);
    authService.userManager.events.addUserUnloaded(onUserUnloaded);
    authService.userManager.events.addAccessTokenExpired(onAccessTokenExpired);

    return () => { // Cleanup
      authService.userManager.events.removeUserLoaded(onUserLoaded);
      authService.userManager.events.removeUserUnloaded(onUserUnloaded);
      authService.userManager.events.removeAccessTokenExpired(onAccessTokenExpired);
    };
  }, [loadUser]);

  const login = async () => {
    setIsLoading(true); // Set loading true before redirect
    try {
      await authService.login(); // This will redirect
      // setUser will be updated by the event listener or callback
    } catch (error) {
      console.error("Login initiation failed in AuthContext:", error);
      setIsLoading(false); // Reset loading if redirect fails
    }
  };

  const logout = async () => {
    setIsLoading(true); // Set loading true before redirect
    try {
      await authService.logout(); // This will redirect
      // setUser will be updated by the event listener
    } catch (error) {
      console.error("Logout failed in AuthContext:", error);
      setUser(null); // Fallback clear user
      setIsLoading(false); // Reset loading if redirect fails
      navigate('/'); // Fallback redirect
    }
  };

  const completeLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.signinCallback();
      // userManager.events.addUserLoaded should fire, which updates context state.
      // If not, or for immediate feedback:
      if (loggedInUser && !loggedInUser.expired) {
        setUser(loggedInUser);
      } else {
        setUser(null); // Should not happen if signinCallback succeeded
      }
      const redirectPath = loggedInUser?.state?.path || '/';
      navigate(redirectPath);
      return loggedInUser; // Return user for CallbackPage if needed
    } catch (error) {
      console.error('Error completing login in AuthContext:', error);
      setUser(null);
      setIsLoading(false);
      navigate('/login?error=callback_failed'); // Or an error page
      throw error; // Re-throw for CallbackPage to potentially handle
    } finally {
        // setIsLoading(false); // Managed by userLoaded event or error path
    }
  }, [navigate]);
  
  return (
    <AuthContext.Provider value={{ user, login, logout, completeLogin, isLoading, isAuthenticated: !!user && !user.expired }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
