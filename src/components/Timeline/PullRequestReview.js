import React, { useState } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import Date from '../utils/Date';
import { MESSAGE, CHECK_CIRCLE, STORM, CLIPBOARD } from '../Icons';

export default function PullRequestReview({ event }) {
  let [ isBodyVisible, bodyVisibility ] = useState(false);
  let StateIcon = MESSAGE;

  switch (event.state) { // APPROVED, CHANGES_REQUESTED, COMMENTED, DISMISSED, PENDING
    case 'APPROVED':
      StateIcon = CHECK_CIRCLE;
    break;
    case 'CHANGES_REQUESTED':
      StateIcon = STORM;
    break;
    case 'PENDING':
      StateIcon = CLIPBOARD;
    break;
  }
  return (
    <div className={ `media small timeline-review-${ event.state }` }>
      <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
      <div>
        <Date event={ event } />&nbsp;
        <StateIcon size={ 18 }/>
        { event.state.toLowerCase().replace('_', ' ') }
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
