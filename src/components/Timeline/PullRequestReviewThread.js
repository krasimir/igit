/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import Date from '../utils/Date';
import { MESSAGE } from '../Icons';
import ReviewDiff from '../utils/ReviewDiff';
import roger from '../../jolly-roger';
import Postman from '../Postman';

function ThreadItem({ event, index, isBodyVisible, bodyVisibility, repoURL, context, repo, pr }) {
  const [ profile ] = roger.useState('profile');
  const { postman } = roger.useContext();
  const [ isEditing, edit ] = useState(false);
  const totalComments = event.comments.length;
  const isTheFirstOne = index === 0;
  let comment = event.comments[index];
  const allowEdit = comment.author.login === profile.login;
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
            <button className='card-tag-button' onClick={ () => bodyVisibility(!isBodyVisible) }>
              { totalComments > 1 ? <span>···<small> ({ totalComments })</small></span> : '···' }
            </button>
            { (isBodyVisible && allowEdit) &&
              <button className='card-tag-button' onClick={ () => edit(!isEditing) }>edit</button> }
            { event.isResolved && <span className='tag'>resolved</span> }
            { comment.outdated && <span className='tag'>outdated</span> }
            { (isBodyVisible && !isEditing) && (
                <div
                  className='markdown'
                  dangerouslySetInnerHTML={ { __html: marked(comment.body) } } />
            ) }
            { isEditing &&
              <Postman
                className='mt05'
                handler={ postman({ repo, pr }).PullRequestReviewThread }
                value={ { text: comment.body, id: comment.id } }
                onSave={ () => edit(false) }
                onCancel={ () => edit(false) } /> }
          </div>
        </div>
      </div>
    );
  }

  return isBodyVisible || context === 'files' ? (
    <div className={ `timeline-thread-comment ${ context === 'timeline' ? 'ml2' : 'my03 ml2' }` }>
      <div className='media small'>
        <img src={ comment.author.avatar } className='avatar' title={ comment.author.login }/>
        <div>
          <Date event={ comment } />
          { allowEdit && <button className='card-tag-button' onClick={ () => edit(!isEditing) }>edit</button> }
        </div>
      </div>
      { !isEditing && <div
        className='markdown mt05'
        dangerouslySetInnerHTML={ { __html: marked(comment.body) } } /> }
      { isEditing &&
        <Postman
          className='mt05'
          handler={ postman({ repo, pr }).PullRequestReviewThread }
          value={ { text: comment.body, id: comment.id } }
          onSave={ () => edit(false) }
          onCancel={ () => edit(false) } /> }
    </div>
  ) : null;
}
ThreadItem.propTypes = {
  event: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isBodyVisible: PropTypes.bool.isRequired,
  bodyVisibility: PropTypes.func.isRequired,
  repoURL: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired,
  repo: PropTypes.object.isRequired,
  pr: PropTypes.object.isRequired
};

export default function PullRequestReviewThread({ event, repo, pr, context }) {
  let [ isBodyVisible, bodyVisibility ] = useState(false);

  const comments = event.comments.map((comment, i) => {
    return (
      <ThreadItem
        event={ event }
        index={ i }
        key={ comment.id }
        isBodyVisible={ isBodyVisible }
        bodyVisibility={ bodyVisibility }
        repoURL={ repo.url }
        context={ context }
        repo={ repo }
        pr={ pr }/>
    );
  });

  return (
    <React.Fragment>
      { comments }
      {/* { isBodyVisible &&
        <div className={ `timeline-thread-comment ${ context === 'timeline' ? 'ml2' : 'my03 ml2' }` }>
          <Postman
            context={ event.type }
            repo={ repo }
            pr={ pr } />
        </div> } */}
    </React.Fragment>
  );
};

PullRequestReviewThread.propTypes = {
  event: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired,
  pr: PropTypes.object.isRequired,
  context: PropTypes.string.isRequired
};
PullRequestReviewThread.defaultProps = {
  context: 'timeline'
};
