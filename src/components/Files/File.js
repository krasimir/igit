/* eslint-disable react/prop-types */
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import roger from 'jolly-roger';

import { getDiffItemType } from '../utils/ReviewDiff';
import getFileLines from './getFileLines';

const toCommentReducer = function (state, { path, line, diffLine }) {
  if (state.find(({ path: p, line: l, diffLine: dl }) => (path === p && line === l && dl === diffLine))) {
    return state.filter(({ path: p, line: l, diffLine: dl }) => (p !== path && l !== line && dl !== diffLine));
  }
  return [ ...state, { path, line, diffLine } ];
};

export default function File({
  lastCommit,
  events,
  path,
  diffItem,
  onPathClick,
  showComments,
  progressPercent,
  isCollapsed,
  repo,
  pr
}) {
  const [ toComment, openComment ] = useReducer(toCommentReducer, []);
  const { postman } = roger.useContext();

  let viewFileUrl, totalDiffLines = -1;
  const threads = events.filter(event => {
    if (event.comments[0].path === diffItem.newPath || event.comments[0].path === diffItem.oldPath) {
      return true;
    }
    return false;
  });
  const { items, totalDiffLines: updatedTotalDiffLines } = getFileLines(
    diffItem,
    path,
    toComment,
    threads,
    showComments,
    pr,
    repo,
    openComment,
    postman,
    totalDiffLines
  );

  totalDiffLines = updatedTotalDiffLines;

  if (lastCommit) {
    viewFileUrl = `${ repo.url }/blob/${ lastCommit.oid }/${ diffItem.newPath }`;
  }

  return (
    <div className='hunk'>
      <a name={ path } />
      <div className='header relative'>
        <span className='tag'>{ getDiffItemType(diffItem.type) }</span>
        <button onClick={ onPathClick }>{ path }</button>
        { (showComments && threads.length > 0) && <span>({ threads.length })</span>}
        { viewFileUrl && <a href={ viewFileUrl } target='_blank' className='right' title="view file">↗</a> }
        { <ReviewProgress percents={ progressPercent } /> }
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
}

File.propTypes = {
  lastCommit: PropTypes.object,
  events: PropTypes.array,
  path: PropTypes.string,
  diffItem: PropTypes.object,
  onPathClick: PropTypes.func,
  numOfComments: PropTypes.number,
  viewFileUrl: PropTypes.string,
  progressPercent: PropTypes.number,
  isCollapsed: PropTypes.bool,
  items: PropTypes.array,
  openComment: PropTypes.func
};

function ReviewProgress({ percents }) {
  return <div className='files-review'>{ percents }%</div>;
}
