import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import roger from '../jolly-roger';

import Loading from './Loading';

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

  console.log(pr);
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
  }).sort((a, b) => {
    console.log(a.date, b.date);
    return new Date(a.date) - new Date(b.date);
  });

  let content;

  console.log(timeline);

  if (tab === 'timeline') {
    content = timeline.map(entry => {
      if (entry.commit) {
        return (
          <div key={ entry.sha }>
            { entry.commit.message }
          </div>
        );
      }
      return (
        <div key={ entry.id }>
          { entry.body }
        </div>
      );
    });
  }

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
