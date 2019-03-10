import React from 'react';
import PropTypes from 'prop-types';

export default function PR({ pr, toggleDetails, selected }) {
  return (
    <button
      onClick={ () => toggleDetails(pr) }
      className={ selected ? 'list-link pr-link selected' : 'list-link pr-link' }>
      <img src={ pr.authorAvatar } className='avatar small right'/>
      { pr.title }&nbsp;<a href={ pr.url } target='_blank'><span>(#{ pr.number })</span></a>
    </button>
  );
};

PR.propTypes = {
  pr: PropTypes.object.isRequired,
  toggleDetails: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
};
