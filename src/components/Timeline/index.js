/* eslint-disable react/prop-types */
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import Commit from './Commit';
import PullRequestReview from './PullRequestReview';
import Comment from './Comment';
import MergedEvent from './MergedEvent';
import PullRequestReviewThread from './PullRequestReviewThread';
import RenamedTitleEvent from './RenamedTitleEvent';
import Reference from './Reference';
import Review from './Review';
import flattenUsers from '../../api/utils/flattenUsers';

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

const filterByUserReducer = function (state, { user }) {
  if (state.find(u => u === user)) {
    return state.filter(u => u !== user);
  }
  return [ ...state, user ];
};

export default function Timeline({ pr, repo }) {
  const users = flattenUsers(pr).map(({ login }) => login);
  const [ filterByAuthor, setFilterByAuthor ] = useReducer(filterByUserReducer, users);
  const events = pr.events
    .filter(event => {
      if (filterByAuthor.length > 0) {
        if (event.author) {
          return filterByAuthor.find(u => u === event.author.login);
        } else if (event.type === 'PullRequestReviewThread') {
          return event.comments.find(comment => filterByAuthor.find(u => u === comment.author.login));
        }
        return false;
      }
      return true;
    })
    .map((event, key) => {
      const Component = components[event.type];

      if (event.type === 'PullRequestReview' && event.state === 'PENDING') {
        return null;
      }

      if (Component) {
        return <Component event={ event } key={ event.id + '_' + key } pr={ pr } repo={ repo }/>;
      }
      return <div key={ key }>{ event.type }</div>;
    });

  return (
    <div className='timeline'>
      <section className='filter mb1'>
        {
          users.map(user => (
            <label key={ user }>
              <input
                type='checkbox'
                checked={ !!filterByAuthor.find(u => u === user) }
                onChange={ () => setFilterByAuthor({ user }) }/>
              { user }
            </label>
          ))
        }
      </section>
      { events }
      <div className='mt2'>
        <Review pr={ pr } repo={ repo }/>
      </div>
    </div>
  );
};

Timeline.propTypes = {
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired
};
