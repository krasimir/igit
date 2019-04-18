import React, { useState } from 'react';

import { EYE } from '../Icons';

export default function unDim(isDimmedByDefault) {
  const [ isUndimmed, undim ] = useState(false);

  return [
    isDimmedByDefault ? (
      <div className='horn view' onClick={ () => undim(!isUndimmed) }>
        <EYE size={ 18 } />
      </div>
    ) : null,
    isUndimmed ? false : isDimmedByDefault
  ];
};
