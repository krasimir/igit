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

function getContext(slice) {
  if (!store.context[slice]) {
    store.context[slice] = {
      setState(newState) {
        log('reducer', 'setState', newState);
        store.state[slice] = newState;
        store.onUpdate(slice);
      }
    };
  }
  return store.context[slice];
}
function validate(args, methodName) {
  if (!args[0] || typeof args[0] !== 'string') {
    throw new Error(`${ methodName } requires a string as a first argument.`);
  }
  if (!args[1] || typeof args[1] !== 'object') {
    throw new Error(`${ methodName } requires an object as a second argument.`);
  }
}
function validateContextMethod(slice, method) {
  if (!store.context[slice][method]) {
    throw new Error(`There is no "${ method }" defined for the "${ slice }" state. Check your useReducer and useEffect calls.`);
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

  return [ state, getContext(slice) ];
};

export function useReducer(slice, actions) {
  validate([slice, actions], 'useReducer');
  const context = getContext(slice);

  Object.keys(actions).forEach(actionName => {
    context[actionName] = (payload) => {
      log('reducer', actionName, payload);
      validateContextMethod(slice, actionName);
      store.state[slice] = actions[actionName](store.state[slice], payload, context);
      store.onUpdate(slice);
    };
  });
}

export function useEffect(slice, effects) {
  validate([slice, effects], 'useEffect');
  const context = getContext(slice);

  Object.keys(effects).forEach(effectName => {
    context[effectName] = (action) => {
      log('effect', effectName, action);
      validateContextMethod(slice, effectName);
      effects[effectName](action, context);
      store.onUpdate(slice);
    };
  });
}
