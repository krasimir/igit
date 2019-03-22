import React, { useState } from 'react';
import diffParser from 'gitdiff-parser';
import PropTypes from 'prop-types';

const HUNK_LINE_HEIGHT = 30;

function ensureDiffHeaderExists(diff, path) {
  let diffStr = diff;

  if (path && !diff.match(/^diff --git/)) {
    diffStr = `diff --git a/${ path } b/${ path }
index xxxxxxx..xxxxxxx xxxxxx
--- a/${ path }
+++ b/${ path }
${ diff }
`;
  }

  return diffStr;
}
export function getHunkFiles(a, b) {
  if (a === b) {
    return a;
  } else if (a === '/dev/null') {
    return b;
  } else if (b === '/dev/null') {
    return a;
  }
  return a + ' → ' + b;
}
export function getDiffItemType(type) {
  switch (type) {
    case 'add': return 'A';
    case 'delete': return 'D';
    case 'rename': return 'R';
    case 'copy': return 'C';
    case 'modify': return 'M';
  }
  return '';
}

export default function ReviewDiff({ data, className, shrinkBottom, repoURL }) {
  const { diffHunk, path, commit } = data;
  const [ isShrinkingEnabled, useShrinking ] = useState(true);

  try {
    const parsedDiff = diffParser.parse(ensureDiffHeaderExists(diffHunk, path));

    return parsedDiff.map((diffItem, key) => {
      let totalLinesOfCode = diffItem.hunks.reduce((total, hunk) => {
        total += hunk.changes.length;
        return total;
      }, 0);
      const shrinking = shrinkBottom && totalLinesOfCode > shrinkBottom;
      let filenames = getHunkFiles(diffItem.oldPath, diffItem.newPath);

      if (shrinking && isShrinkingEnabled) {
        totalLinesOfCode = shrinkBottom;
      }
      if (commit && path) {
        filenames = <a href={ `${ repoURL }/blob/${ commit.oid }/${ path }` } target='_blank'>{ filenames }</a>;
      }

      return (
        <div className={ `hunk ${ className }` } key={ key }>
          <div className='header'>
            <span className='tag'>{ getDiffItemType(diffItem.type) }</span>&nbsp;
            <span className='filenames'>{ filenames }</span>
          </div>
          <div className='lines' style={ { height: `${ HUNK_LINE_HEIGHT * totalLinesOfCode }px` } }>
            <div className='lines-wrapper'>
              {
                diffItem.hunks.map((hunk, i) => {
                  return hunk.changes.map((change, j) => {
                    return (
                      <div key={ `${ i }_${ j }` } className={ `hunk-chunk ${ change.type }` }>
                        <small className='opa5'>{ change.newLineNumber || change.lineNumber }</small>
                        <pre>{ change.content }</pre>
                      </div>
                    );
                  });
                })
              }
            </div>
            { shrinking && isShrinkingEnabled ? <div className='expand-all-lines'>
              <button onClick={ () => useShrinking(false) }>↑</button>
            </div> : null }
          </div>
        </div>
      );
    });
  } catch (error) {
    console.error(`Can not parse: \n\n${ diffHunk }`);
    return <pre><code>{ diffHunk }</code></pre>;
  }
}

ReviewDiff.propTypes = {
  data: PropTypes.object.isRequired,
  repoURL: PropTypes.string.isRequired,
  shrinkBottom: PropTypes.number,
  className: PropTypes.string
};
