import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth
import { useLocation } from 'react-router-dom'; // To check for error query params

const CallbackPage = () => {
  const { completeLogin, isLoading } = useAuth(); // Use auth context
  const [error, setError] = useState(null);
  const location = useLocation(); // For checking query params

  useEffect(() => {
    // Check for error from auth server in query params
    const searchParams = new URLSearchParams(location.search);
    const oauthError = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (oauthError) {
      console.error(`OAuth Error: ${oauthError}, Description: ${errorDescription}`);
      setError(`Login failed: ${errorDescription || oauthError}. Please try again.`);
      // No need to call completeLogin if server already indicates an error
    } else {
      completeLogin().catch(e => {
        console.error('Error handling signin callback in Page:', e);
        // Error state is set by completeLogin or if it re-throws.
        // Setting it here again can be redundant but safe.
        setError('Login callback failed. Please try logging in again.');
      });
    }
  }, [completeLogin, location.search]); // Add location.search as dependency

  if (isLoading && !error) { // Show loading only if no error yet and still loading
    return (
      <div>
        <h2>Loading...</h2>
        <p>Please wait while we process your login.</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <h2>Login Callback Error</h2>
        <p>{error}</p>
        {/* Link/button to try again might navigate to /login */}
      </div>
    );
  }

  // If not loading and no error, AuthContext should have redirected.
  // This content is fallback or if redirection hasn't happened yet.
  return (
    <div>
      <h2>Processing complete.</h2>
      <p>You should be redirected shortly.</p>
    </div>
  );
};

export default CallbackPage;
