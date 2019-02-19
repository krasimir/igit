import { useState, useEffect } from 'react';

const store = {
  state: {},
  updaters: [],
  reducers: [],
  subscribers: {},
  setInitialState(value) {
    this.state = value;
  },
  setState(value) {
    this.state = value;
    this.updaters.forEach(u => u(value));
  },
  dispatch(action) {
    console.log('-->', JSON.stringify(action));
    if (this.subscribers[action.type]) {
      this.subscribers[action.type].forEach(s => s(action));
    }
    this.setState(
      this.reducers.reduce((newState, reducer) => {
        newState = reducer(newState, action);
        return newState;
      }, this.state)
    );
  },
  addReducer(reducer) {
    this.reducers.push(reducer);
  },
  subscribe(actionType, subscriber) {
    if (!this.subscribers[actionType]) this.subscribers[actionType] = [];
    this.subscribers[actionType].push(subscriber);
  }
};

export const dispatch = store.dispatch.bind(store);
export const addReducer = store.addReducer.bind(store);
export const setInitialState = store.setInitialState.bind(store);
export const subscribe = store.subscribe.bind(store);

export function useProcess() {
  const [ state, setLocalState ] = useState(store.state);

  if (!store.updaters.find(u => u === setLocalState)) {
    store.updaters.push(setLocalState);
  }

  useEffect(() => () => {
    store.updaters = store.updaters.filter(u => u !== setLocalState);
  }, []);

  return [ state, dispatch ];
};
