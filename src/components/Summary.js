import React from 'react';
import marked from 'marked';
import diff2html from 'diff2html';

import { CORNER_DOWN_RIGHT, CHEVRON_RIGHT, CHECK_CIRCLE, STORM, MESSAGE } from './Icons';
import Date from './utils/Date';
import Diff from './utils/Diff';

function formatReviewDiff(comment) {
  const formatter = diff2html.Diff2Html;
  const html = formatter.getPrettyHtml(
    [
      `diff --git ${ comment.path } ${ comment.path }`,
      `${ comment.path }\n${ comment.diffHunk }`
    ].join('\n'),
    {
      inputFormat: 'diff',
      showFiles: false,
      matching: 'none',
      outputFormat: 'line-by-line'
    }
  );

  return html;
}

export default function Summary({ pr }) {
  return pr.events.map((event, key) => {
    switch (event.type) {

      case 'Commit':
        return (
          <div className='fz9 commit' key={ key }>
            <div className='media small'>
              <img src={ event.author.avatar } className='avatar'/>
              <Date event={ event }/>
            </div>
            <div className='pl05'>
              <CORNER_DOWN_RIGHT size={ 18 }/>
              { event.message }
              <CHEVRON_RIGHT size={ 18 }/>
              <small className='opa5'>
                <a href={ event.url } target='_blank'>{ event.oid.substr(0, 7) }</a>
              </small>
              <Diff data={ event } className='opa5'/>
            </div>
          </div>
        );

      case 'PullRequestReview':
        let StateIcon = MESSAGE;

        switch (event.state) { // APPROVED, CHANGES_REQUESTED, COMMENTED, DISMISSED, PENDING
          case 'APPROVED':
            StateIcon = CHECK_CIRCLE;
          break;
          case 'CHANGES_REQUESTED':
            StateIcon = STORM;
          break;
        }

        return (
          <div className={ `tac fz9 review ${ event.state }` } key={ key }>
            <StateIcon size={ 45 }/>
            <div className='review-content'>
              <div className='media small mb05' style={ { width: '170px', margin: '0 auto .5em auto' } }>
                <img src={ event.author.avatar } className='avatar'/>
                <Date event={ event } className='' />
              </div>
              { event.body !== '' &&
              <div className='markdown' dangerouslySetInnerHTML={ { __html: marked(event.body) } } /> }
            </div>
          </div>
        );

      case 'PullRequestReviewThread':
        return (
          <div key={ key } className='fz9 comment'>
            {
              event.comments.map((comment, i) => (
                <React.Fragment key={ i }>
                  { i === 0 &&
                    <div className='code-diff' dangerouslySetInnerHTML={ { __html: formatReviewDiff(comment) } } /> }
                  <div className='media small'>
                    <img src={ comment.author.avatar } className='avatar' />
                    <div>
                      <Date event={ comment }/>
                      <div className='markdown' dangerouslySetInnerHTML={ { __html: marked(comment.body) } } />
                    </div>
                  </div>
                </React.Fragment>
              ))
            }
          </div>
        );

    }
    return null;
  });
};
