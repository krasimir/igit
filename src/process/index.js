import { useEffect, useReducer } from '../react-process';

import api from '../api';

useEffect('profile', {
  async initialize(action, { setProfile }) {
    setProfile(await api.getProfile());
  }
});
useReducer('profile', {
  setProfile(profile, newProfile) {
    return newProfile;
  }
});

useEffect('verification', {
  async verify(token, { setState, setProfile }) {
    setState({ verifying: true, error: null });

    api.setToken(token);
    try {
      setProfile(await api.verify());
    } catch (error) {
      setState({ verifying: false, error });
    }
  }
});
