import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Logo from './Logo';

export default function Header({ profile }) {
  return (
    <header>
      <Link to='/' className='p0 no-hover'>
        <Logo width={ 70 } />
      </Link>
    </header>
  );
}

Header.propTypes = {
  profile: PropTypes.object.isRequired
};
