import React, { useState } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import Date from '../utils/Date';
import { MESSAGE, CHECK_CIRCLE, STORM, CLIPBOARD } from '../Icons';

export default function PullRequestReview({ event }) {
  let [ isBodyVisible, bodyVisibility ] = useState(false);
  let StateIcon = MESSAGE;
  let stateLabel = '';

  switch (event.state) { // APPROVED, CHANGES_REQUESTED, COMMENTED, DISMISSED, PENDING
    case 'APPROVED':
      stateLabel = 'Approved';
      StateIcon = CHECK_CIRCLE;
    break;
    case 'CHANGES_REQUESTED':
      stateLabel = 'Changes requested';
      StateIcon = STORM;
    break;
    case 'PENDING':
      stateLabel = 'Pending review';
      StateIcon = CLIPBOARD;
    break;
    case 'COMMENT':
      stateLabel = 'Comment';
    break;
    case 'DISMISS':
    stateLabel = 'Review dismissed';
    break;
  }
  return (
    <div className={ `media small timeline-review-${ event.state }` }>
      <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
      <div>
        <Date event={ event } />&nbsp;
        <StateIcon size={ 18 }/>
        <small>{ stateLabel }</small>
        { event.body !== '' && <button className='card-tag-button' onClick={ () => bodyVisibility(!isBodyVisible) }>
          ···
        </button>}
        { isBodyVisible && <div
          className='markdown'
          dangerouslySetInnerHTML={ { __html: marked(event.body) } } /> }
        { event.state === 'PENDING' && <p>Show a form for submitting a pending review</p>}
      </div>
    </div>
  );
};

PullRequestReview.propTypes = {
  event: PropTypes.object.isRequired
};
