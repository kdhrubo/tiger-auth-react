import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth
import './LoginPage.css'; // Keep if styles for the message are needed

const LoginPage = () => {
  const { login, isLoading, isAuthenticated } = useAuth(); // Added isAuthenticated

  useEffect(() => {
    // Ensure login is only called when not already in a loading state,
    // not authenticated, and the login function is available.
    // The login function from AuthContext itself handles redirection and
    // further isLoading state changes.
    if (!isLoading && !isAuthenticated) { // Updated condition
      login().catch(err => {
        console.error("Login initiation failed from LoginPage useEffect:", err);
        // Optional: Display an error message if redirect fails and loop is prevented
      });
    }
  }, [login, isLoading, isAuthenticated]); // Added isAuthenticated to dependencies

  // If already authenticated, and somehow landed here, consider redirecting away
  // For example, redirect to home page. This is an edge case.
  // However, ProtectedRoute should prevent authenticated users from reaching /login.
  // If (!isLoading && isAuthenticated) {
  //   // navigate('/'); // Requires useNavigate from react-router-dom
  //   // For now, just showing the redirecting message is fine as ProtectedRoute handles it.
  // }


  return (
    <div className="login-container">
      <h2>Redirecting to login...</h2>
      <p>Please wait while we redirect you to the authentication page.</p>
      {/* Display a spinner or specific message if isLoading is true */}
      {isLoading && <p>Processing authentication...</p>}
      {/* Optionally, if !isLoading && isAuthenticated, you could show "Already logged in, redirecting..." */}
    </div>
  );
};

export default LoginPage;
