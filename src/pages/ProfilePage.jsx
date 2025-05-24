import React from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth

const ProfilePage = () => {
  const { user, isLoading } = useAuth(); // Use auth context

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    // This case should ideally be handled by ProtectedRoute,
    // but as a fallback or if direct navigation occurs:
    return <p>Could not load user profile. You might not be logged in or session expired.</p>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>This page is protected. Only logged-in users should see this.</p>
      {user.profile && (
        <>
          <p><strong>Email:</strong> {user.profile.email || user.profile.sub}</p>
          <p><strong>Name:</strong> {user.profile.name || (user.profile.given_name && user.profile.family_name ? `${user.profile.given_name} ${user.profile.family_name}` : 'N/A')}</p>
          <p><strong>Preferred Username:</strong> {user.profile.preferred_username || 'N/A'}</p>
          <p><strong>Access Token Expires:</strong> {new Date(user.expires_at * 1000).toLocaleString()}</p>
          <details>
            <summary>View ID Token Claims</summary>
            <pre>{JSON.stringify(user.profile, null, 2)}</pre>
          </details>
          {user.access_token && 
            <details>
              <summary>View Access Token (first 30 chars)</summary>
              <pre>{user.access_token.substring(0,30)}...</pre>
            </details>
          }
        </>
      )}
    </div>
  );
};

export default ProfilePage;
