/* eslint-disable max-len, camelcase */
import riew from 'riew/react';
import { verify } from '../logic';

const VerifyToken = riew(
  ({ children, verify, verifying, error }) => {
    return children(verify, verifying, error);
  },
  ({ render }) => ({
    async verify(token) {
      render({ error: null, verifying: true });
      try {
        await verify(token);
      } catch (error) {
        render({ error, verifying: false });
      }
    }
  })
).withState({ error: null, verifying: false });

export default VerifyToken;
