import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { MESSAGE } from '../Icons';
import trim from '../utils/trim';

export default function Reference({ event }) {
  return (
    <div className='media small'>
      <img src={ event.author.avatar } className='avatar'/>
      <div>
        <Date event={ event } />&nbsp;
        <MESSAGE size={ 18 }/>
        <small>mentioned at</small>&nbsp;
        <a href={ event.target.url } target='_blank'>{ trim(`${ event.target.title }`, 40) }</a>
      </div>
    </div>
  );
};

Reference.propTypes = {
  event: PropTypes.object.isRequired
};
