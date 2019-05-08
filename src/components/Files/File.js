/* eslint-disable react/prop-types */
import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import roger from 'jolly-roger';

import { getDiffItemType } from '../utils/ReviewDiff';
import getFileLines from './getFileLines';
import fillMissingLines from './fillMissingLines';
import { ARROW_UP_RIGHT, MAXIMIZE, MORE_HORIZONTAL, FILM } from '../Icons';

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
  const [ fullFileContent, setFullFileContent ] = useState({ state: 'idle', value: null });
  const [ toComment, openComment ] = useReducer(toCommentReducer, []);
  const { postman, getPRFile, getFileHistory } = roger.useContext();

  let viewFileUrl;
  const threads = events.filter(event => {
    if (event.comments[0].path === diffItem.newPath || event.comments[0].path === diffItem.oldPath) {
      return true;
    }
    return false;
  });
  const items = getFileLines(
    diffItem,
    path,
    toComment,
    threads,
    showComments,
    pr,
    repo,
    openComment,
    postman
  );

  if (fullFileContent.state === 'loaded') {
    fillMissingLines(items, fullFileContent.value, path);
  }

  if (lastCommit) {
    viewFileUrl = `${ repo.url }/blob/${ lastCommit.oid }/${ diffItem.newPath }`;
  }

  async function getFullFile() {
    if (fullFileContent.state === 'idle') {
      setFullFileContent({ state: 'loading', value: null });

      const file = await getPRFile({ repo, path, commit: lastCommit.oid });
      const lines = file.split('\n');

      setFullFileContent({ state: 'loaded', value: lines });
    }
  }

  async function getHistory() {
    const history = await getFileHistory({ repo, pr, path });
  }

  return (
    <div className='hunk'>
      <a name={ path } />
      <div className='header relative'>
        <span className='tag'>{ getDiffItemType(diffItem.type) }</span>
        <button onClick={ onPathClick }>{ path }</button>
        { (showComments && threads.length > 0) && <span>({ threads.length })</span>}
        { viewFileUrl && (
          <a href={ viewFileUrl } target='_blank' className='right' title="view file">
            <ARROW_UP_RIGHT size={ 16 } />
          </a>
        ) }
        <button onClick={ getFullFile } className='right'>
          {
            fullFileContent.state === 'idle' ? <MAXIMIZE size={ 16 } /> :
              fullFileContent.state === 'loading' ? <MORE_HORIZONTAL size={ 16 } /> : null
          }
        </button>
        <button onClick={ getHistory } className='right'>
          <FILM size={ 16 }/>
        </button>
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
