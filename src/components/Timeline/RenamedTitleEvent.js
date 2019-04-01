import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { EDIT } from '../Icons';
import trim from '../utils/trim';
import Horn from '../Horn';

export default function RenamedTitleEvent({ event }) {
  return (
    <div className='media small relative' id={ event.id }>
      <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
      <div>
        <Date event={ event } />&nbsp;
        <EDIT size={ 18 }/>
        { trim(`renamed to ${ event.currentTitle }`) }
      </div>
      <Horn events={ [ event ] }/>
    </div>
  );
};

RenamedTitleEvent.propTypes = {
  event: PropTypes.object.isRequired
};
