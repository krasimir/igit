import React from 'react';
import PropTypes from 'prop-types';

import roger from '../jolly-roger';
import isItANewEvent from './utils/isItANewEvent';

function Horn({ events }) {
  const { markAsRead, markAsUnread } = roger.useContext();
  const [ notifications ] = roger.useState('notifications');

  if (events.length === 0) return null;

  const unread = events.filter(event => isItANewEvent(event, notifications));

  if (unread.length === 0) {
    return (
      <div className='horn read' onClick={ () => markAsUnread(events.map(({ id }) => id)) }>
        { events.length }
      </div>
    );
  }

  return (
    <div className='horn' onClick={ () => markAsRead(events.map(({ id }) => id)) }>
      { unread.length }
    </div>
  );
}

Horn.propTypes = {
  events: PropTypes.array.isRequired
};

 export default Horn;
