import { NO_TOKEN, STORE_ACCESS_TOKEN, VERIFY_ACCESS_TOKEN } from './constants';

export const noToken = () => ({ type: NO_TOKEN });
export const verifyAccessToken = (token) => ({ type: VERIFY_ACCESS_TOKEN, token });
export const storeAccessToken = (token) => ({ type: STORE_ACCESS_TOKEN, token });
