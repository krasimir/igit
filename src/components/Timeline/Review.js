import React from 'react';
import PropTypes from 'prop-types';

import PullRequestReview from './PullRequestReview';
import SubmitPullRequestReview from './SubmitPullRequestReview';

export default function Review({ pr, repo }) {
  const pendingReview = pr.events.filter(
    event => event.type === 'PullRequestReview' && event.state === 'PENDING'
  ).shift();

  return pendingReview ?
    (
      <PullRequestReview
        key={ pendingReview.id + '_' + pr.events.length }
        event={ pendingReview }
        pr={ pr }
        repo={ repo }/>
    ) :
    (
      <SubmitPullRequestReview
        key={ pr.id + '_' + pr.events.length }
        repo={ repo }
        pr={ pr }/>
    );
}

Review.propTypes = {
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired
};
