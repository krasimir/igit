import React from 'react';
import marked from 'marked';
import diff2html from 'diff2html';

import { CORNER_DOWN_RIGHT, CHEVRON_RIGHT, CHECK_CIRCLE, STORM, MESSAGE } from './Icons';
import Date from './utils/Date';
import { formatDate, sortByDate } from '../utils';

function setDateToATimelineEntry(entry) {
  if (entry.commit) {
    entry.date = entry.commit.committer.date;
  } else {
    entry.date = entry.created_at || entry.submitted_at;
  }
  return entry;
}

function getTimeline(pr) {
  let arr = [];

  arr = arr.concat(pr.githorn_commits);

  arr = arr.concat(
    pr.githorn_reviews_comments.filter(review => {
      return !review.in_reply_to_id;
    })
  );

  arr = arr.concat(
    pr.githorn_reviews.filter(review => {
      return review.state !== 'COMMENTED';
    })
  );

  return arr.map(setDateToATimelineEntry).sort(sortByDate);
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
      matching: 'none',
      outputFormat: 'line-by-line'
    }
  );

  return html;
}

function getReplies(pr, id) {
  return pr.githorn_reviews_comments
    .filter(review => review.in_reply_to_id === id)
    .map(setDateToATimelineEntry)
    .map(review => (
      <div className='media reply' key={ review.id }>
        <img src={ review.user.avatar_url } className='avatar' />
        <div>
          <Date entry={ review }/>
          <div className='markdown' dangerouslySetInnerHTML={ { __html: marked(review.body) } } />
        </div>
      </div>
    ));
}

export default function Timeline({ pr }) {
  const timeline = getTimeline(pr);

  return timeline.map(entry => {
    // commit
    if (entry.commit) {
      return (
        <div key={ entry.sha } className='fz9 commit'>
          <div className='media small'>
            <img src={ entry.author.avatar_url } className='avatar'/>
            <Date entry={ entry }/>
          </div>
          <div className='pl05'>
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

    // review
    if (entry.state) {
      let StateIcon = MESSAGE;
      let reviewMessage = '';

      switch (entry.state) {
        case 'APPROVED':
          StateIcon = CHECK_CIRCLE;
          reviewMessage = 'approved';
        break;
        case 'CHANGES_REQUESTED':
          StateIcon = STORM;
          reviewMessage = 'requested changes';
        break;
      }

      return (
        <div key={ entry.id } className={ `fz9 review ${ entry.state }` }>
          <div className='tac'>
            <img src={ entry.user.avatar_url } className='avatar' />
            <StateIcon size={ 48 }/><br />
            <small className='opa5'>
              <a href={ entry.user.html_url } target='_blank'>@{ entry.user.login }</a>&nbsp;
              { reviewMessage } on&nbsp;
            </small>
            <Date entry={ entry }/>
          </div>
          { entry.body !== '' &&
            <div className='markdown' dangerouslySetInnerHTML={ { __html: marked(entry.body) } } /> }
        </div>
      );
    }

    // comment
    return (
      <div key={ entry.id } className='fz9 comment'>
        <div className='diff' dangerouslySetInnerHTML={ { __html: formatReviewDiff(entry) } } />
        <div className='media'>
          <img src={ entry.user.avatar_url } className='avatar' />
          <div>
            <Date entry={ entry }/>
            <div className='markdown' dangerouslySetInnerHTML={ { __html: marked(entry.body) } } />
          </div>
        </div>
        { getReplies(pr, entry.id) }
      </div>
    );
  });
};
