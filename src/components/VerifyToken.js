/* eslint-disable max-len, camelcase */
import riew from 'riew/react';

const View = ({ children, verify, verifying, error }) => {
  return children(verify, verifying, error);
};

const effect = ({ render, state, api, profile }) => {
  const [ error, setError ] = state(null);
  const [ verifying, setVerifying ] = state(false);
  const [ , setProfile ] = profile;

  render({
    error,
    verifying,
    async verify(token) {
      setError(null);
      setVerifying(true);
      try {
        api.setToken(token);
        setProfile(await api.verify());
      } catch (err) {
        setError(err);
        setVerifying(false);
      }
    }
  });
};

export default riew(View, effect).with('api', 'profile');
