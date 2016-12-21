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

// hooks-specific partial application to preserve function.length - it's needed for react-router
// partial() from lodash doesn't preserve function.length
export function partial(func, ...args) {
  return function hook(nextState, replace, callback) {
    return func.call(this, ...args, nextState, replace, callback);
  };
}
