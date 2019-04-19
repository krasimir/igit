/* eslint-disable max-len, camelcase */
import roger from 'jolly-roger';
import PropTypes from 'prop-types';

function VerifyToken({ children }) {
  const { verify } = roger.useContext();
  const [ { error, verifying } ] = roger.useState('verification', { error: null, verifying: false });

  return children(verify, verifying, error);
}

VerifyToken.propTypes = {
  children: PropTypes.func.isRequired
};

export default VerifyToken;
