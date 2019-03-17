/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import Date from '../utils/Date';
import { MESSAGE } from '../Icons';
import ReviewDiff from '../utils/ReviewDiff';

function ThreadItem({ event, index, isBodyVisible, bodyVisibility, totalComments }) {
  let comment = event.comments[index];
  let str = comment.path;
  const isTheFirstOne = index === 0;

  if (str.length > 60) {
    str = '...' + str.substr(str.length - 60, str.length);
  }
  str += comment.position ? ':' + comment.position : '';

  if (isTheFirstOne) {
    return (
      <div className='rel timeline-thread-comment'>
        <div className='media small'>
          <img src={ comment.author.avatar } className='avatar'/>
          <div>
            <Date event={ comment } />&nbsp;
            <MESSAGE size={ 18 }/>
            <small>{ str }</small>
            <button className='view-more' onClick={ () => bodyVisibility(!isBodyVisible) }>
              { totalComments > 1 ? <span>···<small> ({ totalComments })</small></span> : '···' }
            </button>
          </div>
          { isBodyVisible && (
            <div style={ { gridColumn: '1/3' } }>
              <ReviewDiff data={ comment } className='mb05 mt05' shrinkBottom={ 8 }/>
              <div
                className='markdown'
                dangerouslySetInnerHTML={ { __html: marked(comment.body) } } />
            </div>
          ) }
        </div>
      </div>
    );
  }

  return isBodyVisible ? (
    <div className='timeline-thread-comment ml2'>
      <div className='media small'>
        <img src={ comment.author.avatar } className='avatar'/>
        <Date event={ comment } />
      </div>
      <div
        className='markdown timeline-thread-comment mt05'
        dangerouslySetInnerHTML={ { __html: marked(comment.body) } } />
    </div>
  ) : null;
}
ThreadItem.propTypes = {
  event: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isBodyVisible: PropTypes.bool.isRequired,
  bodyVisibility: PropTypes.func.isRequired,
  totalComments: PropTypes.number.isRequired
};

export default function PullRequestReviewThread({ event }) {
  let [ isBodyVisible, bodyVisibility ] = useState(true);

  return event.comments.map((comment, i) => {
    return (
      <ThreadItem
        totalComments={ event.comments.length }
        event={ event }
        index={ i }
        key={ i }
        isBodyVisible={ isBodyVisible }
        bodyVisibility={ bodyVisibility }/>
    );
  });
};

PullRequestReviewThread.propTypes = {
  event: PropTypes.object.isRequired
};
