import { useReducer } from '../react-process';
import { SET_PROFILE } from './constants';

useReducer('profile', (profile, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return action.profile;
  }
  return profile;
});
