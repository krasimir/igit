/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import marked from './utils/marked';
import { Link, Switch, Route } from 'react-router-dom';

import Loading from './Loading';
import Timeline from './Timeline';
import Files from './Files';
import Diff from './utils/Diff';
import { formatDate } from '../utils';
import Horn from './Horn';
import flattenPREvents from '../api/utils/flattenPREvents';
import PROps from './PROps';
import { EDIT } from './Icons';

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
const normalizeURL = url => {
  return url.replace(/\/files$/, '');
};

export default function PR({ url, pr, repo }) {
  if (!pr) {
    return (
      <div className='pr-details'>
        <div className='pr-card'>
          <Loading showLogo={ false } message='Loading...'/>
        </div>
      </div>
    );
  }

  const [ base, head ] = formatBranchLabels(pr.base, pr.head);

  url = normalizeURL(url);

  return (
    <div className='pr-details'>
      <div className='pr-card cf'>
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
        <div className='markdown mt1' dangerouslySetInnerHTML={ { __html: marked(pr.body, repo) } } />
        { (!pr.merged && !pr.closed) && <PROps pr={ pr } repo={ repo }/> }
      </div>
      <Switch>
        <Route path={ url + '/files' } render={ () => (
          <React.Fragment>
            <nav>
              <Link to={ url }>Timeline</Link>
              <Link to={ url + '/files' } className='selected'>Files</Link>
            </nav>
            <Files pr={ pr } repo={ repo }/>
          </React.Fragment>
        ) }/>
        <Route path={ url + '/' } render={ () => (
          <React.Fragment>
            <nav>
              <Link to={ url } className='selected'>Timeline</Link>
              <Link to={ url + '/files' }>Files</Link>
            </nav>
            <Timeline pr={ pr } repo={ repo }/>
          </React.Fragment>
        ) }/>
      </Switch>
      <Link
        className='as-link pr-edit dimmed no-hover'
        to={ `/repo/${ repo.nameWithOwner }/${ pr.number }/edit` }>
        <EDIT size={ 18 }/>
      </Link>
      <Horn events={ flattenPREvents(pr) } />
    </div>
  );
};

PR.propTypes = {
  url: PropTypes.string,
  pr: PropTypes.object,
  repo: PropTypes.object
};
