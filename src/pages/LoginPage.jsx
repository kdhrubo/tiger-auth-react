import React from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth
import './LoginPage.css';

const LoginPage = () => {
  const { login, isLoading } = useAuth(); // Use auth context

  const handleLogin = () => {
    login().catch(err => { // login from context now handles its own errors/loading
      console.error("Login initiation failed from LoginPage", err);
    });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <p>You need to log in to access protected resources.</p>
      <button onClick={handleLogin} className="login-button" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login with Auth Server'}
      </button>
    </div>
  );
};

export default LoginPage;
