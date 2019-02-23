/* eslint-disable no-use-before-define, max-len */
import { useState as useStateReact, useEffect as userEffectReact } from 'react';

const log = (...args) => {
  // console.log(...args);
};

const store = {
  state: {},
  updaters: {},
  context: {},
  onUpdate(slice) {
    if (this.updaters[slice]) {
      this.updaters[slice].forEach(u => {
        u(this.state[slice]);
      });
    }
  }
};
let normalizedContext = store.context;

function validate(slice, actions, methodName) {
  if (!slice || typeof slice !== 'string') {
    throw new Error(`${ methodName } requires a string as a first argument.`);
  }
  if (!actions || typeof actions !== 'object') {
    throw new Error(`${ methodName } requires an object as a second argument.`);
  }
}
function createBuiltInContextMethods(slice) {
  const setStateMethodName = `set${ slice.charAt(0).toUpperCase() + slice.substr(1) }`;

  if (store.context[setStateMethodName]) return;

  addToContext(setStateMethodName, (newState) => {
    log(setStateMethodName, newState);
    store.state[slice] = newState;
    store.onUpdate(slice);
  });
}
function addToContext(key, func) {
  if (!store.context[key]) store.context[key] = [];
  store.context[key].push(func);
  normalizeContext();
}
function normalizeContext() {
  normalizedContext = Object.keys(store.context).reduce((result, key) => {
    result[key] = (...args) => {
      store.context[key].forEach(f => f(...args));
    };
    return result;
  }, {});
}

export function useState(slice, initialState) {
  if (!slice) {
    throw new Error('useState requires a state slice name that you are going to operate on.');
  }
  if (typeof initialState !== 'undefined' && typeof store.state[slice] === 'undefined') {
    store.state[slice] = initialState;
  }
  const [ state, setLocalState ] = useStateReact(store.state[slice]);

  if (!store.updaters[slice]) store.updaters[slice] = [];
  if (!store.updaters[slice].find(u => u === setLocalState)) {
    store.updaters[slice].push(setLocalState);
  }

  userEffectReact(() => {
    createBuiltInContextMethods(slice);
    return () => {
      store.updaters[slice] = store.updaters[slice].filter(u => u !== setLocalState);
    };
  }, []);
  return [ state, normalizedContext ];
};

export function useReducer(slice, actions) {
  validate(slice, actions, 'useReducer');
  createBuiltInContextMethods(slice);
  Object.keys(actions).forEach(actionName => {
    addToContext(actionName, (payload) => {
      log('reducer', actionName, payload);
      store.state[slice] = actions[actionName](store.state[slice], payload, normalizedContext);
      store.onUpdate(slice);
    });
  });
}

export function useEffect(slice, effects) {
  validate(slice, effects, 'useEffect');
  createBuiltInContextMethods(slice);
  Object.keys(effects).forEach(effectName => {
    addToContext(effectName, (action) => {
      log('effect', effectName, action);
      effects[effectName](action, normalizedContext);
    });
  });
}
