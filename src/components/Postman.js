import React, { useState } from 'react';

import roger from '../jolly-roger';

export default function Postman() {
  const [ profile ] = roger.useState('profile');
  const [ isTyping, type ] = useState(false);

  return (
    <div className='postman cf'>
      <div className='media small'>
        <img src={ profile.avatar } className='avatar' title={ profile.login }/>
        <textarea
          placeholder='Reply'
          className={ isTyping ? 'type' : '' }
          onClick={ () => type(true) } />
      </div>
      { isTyping && <div className='right mt05'>
        <button className='brand cancel' onClick={ () => type(false) }>Cancel</button>
        <button className='brand cta'>Comment</button>
      </div> }
    </div>
  );
}
