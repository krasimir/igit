/* eslint-disable no-use-before-define */
import { useState as useStateReact, useEffect as userEffectReact } from 'react';

const log = (...args) => {
  console.log(...args);
};

const store = {
  state: {},
  updaters: {},
  context: {}
};

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

  return [ state, store.context[slice] ];
};

export function useReducer(slice, actions) {
  validate([slice, actions], 'useReducer');

  Object.keys(actions).forEach(actionName => {
    const callbacksKey = `${ actionName }_callbacks`;

    if (!store.context[slice]) store.context[slice] = {};
    if (!store.context[slice][callbacksKey]) store.context[slice][callbacksKey] = [];
    store.context[slice][callbacksKey].push(actions[actionName].bind(store.context[slice]));
    store.context[slice][actionName] = (payload) => {
      log('reducer', actionName, payload);
      store.context[slice][callbacksKey].forEach(callback => {
        store.state[slice] = callback(store.state[slice], payload, store.context[slice]);
        if (store.updaters[slice]) {
          store.updaters[slice].forEach(u => u(store.state[slice]));
        }
      });
    };
  });
}

export function useEffect(slice, effects) {
  validate([slice, effects], 'useEffect');

  Object.keys(effects).forEach(effectName => {
    const callbacksKey = `${ effectName }_callbacks`;

    if (!store.context[slice]) store.context[slice] = {};
    if (!store.context[slice][callbacksKey]) store.context[slice][callbacksKey] = [];
    store.context[slice][callbacksKey].push(effects[effectName].bind(store.context[slice]));
    store.context[slice][effectName] = (action) => {
      log('effect', effectName, action);
      store.context[slice][callbacksKey].forEach(callback => {
        callback(action, store.context[slice]);
      });
    };
  });
}

function validate(args, methodName) {
  if (!args[0] || typeof args[0] !== 'string') {
    throw new Error(`${ methodName } requires a string as a first argument.`);
  }
  if (!args[1] || typeof args[1] !== 'object') {
    throw new Error(`${ methodName } requires an object as a second argument.`);
  }
}