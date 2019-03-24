/* eslint-disable react/prop-types */
import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import diffParser from 'gitdiff-parser';

import roger from '../../jolly-roger';
import Loading from '../Loading';
import { getHunkFiles, getDiffItemType } from '../utils/ReviewDiff';
import PullRequestReviewThread from '../Timeline/PullRequestReviewThread';

const SHOW_COMMENTS = 'SHOW_COMMENTS';

const isFiltering = (filter, option) => filter.indexOf(option) >= 0;
const filterReducer = function (state, { option }) {
  if (isFiltering(state, option)) {
    return state.filter(f => f !== option);
  }
  return [ ...state, option ];
};
const expandedReducer = function (state, { path }) {
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
        onChange={ () => dispatch({ option }) } />{ label }
    </label>
  );
};

export default function Files({ pr, repo, className }) {
  const { getPRFiles } = roger.useContext();
  const [ diff, setDiff ] = useState(null);
  const [ error, setError ] = useState(false);
  const [ filter, dispatch ] = useReducer(filterReducer, [SHOW_COMMENTS]);
  const [ expanded, expand ] = useReducer(expandedReducer, []);

  useEffect(() => {
    setDiff(null);
    getPRFiles({ repo, prNumber: pr.number }).then(setDiff, error => {
      console.log(error);
      setError(error);
    });
  }, [ pr ]);

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

  const files = parsedDiff.map((diffItem, key) => {
    let path = getHunkFiles(diffItem.oldPath, diffItem.newPath);
    let viewFileUrl, totalDiffLines = -1;
    const isExpanded = expanded.indexOf(path) >= 0;
    const threads = events.filter(event => {
      if (event.comments[0].path === diffItem.newPath) {
        return true;
      }
      return false;
    });

    if (lastCommit) {
      viewFileUrl = `${ repo.url }/blob/${ lastCommit.oid }/${ diffItem.newPath }`;
    }

    return (
      <div className={ `hunk hunk-files ${ className ? className : '' }` } key={ key }>
        <div className='header'>
          <span className='tag'>{ getDiffItemType(diffItem.type) }</span>
          <button onClick={ () => expand({ path }) }>{ path }</button>
          { (threads.length > 0 && isFiltering(filter, SHOW_COMMENTS)) && <span>({ threads.length })</span>}
          { viewFileUrl && <a href={ viewFileUrl } target='_blank' className='right'>↗</a> }
        </div>
        { isExpanded && <div className='lines mt05'>
          <div className='lines-wrapper'>
            {
              diffItem.hunks.map((hunk, i) => {
                return hunk.changes.map((change, j) => {
                  let lineThread;

                  totalDiffLines += 1;
                  if (threads.length > 0) {
                    console.log(threads, threads[0].comments[0].position, totalDiffLines + i);
                    lineThread = threads.find(({ comments }) => comments[0].position - 1 === totalDiffLines + i);
                  }

                  return (
                    <React.Fragment key={ `${ i }_${ j }` }>
                      <div className={ `hunk-chunk ${ j === 0 ? 'hunk-chunk-start' : ''} ${ change.type}` }>
                        <small className='opa5'>{ change.newLineNumber || change.lineNumber }</small>
                        <pre>{ change.content }</pre>
                      </div>
                      { (lineThread && isFiltering(filter, SHOW_COMMENTS)) &&
                        <PullRequestReviewThread event={ lineThread } pr={ pr } repo={ repo } context='files' />}
                    </React.Fragment>
                  );
                });
              })
            }
          </div>
        </div> }
      </div>
    );
  });

  return (
    <div className='files'>
      <section className='filter mb1'>
        <FilterOption
          filter={ filter }
          dispatch={ dispatch }
          label='Show comments'
          option={ SHOW_COMMENTS }
          />
      </section>
      { files }
    </div>
  );
};

Files.propTypes = {
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired,
  className: PropTypes.string
};
