import React from 'react';
import PropTypes from 'prop-types';

export default function Logo({ width }) {
  return <img src='/img/logo_120.png' width={100} className='logo' />;
}

Logo.defaultProps = {
  width: 100
};
Logo.propTypes = {
  width: PropTypes.number
};
