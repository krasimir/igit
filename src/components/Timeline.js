import React from 'react';
import marked from 'marked';
import diff2html from 'diff2html';

import { CORNER_DOWN_RIGHT, CHEVRON_RIGHT } from './Icons';
import { formatDate } from '../utils';

function getTimeline(pr) {
  return pr.commits.concat(
    pr.reviews.filter(review => {
      return !review.in_reply_to_id;
    })
  ).map(entry => {
    if (entry.commit) {
      entry.date = entry.commit.committer.date;
    } else {
      entry.date = entry.created_at;
    }
    return entry;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
};

function formatReviewDiff(review) {
  const formatter = diff2html.Diff2Html;
  const html = formatter.getPrettyHtml(
    [
      `diff --git ${ review.path } ${ review.path }`,
      `${ review.path }\n${ review.diff_hunk }`
    ].join('\n'),
    {
      inputFormat: 'diff',
      showFiles: false,
      matching: 'lines',
      outputFormat: 'line-by-line'
    }
  );

  return html;
}

export default function Timeline({ pr }) {
  const timeline = getTimeline(pr);

  return timeline.map(entry => {
    if (entry.commit) {
      return (
        <div key={ entry.sha } className='fz9 commit'>
          <div className='media small'>
            <img src={ entry.author.avatar_url } className='avatar'/>
            <div>
            <small className='opa5'>
              { formatDate(entry.date) }
            </small>
            </div>
          </div>
          <div className='commit-message'>
            <CORNER_DOWN_RIGHT size={ 18 }/>
            <small className='opa5'>
              <a href={ entry.html_url } target='_blank'>{ entry.sha.substr(0, 7) }</a>
            </small>
            <CHEVRON_RIGHT size={ 18 }/>
            { entry.commit.message }
          </div>
        </div>
      );
    }
    return (
      <div key={ entry.id } className='fz9 comment'>
        <div>&nbsp;</div>
        <img src={ entry.user.avatar_url } className='avatar' />
        <div>
          <small className='opa5'>
            { formatDate(entry.date) }
          </small>
          <div className='diff' dangerouslySetInnerHTML={ { __html: formatReviewDiff(entry) } } />
          <div className='markdown' dangerouslySetInnerHTML={ { __html: marked(entry.body) } } />
        </div>
      </div>
    );
  });
};
