/* eslint-disable react/prop-types */
import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import diffParser from 'gitdiff-parser';

import roger from 'jolly-roger';
import Loading from '../Loading';
import { getHunkFiles, getDiffItemType } from '../utils/ReviewDiff';
import PullRequestReviewThread from '../Timeline/PullRequestReviewThread';
import Postman from '../Postman';
import Review from '../Timeline/Review';

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
const toCommentReducer = function (state, { path, line, diffLine }) {
  if (state.find(({ path: p, line: l, diffLine: dl }) => (path === p && line === l && dl === diffLine))) {
    return state.filter(({ path: p, line: l, diffLine: dl }) => (p !== path && l !== line && dl !== diffLine));
  }
  return [ ...state, { path, line, diffLine } ];
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

export default function Files({ pr, repo, className }) {
  const { getPRFiles, postman } = roger.useContext();
  const [ diff, setDiff ] = useState(null);
  const [ error, setError ] = useState(false);
  const [ filter, dispatch ] = useReducer(filterReducer, [SHOW_COMMENTS]);
  const [ collapsed, collapse ] = useReducer(expandedReducer, []);
  const [ toComment, openComment ] = useReducer(toCommentReducer, []);

    useEffect(() => {
        setDiff(null);
        getPRFiles({repo, prNumber: pr.number})
            .then(setDiff)
            .then(() => {
                const elements = document.getElementsByName(location.hash.substring(1)); // Remove hash

                if (elements.length === 1) elements[0].parentElement.scrollIntoView();
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
  const paths = [];

  const files = parsedDiff.map((diffItem, key) => {
    let path = getHunkFiles(diffItem.oldPath, diffItem.newPath);
    let viewFileUrl, totalDiffLines = -1;
    const isCollapsed = !(collapsed.indexOf(path) >= 0);
    const threads = events.filter(event => {
      if (event.comments[0].path === diffItem.newPath || event.comments[0].path === diffItem.oldPath) {
        return true;
      }
      return false;
    });

    paths.push(path);

    if (lastCommit) {
      viewFileUrl = `${ repo.url }/blob/${ lastCommit.oid }/${ diffItem.newPath }`;
    }

    const items = [];
    let table = { rows: [], __table: true };

    diffItem.hunks.forEach((hunk, i) => {
      hunk.changes.forEach((change, j) => {
        let lineThreads;
        const line = change.newLineNumber || change.lineNumber;
        const toCommentUI = toComment.find(
          ({ path: p, line: l, diffLine: dl }) => (path === p && line === l && dl === j)
        );

        totalDiffLines += 1;
        if (threads.length > 0) {
          lineThreads = threads.filter(
            ({ comments }) => {
              return comments[0].position - 1 === totalDiffLines + i;
            }
          );
        }

        table.rows.push({
          type: change.type,
          path,
          line,
          diffLine: j,
          content: change.content
        });

        if ((lineThreads && lineThreads.length > 0 && isFiltering(filter, SHOW_COMMENTS))) {
          items.push(table);
          table = { rows: [], __table: true };
          items.push(
            lineThreads.map(
              (lt, key) =>
                <PullRequestReviewThread
                  key={ key }
                  expanded
                  event={ lt }
                  pr={ pr }
                  repo={ repo }
                  context='files' />
            )
          );
        }
        if (toCommentUI) {
          items.push(table);
          table = { rows: [], __table: true };
          items.push(
            <div className='px1 bt1 bb1' key={ path + '_' + line }>
              <Postman
                className='py05'
                onSave={ () => openComment({ path, line, diffLine: j }) }
                handler={
                  postman({ repo, pr }).newPullRequestReviewThread({
                    path,
                    position: totalDiffLines + 1 + i
                  })
                }
                focus />
            </div>
          );
        }
      });
    });

    if (table.rows.length > 0) {
      items.push(table);
    }

    return (
      <div className={ `hunk ${ className ? className : '' }` } key={ key }>
        <a name={ path } />
        <div className='header relative'>
          <span className='tag'>{ getDiffItemType(diffItem.type) }</span>
          <button onClick={ () => collapse({ path }) }>{ path }</button>
          { (threads.length > 0 && isFiltering(filter, SHOW_COMMENTS)) && <span>({ threads.length })</span>}
          { viewFileUrl && <a href={ viewFileUrl } target='_blank' className='right'>↗</a> }
          { <ReviewProgress percents={ Math.ceil(collapsed.length / parsedDiff.length * 100) } /> }
        </div>
        { isCollapsed && items.map((item, i) => {
            if (item.__table) {
              return (
                <div className='lines' key={ i }>
                  <table className='lines-wrapper'>
                    <tbody>
                      {
                        item.rows.map((row, j) => (
                          <tr className={
                            `code-line ${ row.diffLine === 0 ? 'code-line-start' : ''} ${ row.type }`
                          } key={ j }>
                          <td>
                            <button className='as-link'
                              onClick={ () =>
                                openComment({ path: row.path, line: row.line, diffLine: row.diffLine })
                              }>
                              <small className='opa5'>{ row.line }</small>
                            </button>
                          </td>
                          <td><pre>{ row.content }</pre></td>
                        </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              );
            }
            return item;
          })
        }
      </div>
    );
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

function ReviewProgress({ percents }) {
  return <div className='files-review'>{ percents }%</div>;
}
