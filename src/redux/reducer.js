import { NO_TOKEN } from "./constants";

const initialState = {
  profile: null
}

export default function(state = initialState, action) {
  switch(action.type) {
    case NO_TOKEN:
      return {
        ...state,
        profile: NO_TOKEN
      }
      break;
  }
  return state;
}