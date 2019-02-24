/* eslint-disable no-use-before-define, max-len */
import { useState as useStateReact, useEffect as userEffectReact } from 'react';

const DEV = true;

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

function createStateSetter(slice) {
  const setStateMethodName = `set${ slice.charAt(0).toUpperCase() + slice.substr(1) }`;
  const setState = (newState) => {
    store.state[slice] = newState;
    store.onUpdate(slice);
  };

  if (!store.context[setStateMethodName]) {
    toContext(setStateMethodName, setState);
  }
  return setState;
}
function toContext(key, func) {
  store.context[key] = func;
}

function useState(slice, initialState) {
  if (!slice) {
    throw new Error('useState requires a state slice name that you are going to operate on.');
  }
  if (typeof initialState !== 'undefined' && typeof store.state[slice] === 'undefined') {
    store.state[slice] = initialState;
  }
  const [ state, setLocalState ] = useStateReact(store.state[slice]);
  const setState = createStateSetter(slice);

  if (!store.updaters[slice]) store.updaters[slice] = [];
  if (!store.updaters[slice].find(u => u === setLocalState)) {
    store.updaters[slice].push(setLocalState);
  }

  userEffectReact(() => () => {
    store.updaters[slice] = store.updaters[slice].filter(u => u !== setLocalState);
  }, []);
  return [ state, setState ];
};

function useReducer(slice, actions) {
  createStateSetter(slice);
  Object.keys(actions).forEach(actionName => {
    toContext(actionName, (payload) => {
      store.state[slice] = actions[actionName](store.state[slice], payload, store.context);
      store.onUpdate(slice);
    });
  });
}

function context(effects) {
  Object.keys(effects).forEach(effectName => {
    toContext(effectName, (action) => {
      return effects[effectName](action, store.context);
    });
  });
}

function useContext() {
  return store.context;
}

if (DEV) {
  window.__store = store;
}

export default {
  useState,
  useReducer,
  context,
  useContext
};
