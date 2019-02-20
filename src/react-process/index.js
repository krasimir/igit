import { useState as useStateReact, useEffect as userEffectReact } from 'react';

const store = {
  state: {},
  updaters: {},
  reducers: {},
  effects: {},
  setInitialState(value) {
    this.state = value;
  },
  dispatch(slice, args) {
    console.log('-->', JSON.stringify(args));
    if (this.effects[slice]) {
      this.effects[slice].forEach(effect => effect(
        (...dispatchArgs) => this.dispatch(slice, dispatchArgs),
        ...args
      ));
    }
    if (this.reducers[slice]) {
      this.state[slice] = this.reducers[slice].reduce((newState, reducer) => {
        newState = reducer(newState, ...args);
        return newState;
      }, this.state[slice]);
      if (this.updaters[slice]) {
        this.updaters[slice].forEach(u => u(this.state[slice]));
      }
    }
  }
};

export const setInitialState = store.setInitialState.bind(store);

export function useState(slice, initialState) {
  if (!slice) {
    throw new Error('useProcess requires a state slice name that you are going to operate on.');
  }
  if (typeof initialState !== 'undefined' && typeof store.state[slice] === 'undefined') {
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

  return [ state, (...args) => store.dispatch(slice, args) ];
};

export function useReducer(slice, reducer) {
  if (!slice || typeof slice !== 'string') {
    throw new Error('useReducer requires a state slice name as a first argument.');
  }
  if (!store.reducers[slice]) store.reducers[slice] = [];
  store.reducers[slice].push(reducer);
}

export function useEffect(slice, effect) {
  if (!store.effects[slice]) store.effects[slice] = [];
  store.effects[slice].push(effect);
}
