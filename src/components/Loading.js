import React from 'react';

import Logo from './Logo';

export default function Loading() {
  return (
    <div className="loading centered-content tac">
      <Logo />
      <p><small>Loading. Please wait.</small></p>
    </div>
  );
};
