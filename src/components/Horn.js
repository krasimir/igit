import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import roger from '../jolly-roger';

function Horn({ ids }) {
  const { markAsRead } = roger.useContext();
  const [ notifications ] = roger.useState('notifications');
  const value = typeof ids === 'function' ? ids() : ids;
  let unread;

  if (Array.isArray(value)) {
    unread = value.filter(
      id => !notifications.find(i => i === id)
    ).length;
    if (!unread) {
      return null;
    }
  } else {
    if (notifications.find(id => id === value)) {
      return null;
    }
    unread = '1';
  }

  function onClick() {
    markAsRead(value);
  }

  return (
    <div className='horn' onClick={ onClick }>{ unread }</div>
  );
}

Horn.propTypes = {
  ids: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]).isRequired
};

export default withRouter(Horn);
