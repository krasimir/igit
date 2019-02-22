/* eslint-disable no-use-before-define, max-len */
import { useState as useStateReact, useEffect as userEffectReact } from 'react';

const log = (...args) => {
  console.log(...args);
};

const store = {
  state: {},
  updaters: {},
  context: {},
  onUpdate(slice) {
    if (this.updaters[slice]) {
      this.updaters[slice].forEach(u => u(this.state[slice]));
    }
  }
};

function validate(args, methodName) {
  if (!args[0] || typeof args[0] !== 'string') {
    throw new Error(`${ methodName } requires a string as a first argument.`);
  }
  if (!args[1] || typeof args[1] !== 'object') {
    throw new Error(`${ methodName } requires an object as a second argument.`);
  }
}
function validateContextMethod(method) {
  if (!store.context[method]) {
    throw new Error(`There is no "${ method }" defined for. Check your useReducer and useEffect calls.`);
  }
}

export function useState(slice, initialState) {
  if (!slice) {
    throw new Error('useProcess requires a state slice name that you are going to operate on.');
  }
  if (typeof initialState !== 'undefined') {
    store.state[slice] = initialState;
  }
  const [ state, setLocalState ] = useStateReact(store.state[slice]);

  if (!store.updaters[slice]) store.updaters[slice] = [];
  if (!store.updaters[slice].find(u => u === setLocalState)) {
    store.updaters[slice].push(setLocalState);
  }

  userEffectReact(() => () => {
    store.updaters[slice] = store.updaters[slice].filter(u => u !== setLocalState);
  }, []);

  return [ state, store.context ];
};

export function useReducer(slice, actions) {
  validate([slice, actions], 'useReducer');
  Object.keys(actions).forEach(actionName => {
    store.context[actionName] = (payload) => {
      log('reducer', actionName, payload);
      validateContextMethod(actionName);
      store.state[slice] = actions[actionName](store.state[slice], payload, store.context);
      store.onUpdate(slice);
    };
  });
}

export function useEffect(slice, effects) {
  validate([slice, effects], 'useEffect');
  Object.keys(effects).forEach(effectName => {
    store.context[effectName] = (action) => {
      log('effect', effectName, action);
      validateContextMethod(effectName);
      effects[effectName](action, store.context);
      store.onUpdate(slice);
    };
  });
}
