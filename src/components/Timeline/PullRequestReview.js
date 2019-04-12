import React from 'react';
import PropTypes from 'prop-types';

import marked from '../utils/marked';
import Date from '../utils/Date';
import { MESSAGE, CHECK_CIRCLE, STORM, CLIPBOARD } from '../Icons';
import SubmitPullRequestReview from './SubmitPullRequestReview';
import flattenToPRReviewComments from '../../api/utils/flattenToPRReviewComments';
import Horn from '../Horn';

export default function PullRequestReview({ event, pr, repo, dim }) {
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
      stateLabel = 'Review comment';
    break;
    case 'DISMISS':
    stateLabel = 'Review dismissed';
    break;
  }

  const reviewComments = flattenToPRReviewComments(pr, event.id);

  if (dim && event.state !== 'PENDING') {
    return (
      <div className={ `timeline-review timeline-review-${ event.state } relative dim` } id={ event.id }>
        <div className='media small'>
          <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
          <div>
            <Date event={ event } />&nbsp;
            <StateIcon size={ 18 }/>
            <small>{ stateLabel }</small>
          </div>
        </div>
        <Horn events={ [ event ] } />
      </div>
    );
  }

  return (
    <div className={ `timeline-review timeline-review-${ event.state } relative` } id={ event.id }>
      <div className='media small'>
        <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
        <div>
          <Date event={ event } />&nbsp;
          <StateIcon size={ 18 }/>
          <small>{ stateLabel }</small>
        </div>
      </div>
      { event.body !== '' &&
          <div className='markdown mt05' dangerouslySetInnerHTML={ { __html: marked(event.body, repo) } } />
      }
      { reviewComments.length > 0 && <div className='mt05'>
        {
          reviewComments.map(comment => {
            return (
              <div className='m0 fz8 relative' key={ comment.id }>
                <a href={ `#${ comment.id }` }>{ comment.path }:{ comment.position }</a>&nbsp;
                { comment.outdated && <span className='tag'>outdated</span> }
                { comment.isResolved && <span className='tag resolved'>resolved</span> }
                <div
                  className='markdown mb05 fz9 opa7'
                  dangerouslySetInnerHTML={ { __html: marked(comment.body, repo) } } />
                <Horn events={ [ comment ] } />
              </div>
            );
          })
        }
      </div> }
      { event.state === 'PENDING' && <SubmitPullRequestReview reviewId={ event.id } prAuthor={ pr.author }/> }
      <Horn events={ [ event ] } />
    </div>
  );
};

PullRequestReview.propTypes = {
  event: PropTypes.object.isRequired,
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired,
  dim: PropTypes.bool
};
