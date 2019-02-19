import { NO_TOKEN, SET_PROFILE, SET_SUBSCRIBED_REPOS } from './constants';

const initialState = {
  profile: null,
  repos: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case NO_TOKEN:
      return {
        ...state,
        profile: NO_TOKEN
      };
    case SET_PROFILE:
      return {
        ...state,
        profile: action.profile
      };
    case SET_SUBSCRIBED_REPOS:
      return {
        ...state,
        repos: action.repos
      };
  }
  return state;
}
