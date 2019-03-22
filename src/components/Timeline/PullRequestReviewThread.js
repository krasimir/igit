/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import Date from '../utils/Date';
import { MESSAGE } from '../Icons';
import ReviewDiff from '../utils/ReviewDiff';

function ThreadItem({ event, index, isBodyVisible, bodyVisibility, repoURL, context }) {
  const totalComments = event.comments.length;
  const isTheFirstOne = index === 0;
  let comment = event.comments[index];
  let str = comment.path;

  if (str.length > 60) {
    str = '...' + str.substr(str.length - 60, str.length);
  }
  str += comment.position ? ':' + comment.position : '';

  if (isTheFirstOne && context === 'timeline') {
    return (
      <div className='rel timeline-thread-comment'>
        { isBodyVisible &&
          <ReviewDiff data={ comment } className='mb05' shrinkBottom={ 12 } repoURL={ repoURL }/> }
        <div className='media small'>
          <img src={ comment.author.avatar } className='avatar' title={ comment.author.login }/>
          <div>
            <Date event={ event.comments[totalComments - 1] } />&nbsp;
            <MESSAGE size={ 18 }/>
            <small>{ str }</small>
            <button className='view-more' onClick={ () => bodyVisibility(!isBodyVisible) }>
              { totalComments > 1 ? <span>···<small> ({ totalComments })</small></span> : '···' }
            </button>
            { event.isResolved && <span className='tag'>resolved</span> }
            { comment.outdated && <span className='tag'>outdated</span> }
            { isBodyVisible && (
                <div
                  className='markdown'
                  dangerouslySetInnerHTML={ { __html: marked(comment.body) } } />
            ) }
          </div>
        </div>
      </div>
    );
  }

  return isBodyVisible || context === 'files' ? (
    <div className={ `timeline-thread-comment ${ context === 'timeline' ? 'ml2' : 'm03' }` }>
      <div className='media small'>
        <img src={ comment.author.avatar } className='avatar' title={ comment.author.login }/>
        <Date event={ comment } />
      </div>
      <div
        className='markdown mt05'
        dangerouslySetInnerHTML={ { __html: marked(comment.body) } } />
    </div>
  ) : null;
}
ThreadItem.propTypes = {
  event: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isBodyVisible: PropTypes.bool.isRequired,
  bodyVisibility: PropTypes.func.isRequired,
  repoURL: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired
};

export default function PullRequestReviewThread({ event, repo, context }) {
  let [ isBodyVisible, bodyVisibility ] = useState(false);

  return event.comments.map((comment, i) => {
    return (
      <ThreadItem
        event={ event }
        index={ i }
        key={ i }
        isBodyVisible={ isBodyVisible }
        bodyVisibility={ bodyVisibility }
        repoURL={ repo.url }
        context={ context }/>
    );
  });
};

PullRequestReviewThread.propTypes = {
  event: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired
};
PullRequestReviewThread.defaultProps = {
  context: 'timeline'
};
