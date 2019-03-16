import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { MESSAGE, CHECK_CIRCLE, STORM } from '../Icons';

export default function PullRequestReview({ event }) {
  let StateIcon = MESSAGE;

  switch (event.state) { // APPROVED, CHANGES_REQUESTED, COMMENTED, DISMISSED, PENDING
    case 'APPROVED':
      StateIcon = CHECK_CIRCLE;
    break;
    case 'CHANGES_REQUESTED':
      StateIcon = STORM;
    break;
  }
  return (
    <div className='media small'>
      <img src={ event.author.avatar } className='avatar'/>
      <div>
        <Date event={ event } />&nbsp;
        <StateIcon size={ 18 }/>
        { event.state.toLowerCase().replace('_', ' ') }
      </div>
    </div>
  );
};

PullRequestReview.propTypes = {
  event: PropTypes.object.isRequired
};
