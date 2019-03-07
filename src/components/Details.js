import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import diff2html from 'diff2html';

import roger from '../jolly-roger';

import Loading from './Loading';
import { CORNER_DOWN_RIGHT } from './Icons';
import { formatDate } from '../utils';

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

export default function PR({ pr: rawPR }) {
  const { getPR } = roger.useContext();
  const [ pr, setPR ] = useState(null);
  const [ error, setError ] = useState(false);
  const [ tab, setTab ] = useState('timeline');

  useEffect(() => {
    getPR(rawPR).then(setPR, error => {
      console.log(error);
      setError(error);
    });
  }, []);

  if (error) {
    return (
      <div className='pr-details'>
        <p>Ops! There is an error fetching the pull request. Wait a bit and refresh the page.</p>
      </div>
    );
  }

  if (pr === null) {
    return (
      <div className='pr-details'>
        <Loading showLogo={ false } message={ `Loading pull request "${ rawPR.title }".` }/>
      </div>
    );
  }

  const timeline = pr.commits.concat(
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

  let content;

  if (tab === 'timeline') {
    content = timeline.map(entry => {
      if (entry.commit) {
        return (
          <div key={ entry.sha } className='fz9 commit'>
            <div className='author'>
              <img src={ entry.author.avatar_url } className='avatar'/>
              <div>
              <small className='opa5'>
                { formatDate(entry.date) }
              </small>
              </div>
            </div>
            <div className='commit-message'>
              <CORNER_DOWN_RIGHT size={ 18 }/>
              { entry.commit.message }&nbsp;
              <small className='opa5'>
                <a href={ entry.html_url } target='_blank'>{ entry.sha.substr(0, 7) }</a>
              </small>
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
            <div dangerouslySetInnerHTML={ { __html: marked(entry.body) } } />
          </div>
        </div>
      );
    });
  }
  console.log(pr);
  return (
    <div className='pr-details'>
      <nav className={ tab }>
        <a href='javascript:void(0);' onClick={ () => setTab('timeline') }>Timeline</a>
        <a href='javascript:void(0);' onClick={ () => setTab('commits') }>Commits ({ pr.commits.length})</a>
        <a href='javascript:void(0);' onClick={ () => setTab('reviews') }>Reviews ({ pr.reviews.length})</a>
      </nav>
      { content }
    </div>
  );
};

PR.propTypes = {
  pr: PropTypes.object.isRequired
};
