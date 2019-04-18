/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import roger from '../jolly-roger';
import isItANewEvent from './utils/isItANewEvent';
import { EYE } from './Icons';

function Horn({ events, children }) {
  const { markAsRead, markAsUnread } = roger.useContext();
  const [ notifications ] = roger.useState('notifications');
  const [ otherOptions, showOtherOptions ] = useState(false);

  if (events.length === 0) return null;

  const unread = events.filter(event => isItANewEvent(event, notifications));
  const allRead = unread.length === 0;
  const ids = events.map(({ id }) => id);

  return (
    <div className='horn' onMouseOver={ () => showOtherOptions(true) } onMouseLeave={ () => showOtherOptions(false) }>
      <div
        onClick={ () => allRead ? markAsUnread(ids) : markAsRead(ids) }
        className={ allRead ? 'count read' : 'count' }>
        { allRead ? events.length : unread.length }
      </div>
      { otherOptions && children }
    </div>
  );
}

Horn.propTypes = {
  events: PropTypes.array.isRequired
};

export function unDim(isDimmedByDefault, onDimChange = () => {}) {
  const [ isUndimmed, undim ] = useState(false);

  return [
    isDimmedByDefault ? (
      <div className='view' onClick={ () => {
        onDimChange(!isUndimmed);
        undim(!isUndimmed);
      } }>
        <EYE size={ 18 } />
      </div>
    ) : null,
    isUndimmed ? false : isDimmedByDefault
  ];
};

export default Horn;

export function withHorn(Component) {
  return function WithHorn({ dim, ...props }) {
    const [ undimComponent, isUndim ] = unDim(dim);
    let events = [ props.event ];

    return (
      <div className='relative'>
        <Component { ...props } dim={ isUndim }/>
        <Horn events={ events }>
          { undimComponent }
        </Horn>
      </div>
    );
  };
}
