import uiState from './stores/ui_state';

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
