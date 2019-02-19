import { connect } from 'react-redux';

import { toggleRepo } from '../../redux/actions';

function Dispatch({ children, ...props }) {
  return children(props);
};

export default connect(
  null,
  dispatch => ({
    toggleRepo: (...args) => dispatch(toggleRepo(...args))
  })
)(Dispatch);
