/* eslint-disable max-len, camelcase */
import { useState } from '../../react-process';
import PropTypes from 'prop-types';

import withAPI from './withAPI';

function VerifyToken({ children, api }) {
  const [ { error, verifying }, setState ] = useState('verification', { error: null, verifying: false });

  const verify = async (token) => {
    setState({ verifying: true, error: null });

    api.setToken(token);
    try {
      await api.verify();
    } catch (error) {
      setState({ verifying: false, error });
    }
  };

  return children(verify, verifying, error);
}

VerifyToken.propTypes = {
  children: PropTypes.func.isRequired
};

export default VerifyToken;
