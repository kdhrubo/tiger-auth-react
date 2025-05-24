import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import authConfig from './authConfig'; // We created this earlier

class AuthService {
  constructor() {
    this.userManager = new UserManager({
      ...authConfig,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    });

    this.userManager.events.addUserLoaded((user) => {
      console.log('User loaded:', user);
    });

    this.userManager.events.addUserUnloaded(() => {
      console.log('User unloaded');
    });

    this.userManager.events.addAccessTokenExpired(() => {
      console.log('Token expired, trying to renew...');
      this.userManager.signinSilent().catch(error => {
        console.error('Silent renew failed:', error);
        // Optionally, redirect to login or show an error
      });
    });
  }

  getUser() {
    return this.userManager.getUser();
  }

  login() {
    return this.userManager.signinRedirect();
  }

  renewToken() {
    return this.userManager.signinSilent();
  }

  logout() {
    // Optional: Add parameters for ID token hint if required by your server
    return this.userManager.signoutRedirect();
  }

  signinCallback() {
    return this.userManager.signinRedirectCallback();
  }
}

const authService = new AuthService();
export default authService;
