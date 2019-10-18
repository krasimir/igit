import React, { useState } from 'react';
import PropTypes from 'prop-types';
import riew from 'riew/react';

import isItANewEvent from './utils/isItANewEvent';

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
  markAsRead: PropTypes.func.isRequired,
  markAsUnread: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
  children: PropTypes.object
};

const EnhancedHorn = riew(Horn).with('markAsRead', 'markAsUnread', 'notifications');

export default EnhancedHorn;

export function withHorn(Component) {
  return function WithHorn({ ...props }) { // eslint-disable-line
    let events = [ props.event ]; // eslint-disable-line

    return (
      <div className='relative'>
        <Component { ...props } />
        <EnhancedHorn events={ events } />
      </div>
    );
  };
}
