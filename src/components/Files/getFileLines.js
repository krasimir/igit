import React from 'react';

import PullRequestReviewThread from '../Timeline/PullRequestReviewThread';
import Postman from '../Postman';
import { createLine, createTable } from './Lines';

export default function getFileItemLines(
  diffItem,
  path,
  toComment,
  threads,
  showComments,
  pr,
  repo,
  openComment,
  postman
) {
  let items = [];
  let table = createTable();
  let totalDiffLines = -1;

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

      table.rows.push(createLine(
        path,
        line,
        change.content,
        change.type,
        j
      ));

      // listing comments
      if (lineThreads && lineThreads.length > 0 && showComments) {
        items.push(table);
        table = createTable();
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
      // create a comment
      if (toCommentUI) {
        items.push(table);
        table = createTable();
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

  return items;
}
