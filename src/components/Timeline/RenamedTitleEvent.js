import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { EDIT } from '../Icons';
import trim from '../utils/trim';
import Horn from '../Horn';
import unDim from './unDim';

export default function RenamedTitleEvent({ event, dim }) {
  const [ unDimComponent, isDimmed ] = unDim(dim);
  const cls = `timeline-thread-comment media small relative ${ isDimmed ? 'dim' : ''}`;

  return (
    <div className={ cls } id={ event.id }>
      <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
      <div>
        <Date event={ event } />&nbsp;
        <EDIT size={ 18 }/>
        { trim(`renamed to ${ event.currentTitle }`) }
      </div>
      <Horn events={ [ event ] }/>
      { unDimComponent }
    </div>
  );
};

RenamedTitleEvent.propTypes = {
  event: PropTypes.object.isRequired,
  dim: PropTypes.bool
};
