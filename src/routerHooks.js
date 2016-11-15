export function requireAuthHook({uiState}, nextState, replace) {
  if (!uiState.authenticated) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    });
  }
}

export function prohibitAuthHook({uiState}, nextState, replace) {
  if (uiState.authenticated) replace('/');
}

export function logoutHook({uiState}, nextState, replace) {
  uiState.authenticated = false;
  replace('/login');
}
