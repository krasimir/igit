import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Logo from './Logo';

export default function Header({ profile }) {
  return (
    <header>
      <Link to='/'>
        <Logo width={ 70 }/>
      </Link>
      <div className='separator' />
      <div className='right profile'>
        <Link to='/settings'>
          <img src={ profile.avatar } />
        </Link>
      </div>
    </header>
  );
}

Header.propTypes = {
  profile: PropTypes.object.isRequired
};
