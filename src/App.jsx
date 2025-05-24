import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // BrowserRouter is now in main.jsx
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import CallbackPage from './pages/CallbackPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import LogoutButton from './components/LogoutButton';
import { useAuth } from './AuthContext'; // Import useAuth
import './App.css';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth(); // Use auth context

  if (isLoading) {
    return <div>Application Loading...</div>; // Or a more sophisticated loading spinner
  }

  return (
    <div>
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile (Protected)</Link></li>
          {!isAuthenticated ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <li><LogoutButton /></li>
          )}
        </ul>
        {isAuthenticated && user?.profile?.name && (
          <span style={{ color: 'white', marginRight: '20px' }}>Welcome, {user.profile.name}</span>
        )}
      </nav>

      <hr />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
