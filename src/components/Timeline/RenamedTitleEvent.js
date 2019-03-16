import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { EDIT } from '../Icons';
import trim from '../utils/trim';

export default function RenamedTitleEvent({ event }) {
  return (
    <div className='media small'>
      <img src={ event.author.avatar } className='avatar'/>
      <div>
        <Date event={ event } />&nbsp;
        <EDIT size={ 18 }/>
        { trim(`renamed to ${ event.currentTitle }`) }
      </div>
    </div>
  );
};

RenamedTitleEvent.propTypes = {
  event: PropTypes.object.isRequired
};
