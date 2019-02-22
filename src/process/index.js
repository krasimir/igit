import { useEffect, useReducer } from '../react-process';

import api from '../api';

useEffect('profile', {
  async initialize(action, { set }) {
    set(await api.getProfile());
  }
});

useReducer('profile', {
  set(profile, newProfile) {
    return newProfile;
  }
});
