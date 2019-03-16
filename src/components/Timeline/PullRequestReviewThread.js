/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import Date from '../utils/Date';
import { CORNER_DOWN_RIGHT, MESSAGE } from '../Icons';
import ReviewDiff from '../utils/ReviewDiff';

function ThreadItem({ event, index }) {
  let [ isBodyVisible, bodyVisibility ] = useState(true);
  let comment = event.comments[index];
  let str = comment.path;
  const iconStyle = { top: '22px', left: '4px', position: 'absolute' };
  const itemStyle = index > 0 ? { marginLeft: '40px' } : {};
  const isTheFirstOne = index === 0;

  if (str.length > 60) {
    str = '...' + str.substr(str.length - 60, str.length);
  }
  str += comment.position ? ':' + comment.position : '';

  if (isTheFirstOne) {
    return (
      <div className='rel timeline-thread-comment'>
        { event.comments.length > 1 ? <CORNER_DOWN_RIGHT style={ iconStyle }/> : null }
        <div className='media small' style={ itemStyle }>
          <img src={ comment.author.avatar } className='avatar'/>
          <div>
            <Date event={ comment } />&nbsp;
            <MESSAGE size={ 18 }/>
            <small>{ str }</small>
            <button className='view-more' onClick={ () => bodyVisibility(!isBodyVisible) }>···</button>
          </div>
          <div />
          { isBodyVisible && (
            <div>
              <ReviewDiff data={ comment }/>
              <div
                className='markdown'
                dangerouslySetInnerHTML={ { __html: marked(comment.body) } } />
            </div>
          ) }
        </div>
      </div>
    );
  }

  return (
    <div className='media small timeline-thread-comment' style={ itemStyle }>
      <img src={ comment.author.avatar } className='avatar'/>
      <div>
        <Date event={ comment } />&nbsp;
        <button className='view-more' onClick={ () => bodyVisibility(!isBodyVisible) }>···</button>
        { isBodyVisible &&
        <div
          className='markdown timeline-thread-comment'
          dangerouslySetInnerHTML={ { __html: marked(comment.body) } } /> }
      </div>
      <div />
    </div>
  );
}
ThreadItem.propTypes = {
  event: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

export default function PullRequestReviewThread({ event }) {
  return event.comments.map((comment, i) => <ThreadItem event={ event } index={ i } key={ i }/>);
};

PullRequestReviewThread.propTypes = {
  event: PropTypes.object.isRequired
};
