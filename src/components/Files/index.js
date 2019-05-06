/* eslint-disable react/prop-types */
import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import diffParser from 'gitdiff-parser';

import roger from 'jolly-roger';
import Loading from '../Loading';
import { getHunkFiles } from '../utils/ReviewDiff';
import Review from '../Timeline/Review';
import File from './File';

const SHOW_COMMENTS = 'SHOW_COMMENTS';

const isFiltering = (filter, option) => filter.indexOf(option) >= 0;
const filterReducer = function (state, { option }) {
  if (isFiltering(state, option)) {
    return state.filter(f => f !== option);
  }
  return [ ...state, option ];
};
const expandedReducer = function (state, { path }) {
  if (path === null) return [];
  if (state.indexOf(path) >= 0) {
    return state.filter(p => p !== path);
  }
  return [ ...state, path ];
};
const FilterOption = function ({ filter, dispatch, label, option }) {
  return (
    <label>
      <input
        type='checkbox'
        checked={ isFiltering(filter, option) }
        onChange={ () => dispatch({ option }) } />
        <span>{ label }</span>
    </label>
  );
};

export default function Files({ pr, repo }) {
  const { getPRFiles } = roger.useContext();
  const [ diff, setDiff ] = useState(null);
  const [ error, setError ] = useState(false);
  const [ filter, dispatch ] = useReducer(filterReducer, [SHOW_COMMENTS]);
  const [ collapsed, collapse ] = useReducer(expandedReducer, []);

  useEffect(() => {
    setDiff(null);
    getPRFiles({repo, prNumber: pr.number})
      .then(setDiff)
      .then(() => {
        if (location.hash) {
          const elements = document.getElementsByName(location.hash.substring(1)); // Remove hash

          if (elements.length === 1) elements[0].parentElement.scrollIntoView();
        }
      })
      .catch(error => {
        console.log(error);
        setError(error);
      });
  }, [pr.id]);

  if (error) {
    return (
      <div className='tac'>
        Ops! There is an error fetching the PR's file changes.<br />Wait a bit and refresh the page.
      </div>
    );
  }

  if (diff === null) {
    return <Loading className='mt2' showLogo={ false } message='Loading file changes.'/>;
  }

  const parsedDiff = diffParser.parse(diff);
  const lastCommit = pr.events.filter(({ type }) => type === 'Commit').pop();
  const events = pr.events.filter(({ type, comments }) => (
      type === 'PullRequestReviewThread' &&
      comments.length > 0 &&
      comments[0].outdated === false
  ));
  const showComments = isFiltering(filter, SHOW_COMMENTS);
  const paths = [];

  const files = parsedDiff.map((diffItem, key) => {
    let path = getHunkFiles(diffItem.oldPath, diffItem.newPath);
    const isCollapsed = !(collapsed.indexOf(path) >= 0);

    paths.push(path);

    const FileComponentProps = {
      lastCommit,
      events,
      path,
      diffItem,
      onPathClick: () => collapse({ path }),
      showComments,
      progressPercent: Math.ceil(collapsed.length / parsedDiff.length * 100),
      isCollapsed,
      repo,
      pr
    };

    return <File { ...FileComponentProps } key={ key }/>;
  });

  return (
    <div className='files'>
      <section className='filter mb1 cf'>
        <FilterOption
          filter={ filter }
          dispatch={ dispatch }
          label='Show comments'
          option={ SHOW_COMMENTS }
          />
        <button className='right as-link fz8' onClick={ () => {
          if (collapsed.length > 0) {
            collapse({ path: null });
          } else {
            paths.forEach(p => collapse({ path: p }));
          }
         } } >
          { collapsed.length === 0 ? '↑ collapse all' : '↓ expand all' }
        </button>
      </section>
      { files }
      <div className='mt03'>
        <Review pr={ pr } repo={ repo } />
      </div>
    </div>
  );
};

Files.propTypes = {
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired,
  className: PropTypes.string
};
