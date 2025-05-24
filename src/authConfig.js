import { WebStorageStateStore } from 'oidc-client-ts';

const authConfig = {
  authority: 'http://localhost:8080', // Adjusted for potential Keycloak default
  client_id: 'public-client',
  redirect_uri: window.location.origin + '/callback',
  response_type: 'code',
  scope: 'openid profile email', // Common OIDC scopes
  post_logout_redirect_uri: window.location.origin + '/',
  userStore: new WebStorageStateStore({ store: window.localStorage }), // Store user data in local storage
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true,
};

export default authConfig;
