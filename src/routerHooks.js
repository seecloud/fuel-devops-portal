import uiState from './stores/uiState';

export function requireAuthHook(nextState, replace) {
  if (!uiState.authenticated) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    });
  }
}

export function prohibitAuthHook(nextState, replace) {
  if (uiState.authenticated) replace('/');
}
