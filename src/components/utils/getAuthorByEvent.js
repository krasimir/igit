import React from 'react';
import PropTypes from 'prop-types';

export default function getAuthorByEvent(event) {
  if (event.author) {
    return event.author;
  } else if (
    event.type === 'PullRequestReviewThread' &&
    event.comments &&
    event.comments[0] &&
    event.comments[0].author
  ) {
    return event.comments[0].author;
  }
  return { login: 'unknown', avatar: '/img/avatar.png' };
}

export function AuthorAvatar({ event, size }) {
  const user = getAuthorByEvent(event);

  return <img src={ user.avatar } alt={ user.login } className='avatar' style={ { width: size } }/>;
}
AuthorAvatar.defaultProps = {
  size: 24
};
AuthorAvatar.propTypes = {
  event: PropTypes.object.isRequired,
  size: PropTypes.number
};
