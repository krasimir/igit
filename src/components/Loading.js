/* eslint-disable react/self-closing-comp */
import React from 'react';
import PropTypes from 'prop-types';

import Logo from './Logo';

export default function Loading({ message, showLogo, className}) {
  return (
    <div className={ `loading centered-content tac ${ className }` }>
      { showLogo && <Logo /> }
      <p>{ message }</p>
      <div className='lds-ellipsis'><div></div><div></div><div></div><div></div></div>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  showLogo: PropTypes.bool,
  className: PropTypes.string
};
Loading.defaultProps = {
  message: 'Loading. Please wait.',
  showLogo: true
};
