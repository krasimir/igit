import { GET_PROFILE, SET_PROFILE } from './constants';

export const getProfile = () => ({ type: GET_PROFILE });
export const setProfile = profile => ({ type: SET_PROFILE, profile });
