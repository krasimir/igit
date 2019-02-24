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
      <Link to='/' className='left'>
        <span>Dashboard</span>
      </Link>
      <Link to='/repos' className='left'>
        <span>Repositories</span>
      </Link>
      <div className='right profile'>
        <Link to='/profile'>
          <img src={ profile.avatar } />
        </Link>
      </div>
    </header>
  );
}

Header.propTypes = {
  profile: PropTypes.object.isRequired
};
