import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth
import './LoginPage.css'; // Keep if styles for the message are needed

const LoginPage = () => {
  const { login, isLoading } = useAuth(); // Use auth context

  useEffect(() => {
    // Ensure login is only called when not already in a loading state
    // and the login function is available.
    // The login function from AuthContext itself handles redirection and
    // further isLoading state changes.
    if (!isLoading) { 
      login().catch(err => {
        console.error("Login initiation failed from LoginPage useEffect:", err);
        // Optionally, display an error message on this page if redirect fails
      });
    }
  }, [login, isLoading]); // Add dependencies as required by your ESLint rules

  return (
    <div className="login-container">
      <h2>Redirecting to login...</h2>
      <p>Please wait while we redirect you to the authentication page.</p>
      {/* Display a spinner or specific message if isLoading is true from the initial call */}
      {isLoading && <p>Processing...</p>}
    </div>
  );
};

export default LoginPage;
