import { NO_TOKEN, LOG_ERROR, CLEAR_ERROR, SET_PROFILE } from './constants';

const initialState = {
  profile: null,
  errors: [],
  repos: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case NO_TOKEN:
      return {
        ...state,
        profile: NO_TOKEN
      };
    case LOG_ERROR:
      return {
        ...state,
        errors: [
          ...state.errors,
          { type: action.reason }
        ]
      };
    case CLEAR_ERROR:
      return {
        ...state,
        errors: state.errors.filter(({ type }) => type !== action.reason)
      };
    case SET_PROFILE:
      return {
        ...state,
        profile: action.profile
      };
  }
  return state;
}
