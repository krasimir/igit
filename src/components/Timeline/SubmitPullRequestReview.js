import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import riew from 'riew/react';

import { LoadingAnimation } from '../Loading';

function SubmitPullRequestReview({ repo, pr, reviewId, prAuthor, submitReview, createReview, deleteReview, profile }) {
  const textareaEl = useRef(null);
  const [ text, type ] = useState(null);
  const [ submitted, setSubmitted ] = useState(false);
  const [ deleteSure, areYouSure ] = useState(false);
  const isAuthor = prAuthor && profile.login === prAuthor.login;

  async function submit(event) {
    setSubmitted(true);
    if (reviewId) {
      await submitReview({ reviewId, event, body: text });
    } else {
      await createReview({ repo, pr, event, body: text });
    }
  }
  async function del() {
    setSubmitted(true);
    await deleteReview({ reviewId });
  }

  return (
    <div className='cf' id={ pr ? pr.id : reviewId }>
      <textarea
        ref={ textareaEl }
        value={ text ? text : '' }
        placeholder='Leave a comment'
        className={ text !== null ? 'type' : '' }
        onClick={ () => type(text || '') }
        disabled={ submitted }
        onChange={ e => type(e.target.value) } />
      { (!submitted && reviewId) && <div className='left'>
        <button className='light' onClick={ () => {
          if (!deleteSure) {
            areYouSure(true);
          } else {
            del();
          }
        } }>{ !deleteSure ? 'Dismiss' : 'Dismissing! Are you sure?' }</button>
      </div> }
      { !submitted && <div className='right'>
        { !isAuthor &&
          <button className='brand delete' onClick={ () => submit('REQUEST_CHANGES') }>Request changes</button> }
        <button className='brand' onClick={ () => submit('COMMENT') }>Comment</button>
        { !isAuthor &&
          <button className='brand cta' onClick={ () => submit('APPROVE') }>Approve</button> }
      </div> }
      { submitted && <div className='right'><LoadingAnimation /></div> }
    </div>
  );
};

SubmitPullRequestReview.propTypes = {
  submitReview: PropTypes.func.isRequired,
  createReview: PropTypes.func.isRequired,
  deleteReview: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  reviewId: PropTypes.string,
  prAuthor: PropTypes.object,
  repo: PropTypes.object,
  pr: PropTypes.object,
  dim: PropTypes.bool
};

export default riew(SubmitPullRequestReview).with('submitReview', 'createReview', 'deleteReview', 'profile');
