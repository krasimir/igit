import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import roger from '../jolly-roger';
import isItANewEvent from './utils/isItANewEvent';

function Horn({ events }) {
  const { markAsRead, markAsUnread } = roger.useContext();
  const [ notifications ] = roger.useState('notifications');
  const [ profile ] = roger.useState('profile');

  if (events.length === 0) return null;

  function isAuthoredByTheCurrentUser(event) {
    return event.author && event.author.login === profile.login;
  }

  const unread = events.filter(event => isItANewEvent(event, notifications, profile));

  if (unread.length === 0) {
    if (events.length === 1 && !isAuthoredByTheCurrentUser(events[0])) {
      return <div className='horn read' onClick={ () => markAsUnread([ events[0].id ]) }>+1</div>;
    }
    return null;
  }

  return (
    <div className='horn' onClick={ () => markAsRead(events.map(({ id }) => id)) }>
      { unread.length }
    </div>
  );
}

Horn.propTypes = {
  events: PropTypes.any.isRequired
};

 export default withRouter(Horn);
