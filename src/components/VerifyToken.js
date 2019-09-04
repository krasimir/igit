/* eslint-disable max-len, camelcase */
import riew from 'riew/react';
import { setProfile } from '../logic';

const VerifyToken = riew(
  ({ children, verify, verifying, error }) => {
    return children(verify, verifying, error);
  },
  function VerifyTokenController({ render, api }) {
    return {
      async verify(token) {
        render({ error: null, verifying: true });
        try {
          api.setToken(token);
          setProfile(await api.verify());
        } catch (error) {
          render({ error, verifying: false });
        }
      }
    };
  }
).withState({ error: null, verifying: false }, 'api');

export default VerifyToken;
