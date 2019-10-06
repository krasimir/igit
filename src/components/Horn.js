import React, { useState } from 'react';
import PropTypes from 'prop-types';
import riew from 'riew/react';

import isItANewEvent from './utils/isItANewEvent';
import { EYE } from './Icons';

function Horn({ events, children, markAsRead, markAsUnread, notifications }) {
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
  events: PropTypes.array.isRequired,
  children: PropTypes.object.isRequired,
  markAsRead: PropTypes.func.isRequired,
  markAsUnread: PropTypes.func.isRequired,
  notifications: PropTypes.func.isRequired
};

export default riew(Horn).with('markAsRead', 'markAsUnread', 'notifications');

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

export function withHorn(Component) {
  return function WithHorn({ dim, ...props }) { // eslint-disable-line
    const [ undimComponent, isUndim ] = unDim(dim);
    let events = [ props.event ]; // eslint-disable-line

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
