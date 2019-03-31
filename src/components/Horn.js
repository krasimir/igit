import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import flattenPREvents from '../api/utils/flattenPREvents';

import roger from '../jolly-roger';

function Horn({ ids }) {
  const { markAsRead } = roger.useContext();
  const [ notifications ] = roger.useState('notifications');
  const [ repos ] = roger.useState('repos');
  const [ profile ] = roger.useState('profile');
  const value = typeof ids === 'function' ? ids() : ids;
  const allEvents = repos.reduce((events, repo) => {
    if (repo.prs) {
      return events.concat(...repo.prs.map((pr => flattenPREvents(pr, true))));
    }
    return events;
  }, []);
  let unread;

  function isAuthoredByTheCurrentUser(id) {
    const e = allEvents.find(event => event.id === id);

    if (!e) return false;
    return e.author && e.author.login === profile.login;
  }

  if (Array.isArray(value)) {
    unread = value.filter(
      id => !notifications.find(i => i === id) && !isAuthoredByTheCurrentUser(id)
    ).length;
    if (!unread) {
      return null;
    }
  } else {
    if (notifications.find(id => id === value) || isAuthoredByTheCurrentUser(value)) {
      return null;
    }
    unread = '1';
  }

  return (
    <div className='horn' onClick={ () => markAsRead(value) }>{ unread }</div>
  );
}

Horn.propTypes = {
  ids: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]).isRequired
};

export default withRouter(Horn);
