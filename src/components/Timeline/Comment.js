import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { MESSAGE } from '../Icons';

export default function Comment({ event }) {
  return (
    <div className='media small'>
      <img src={ event.author.avatar } className='avatar'/>
      <div>
        <Date event={ event } />&nbsp;
        <MESSAGE size={ 18 }/>
      </div>
    </div>
  );
};

Comment.propTypes = {
  event: PropTypes.object.isRequired
};
