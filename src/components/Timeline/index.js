/* eslint-disable react/prop-types */
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import ls from '../../api/localStorage';
import Commit from './Commit';
import PullRequestReview from './PullRequestReview';
import Comment from './Comment';
import MergedEvent from './MergedEvent';
import PullRequestReviewThread from './PullRequestReviewThread';
import RenamedTitleEvent from './RenamedTitleEvent';
import Reference from './Reference';
import Postman from '../Postman';

const COMMITS_TYPES = ['Commit', 'MergedEvent'];
const COMMENTS_TYPES = ['PullRequestReviewComment', 'IssueComment', 'PullRequestReviewThread'];
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
const TIMELINE_FILTER = 'TIMELINE_FILTER';

const isFiltering = (filter, compareTo) => !!filter.find(f => compareTo.indexOf(f) >= 0);
const filterReducer = function (state, { arr }) {
  let newState;

  if (isFiltering(state, arr)) {
    newState = state.filter(f => arr.indexOf(f) < 0);
  } else {
    newState = state.concat(arr);
  }

  ls.set(TIMELINE_FILTER, newState);
  return newState;
};
const FilterOption = function ({ filter, dispatch, label, arr }) {
  return (
    <label>
      <input
        type='checkbox'
        checked={ isFiltering(filter, arr) }
        onChange={ () => dispatch({ arr }) } />{ label }
    </label>
  );
};

export default function Timeline({ pr, repo }) {
  const [ filter, dispatch ] = useReducer(
    filterReducer,
    ls.get(TIMELINE_FILTER, [])
  );
  const events = pr.events
    .filter(event => {
      if (filter.length === 0) return true;
      return filter.indexOf(event.type) >= 0;
    })
    .map((event, key) => {
      const Component = components[event.type];

      if (Component) {
        return <Component event={ event } key={ key } pr={ pr } repo={ repo }/>;
      }
      return <div key={ key }>{ event.type }</div>;
    });

  return (
    <div className='timeline'>
      <section className='filter mb1'>
        <FilterOption
          filter={ filter }
          dispatch={ dispatch }
          label='Only commits'
          arr={ COMMITS_TYPES }
          />
        <FilterOption
          filter={ filter }
          dispatch={ dispatch }
          label='Only comments'
          arr={ COMMENTS_TYPES }
          />
      </section>
      { events }
      <Postman repo={ repo } pr={ pr } context='IssueComment' />
    </div>
  );
};

Timeline.propTypes = {
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired
};
