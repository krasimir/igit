import { useEffect, useReducer } from '../react-process';

import api from '../api';

useEffect('profile', {
  async initialize(action, { setState }) {
    setState(await api.getProfile());
  }
});
useReducer('profile', {

});

useEffect('verification', {
  async verify(token, { setState }) {
    setState({ verifying: true, error: null });

    api.setToken(token);
    try {
      await api.verify();
    } catch (error) {
      setState({ verifying: false, error });
    }
  }
});
