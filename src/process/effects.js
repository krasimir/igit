import { useEffect } from '../react-process';
import { GET_PROFILE } from './constants';
import { setProfile } from './actions';

import api from '../api';

useEffect('profile', async (dispatch, action) => {
  if (action.type === GET_PROFILE) {
    dispatch(setProfile(await api.getProfile()));
  }
});
