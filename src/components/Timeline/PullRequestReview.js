import React, { useState } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import Date from '../utils/Date';
import { MESSAGE, CHECK_CIRCLE, STORM, CLIPBOARD } from '../Icons';
import SubmitPullRequestReview from './SubmitPullRequestReview';
import flattenToPRReviewComments from '../../api/utils/flattenToPRReviewComments';

export default function PullRequestReview({ event, pr }) {
  let [ isBodyVisible, bodyVisibility ] = useState(true);
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
    case 'COMMENTED':
      stateLabel = 'Comment';
    break;
    case 'DISMISS':
    stateLabel = 'Review dismissed';
    break;
  }

  return (
    <div className={ `timeline-review-${ event.state }` }>
      <div className='media small'>
        <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
        <div>
          <Date event={ event } />&nbsp;
          <StateIcon size={ 18 }/>
          <small>{ stateLabel }</small>
          { event.body !== '' && <button className='card-tag-button' onClick={ () => bodyVisibility(!isBodyVisible) }>
            ···
          </button> }
        </div>
      </div>
      { (isBodyVisible && event.body !== '') && <div
        className='markdown mt05'
        dangerouslySetInnerHTML={ { __html: marked(event.body) } } /> }
      { event.state === 'PENDING' &&
        <div className='mt05'>
          <SubmitPullRequestReview reviewId={ event.id } prAuthor={ pr.author }/>
          <div className='my1 quote'>
            {
              flattenToPRReviewComments(pr, event.id).map(comment => {
                return (
                  <div className='m0 fz8' key={ comment.id }>
                    { comment.path }:{ comment.position }
                    <div
                      className='markdown mb05 fz9 opa5'
                      dangerouslySetInnerHTML={ { __html: marked(comment.body) } } />
                  </div>
                );
              })
            }
          </div>
        </div> }
    </div>
  );
};

PullRequestReview.propTypes = {
  event: PropTypes.object.isRequired,
  pr: PropTypes.object.isRequired
};
