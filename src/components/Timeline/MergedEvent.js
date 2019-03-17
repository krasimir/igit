import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { GIT_MERGE } from '../Icons';

export default function MergedEvent({ event }) {
  return (
    <div className='media small'>
      <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
      <div>
        <Date event={ event } />&nbsp;
        <GIT_MERGE size={ 18 }/>
        <small>merged to</small> <span className='branch'>{ event.ref }</span>
      </div>
    </div>
  );
};

MergedEvent.propTypes = {
  event: PropTypes.object.isRequired
};
