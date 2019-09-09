import React from 'react';
import { Link } from 'react-router-dom';

import Logo from './Logo';

export default function Header() {
  return (
    <header>
      <Link to='/' className='p0 no-hover'>
        <Logo />
      </Link>
    </header>
  );
}
