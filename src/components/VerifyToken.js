/* eslint-disable max-len, camelcase */
import { useState } from '../react-process';
import PropTypes from 'prop-types';

function VerifyToken({ children, api }) {
  const [ { error, verifying }, { verify } ] = useState('verification', { error: null, verifying: false });

  return children(verify, verifying, error);
}

VerifyToken.propTypes = {
  children: PropTypes.func.isRequired
};

export default VerifyToken;
