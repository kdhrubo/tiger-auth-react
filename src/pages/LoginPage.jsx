import React from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth
import './LoginPage.css'; // Keep if styles for the message are needed
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login, isLoading } = useAuth(); // Use auth context
  const navigate = useNavigate();

  const handleLogin = () => {
    login().catch(err => {
      console.error("Login initiation failed:", err);
      navigate('/error', { state: { message: 'Login failed. Please try again.' } });
    });
  };

  return (
    <div className="login-container">
      <h2>Welcome to the Application</h2>
      <p>Please log in to continue</p>
      
      <button 
        onClick={handleLogin} 
        disabled={isLoading}
        className="login-button"
      >
        {isLoading ? 'Processing...' : 'Login with Auth Server'}
      </button>
      
      {isLoading && <p>Redirecting to authentication server...</p>}
    </div>
  );
};

export default LoginPage;