import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import roger from '../jolly-roger';

function Horn({ events }) {
  const { markAsRead, markAsUnread } = roger.useContext();
  const [ notifications ] = roger.useState('notifications');
  const [ profile ] = roger.useState('profile');

  function isAuthoredByTheCurrentUser(event) {
    return event.author && event.author.login === profile.login;
  }

  const unread = events.filter(
    event => !notifications.find(i => i === event.id) && !isAuthoredByTheCurrentUser(event)
  );

  if (unread.length === 0) {
    if (events.length === 1 && !isAuthoredByTheCurrentUser(events[0])) {
      return <div className='horn read' onClick={ () => markAsUnread([ events[0].id ]) }>✔</div>;
    }
    return null;
  }

  return (
    <div className='horn' onClick={ () => markAsRead(events.map(({ id }) => id)) }>
      { unread.length === 1 ? '✔' : unread.length }
    </div>
  );
}

Horn.propTypes = {
  events: PropTypes.any.isRequired
};

export default withRouter(Horn);
