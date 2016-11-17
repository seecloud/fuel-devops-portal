export function composeEnterHooks(...hooks) {
  return function onEnter(nextState, replace, callback) {
    let remainingHooks = [...hooks];
    function replaceAndInterruptProcessing(...args) {
      remainingHooks = [];
      replace(...args);
    }
    (function processNextHook(error) {
      if (error || !remainingHooks.length) {
        callback(error);
        return;
      } else {
        remainingHooks.shift()(nextState, replaceAndInterruptProcessing, processNextHook);
      }
    })();
  };
}

export async function fetchDataHook(stores, fetchData, nextState, replace, callback) {
  try {
    stores.uiState.fetchingData = true;
    await fetchData(stores, nextState, replace);
    return callback();
  } catch (error) {
    return callback(error);
  } finally {
    stores.uiState.fetchingData = false;
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
