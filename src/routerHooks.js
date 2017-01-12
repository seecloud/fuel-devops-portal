import FetchDataErrorDialog from './components/dialogs/FetchDataErrorDialog';

export async function fetchDataHook(stores, nextState, replace, callback) {
  const dataFetchingRequest = this.component.fetchData({...stores, ...nextState});
  stores.uiState.pendingRequestsCount++;
  try {
    await dataFetchingRequest;
    return callback();
  } catch (error) {
    if (!stores.uiState.previousPathname) {
      replace('/');
    } else if (nextState.location.pathname !== stores.uiState.previousPathname) {
      replace(stores.uiState.previousPathname);
    }
    FetchDataErrorDialog.show();
    return callback(error);
  } finally {
    stores.uiState.pendingRequestsCount--;
  }
}

export function requireAuthHook({uiState}, nextState, replace, callback) {
  if (!uiState.authenticated) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    });
  }
  callback();
}

export function prohibitAuthHook({uiState}, nextState, replace, callback) {
  if (uiState.authenticated) replace('/');
  callback();
}

export function logoutHook({uiState}, nextState, replace, callback) {
  uiState.authenticated = false;
  replace('/login');
  callback();
}
