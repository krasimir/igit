/* eslint-disable react/self-closing-comp */
import React from 'react';
import PropTypes from 'prop-types';

import Logo from './Logo';

export default function Loading({ message, showLogo }) {
  return (
    <div className="loading centered-content tac">
      { showLogo && <Logo /> }
      <p>{ message }</p>
      <div className='lds-ellipsis'><div></div><div></div><div></div><div></div></div>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  showLogo: PropTypes.bool
};
Loading.defaultProps = {
  message: 'Loading. Please wait.',
  showLogo: true
};
