/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import Commit from './Commit';
import PullRequestReview from './PullRequestReview';
import Comment from './Comment';
import MergedEvent from './MergedEvent';
import PullRequestReviewThread from './PullRequestReviewThread';
import RenamedTitleEvent from './RenamedTitleEvent';
import Reference from './Reference';

const components = {
  Commit,
  PullRequestReview,
  PullRequestReviewComment: Comment,
  IssueComment: Comment,
  MergedEvent,
  PullRequestReviewThread,
  RenamedTitleEvent,
  CrossReferencedEvent: Reference,
  ReferencedEvent: Reference
};

export default function Timeline({ pr }) {
  const events = pr.events.map((event, key) => {
    const Component = components[event.type];

    if (Component) {
      return <Component event={ event } key={ key } />;
    }
    return <div key={ key }>{ event.type }</div>;
  });

  return (
    <div className='timeline'>
      { events }
    </div>
  );
};

Timeline.propTypes = {
  pr: PropTypes.object.isRequired
};
