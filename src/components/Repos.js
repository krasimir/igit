/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import riew from 'riew/react';
import { sput } from 'riew';

import Header from './Header';
import PRs from './PRs';
import PR from './PR';
import { CHEVRON_RIGHT, CHEVRON_DOWN, ARROW_RIGHT_CIRCLE } from './Icons';
import PRFake from './PRFake';
import PRNew from './PRNew';
import PREdit from './PREdit';
import Horn from './Horn';
import UpdateProgress from './UpdateProgress';
import flattenPRsEvents from './utils/flattenRPsEvens';

import fetchingPRs from './routines/fetchingPRs';
import setTitle from './routines/setTitle';
import { SUBSCRIBED_REPOS, REGISTER_PRS } from '../constants';

function Repos({
  match,
  profile,
  fetchingPRs,
  subscribedRepos,
  error,
  triggerUpdate,
  numberOfFetches
}) {
  const { owner, name, prNumber, op } = match.params;

  const repo = subscribedRepos.find(
    ({ owner: repoOwner, name: repoName }) =>
      owner === repoOwner && name === repoName
  );
  let pr;

  if (repo && repo.prs && repo.prs.length > 0) {
    pr = repo.prs.find(({ number }) => number.toString() === prNumber);
  }

  const reposList = subscribedRepos.map(repo => {
    const expanded = repo.owner === owner && repo.name === name;
    const linkUrl = expanded
      ? `/repo/${repo.owner}`
      : `/repo/${repo.owner}/${repo.name}`;
    const repoEvents = flattenPRsEvents(repo.prs);

    return (
      <div key={repo.repoId} className="relative">
        <Link to={linkUrl} className="list-link">
          {expanded ? <CHEVRON_DOWN size={18} /> : <CHEVRON_RIGHT size={18} />}
          {repo.nameWithOwner}
        </Link>
        {expanded && (
          <PRs
            {...match.params}
            prs={repo.prs}
            loading={fetchingPRs}
            triggerUpdate={triggerUpdate}
            numberOfFetches={numberOfFetches}
          />
        )}
        {!expanded && <Horn events={repoEvents} />}
      </div>
    );
  });

  let PRComponent;

  if (pr && op === 'edit') {
    PRComponent = <PREdit pr={pr} repo={repo} owner={owner} />;
  } else if (pr) {
    PRComponent = <PR pr={pr} url={match.url} repo={repo} />;
  } else if (prNumber === 'new') {
    PRComponent = <PRNew repo={repo} owner={owner} />;
  } else {
    PRComponent = <PRFake />;
  }

  return (
    <div>
      <UpdateProgress numberOfFetches={numberOfFetches} />
      <div className="layout">
        <aside>
          <Header profile={profile} />
          <Link to="/" className="list-link">
            <ARROW_RIGHT_CIRCLE size={18} />
            Dashboard
          </Link>
          <div className="pl05">
            {subscribedRepos.length === 0 && (
              <div className="ml1">
                You have no selected repositories. To select some click{' '}
                <Link to="/settings">here</Link>.
              </div>
            )}
            {reposList}
          </div>
          <Link to="/settings" className="list-link">
            <CHEVRON_RIGHT size={18} />
            Settings
          </Link>
        </aside>
        <section className="pt1">{PRComponent}</section>
      </div>
    </div>
  );
}

Repos.propTypes = {
  match: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  fetchingPRs: PropTypes.bool,
  error: PropTypes.object,
  subscribedRepos: PropTypes.array,
  triggerUpdate: PropTypes.func,
  numberOfFetches: PropTypes.number
};

export default riew(Repos, fetchingPRs, setTitle).with(
  'api',
  'profile',
  'notifications',
  {
    subscribedRepos: SUBSCRIBED_REPOS
  }
);
