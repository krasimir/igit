import React, { useState } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import Date from '../utils/Date';
import { MESSAGE } from '../Icons';

export default function Comment({ event }) {
  let [ isBodyVisible, bodyVisibility ] = useState(false);

  return (
    <div className='media small'>
      <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
      <div>
        <Date event={ event } />&nbsp;
        <MESSAGE size={ 18 }/>
        { event.body !== '' && <button className='view-more' onClick={ () => bodyVisibility(!isBodyVisible) }>
          ···
        </button>}
        { isBodyVisible && <div
          className='markdown'
          dangerouslySetInnerHTML={ { __html: marked(event.body) } } /> }
      </div>
    </div>
  );
};

Comment.propTypes = {
  event: PropTypes.object.isRequired
};
