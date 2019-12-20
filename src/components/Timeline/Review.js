import React, { useState } from 'react';
import PropTypes from 'prop-types';

import PullRequestReview from './PullRequestReview';
import SubmitPullRequestReview from './SubmitPullRequestReview';
import { CLIPBOARD } from '../Icons';

export default function Review({ pr, repo }) {
  const [sendReview, attemptToSendReview] = useState(false);
  const pendingReview = pr.events
    .filter((event) => event.type === 'PullRequestReview' && event.state === 'PENDING')
    .shift();

  if (pendingReview) {
    return (
      <PullRequestReview key={pendingReview.id + '_' + pr.events.length} event={pendingReview} pr={pr} repo={repo} />
    );
  } else if (sendReview) {
    return (
      <div className='timeline-review'>
        <SubmitPullRequestReview key={pr.id + '_' + pr.events.length} repo={repo} pr={pr} />
      </div>
    );
  }
  return (
    <div className='tac p1'>
      <button className='as-link' onClick={() => attemptToSendReview(true)}>
        <CLIPBOARD size={18} /> Submit code review
      </button>
    </div>
  );
}

Review.propTypes = {
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired
};
