/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import { Link, Switch, Route } from 'react-router-dom';

import roger from '../jolly-roger';

import Loading from './Loading';
import Timeline from './Timeline';
import Diff from './utils/Diff';
import { formatDate } from '../utils';

const formatBranchLabels = (base, head) => {
  if (base.owner === head.owner) {
    return [ base.ref, head.ref ];
  }
  return [ base.owner + ':' + base.ref, head.owner + ':' + head.ref ];
};
const formatPRStatus = (pr) => {
  if (pr.merged) {
    return <span className='pr-status pr-status-merged'>merged / { formatDate(pr.mergedAt) }</span>;
  } else if (pr.closed) {
    return <span className='pr-status pr-status-closed'>closed / { formatDate(pr.closedAt) }</span>;
  }
  return <span className='pr-status'>open / { formatDate(pr.createdAt) }</span>;
};

export default function PR({ repo, prNumber, url }) {
  const { getPR } = roger.useContext();
  const [ pr, setPR ] = useState(null);
  const [ error, setError ] = useState(false);

  useEffect(() => {
    setPR(null);
    getPR({ repo, prNumber }).then(setPR, error => {
      console.log(error);
      setError(error);
    });
  }, [prNumber]);

  if (error) {
    return (
      <div className='pr-details'>
        <div className='pr-card tac'>
          Ops! There is an error fetching the pull request.<br />Wait a bit and refresh the page.
        </div>
      </div>
    );
  }

  if (pr === null) {
    return (
      <div className='pr-details'>
        <div className='pr-card'>
          <Loading showLogo={ false } message='Loading the pull request details.'/>
        </div>
      </div>
    );
  }

  // console.log(JSON.stringify(pr, null, 2));
  console.log(pr);

  const [ base, head ] = formatBranchLabels(pr.base, pr.head);

  return (
    <div className='pr-details'>
      <div className='pr-card'>
        <div className='media'>
          <a href={ pr.author.url } target='_blank' className='no-hover'>
            <img src={ pr.author.avatar } className='avatar' title={ pr.author.login }/>
          </a>
          <div>
            <h2>
              { pr.title }&nbsp;
              <a href={ pr.url } target='_blank'><span>(#{ pr.number })</span></a>&nbsp;
              <small>{ formatPRStatus(pr) }</small>
            </h2>
            <small className='block mt1'>
              <span className='branch'>{ base }</span> ← <span className='branch'>{ head } <Diff data={ { additions: pr.additions, deletions: pr.deletions } } /></span>
            </small>
          </div>
        </div>
        <hr />
        <div className='markdown mt1' dangerouslySetInnerHTML={ { __html: marked(pr.body) } } />
      </div>
      <Switch>
        <Route path={ url + '/files' } render={ () => (
          <React.Fragment>
            <nav>
              <Link to={ url }>Timeline</Link>
              <Link to={ url + '/files' } className='selected'>Files</Link>
            </nav>
          </React.Fragment>
        ) }/>
        <Route path={ url + '/' } render={ () => (
          <React.Fragment>
            <nav>
              <Link to={ url } className='selected'>Timeline</Link>
              <Link to={ url + '/files' }>Files</Link>
            </nav>
            <Timeline pr={ pr } />
          </React.Fragment>
        ) }/>
      </Switch>
    </div>
  );
};

PR.propTypes = {
  prNumber: PropTypes.string.isRequired,
  repo: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired
};
