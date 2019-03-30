import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import Date from '../utils/Date';
import { MESSAGE, CHECK_CIRCLE, STORM, CLIPBOARD } from '../Icons';
import SubmitPullRequestReview from './SubmitPullRequestReview';
import flattenToPRReviewComments from '../../api/utils/flattenToPRReviewComments';

export default function PullRequestReview({ event, pr }) {
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

  const reviewComments = flattenToPRReviewComments(pr, event.id);

  return (
    <div className={ `timeline-review-${ event.state }` }>
      <div className='media small'>
        <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
        <div>
          <Date event={ event } />&nbsp;
          <StateIcon size={ 18 }/>
          <small>{ stateLabel }</small>
        </div>
      </div>
      { event.body !== '' &&
          <div className='markdown my05' dangerouslySetInnerHTML={ { __html: marked(event.body) } } />
      }
      { reviewComments.length > 0 && <div className='mt05 quote'>
        {
          reviewComments.map(comment => {
            return (
              <div className='m0 fz8' key={ comment.id }>
                { comment.path }:{ comment.position }
                { comment.outdated && <span className='tag'>outdated</span> }
                { comment.isResolved && <span className='tag'>resolved</span> }
                <div
                  className='markdown mb05 fz9 opa5'
                  dangerouslySetInnerHTML={ { __html: marked(comment.body) } } />
              </div>
            );
          })
        }
      </div> }
      { event.state === 'PENDING' && <SubmitPullRequestReview reviewId={ event.id } prAuthor={ pr.author }/> }
    </div>
  );
};

PullRequestReview.propTypes = {
  event: PropTypes.object.isRequired,
  pr: PropTypes.object.isRequired
};
