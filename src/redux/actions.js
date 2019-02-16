import { NO_TOKEN, SET_PROFILE, VERIFY_ACCESS_TOKEN, LOG_ERROR, CLEAR_ERROR } from './constants';

export const noToken = () => ({ type: NO_TOKEN });
export const verifyAccessToken = (token) => ({ type: VERIFY_ACCESS_TOKEN, token });
export const setProfile = (profile) => ({ type: SET_PROFILE, profile });
export const logError = reason => ({ type: LOG_ERROR, reason });
export const clearError = reason => ({ type: CLEAR_ERROR, reason });
