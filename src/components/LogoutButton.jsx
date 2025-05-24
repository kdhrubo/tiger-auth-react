import React from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth
import './LogoutButton.css';

const LogoutButton = () => {
  const { logout, isLoading } = useAuth(); // Use auth context

  const handleLogout = () => {
    logout().catch(error => { // logout from context now handles its own errors/loading
        console.error('Logout failed from LogoutButton', error);
    });
  };

  return (
    <button onClick={handleLogout} className="logout-button" disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
