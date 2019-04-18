import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { GIT_MERGE } from '../Icons';
import Horn from '../Horn';
import unDim from './unDim';

export default function MergedEvent({ event, dim }) {
  const [ unDimComponent, isDimmed ] = unDim(dim);
  const cls = `timeline-thread-comment media small relative ${ isDimmed ? 'dim' : ''}`;

  return (
    <div className={ cls } id={ event.id }>
      <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
      <div>
        <Date event={ event } />&nbsp;
        <GIT_MERGE size={ 18 }/>
        <small>merged to</small> <span className='branch'>{ event.ref }</span>
      </div>
      <Horn events={ [ event ] }/>
      { unDimComponent }
    </div>
  );
};

MergedEvent.propTypes = {
  event: PropTypes.object.isRequired,
  dim: PropTypes.bool
};
