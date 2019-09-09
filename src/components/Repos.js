/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import riew from 'riew/react';
import roger from 'jolly-roger';

import Header from './Header';
import PRs from './PRs';
import PR from './PR';
import { CHEVRON_RIGHT, CHEVRON_DOWN, ARROW_RIGHT_CIRCLE } from './Icons';
import PRFake from './PRFake';
import PRNew from './PRNew';
import PREdit from './PREdit';
import Horn from './Horn';
import flattenPREvents from '../api/utils/flattenPREvents';
import { PULLING } from '../constants';
import { getPullingInterval } from './Settings/PullingInterval';
import isItANewEvent from './utils/isItANewEvent';
import UpdateProgress from './UpdateProgress';
import fetchingPRs from './effects/fetchingPRs';

const flattenPRsEvents = allPRs => {
  if (allPRs && allPRs.length > 0) {
    return allPRs.reduce((events, pr) => {
      return events.concat(flattenPREvents(pr));
    }, []);
  }
  return [];
};

function Repos({ match, profile, fetchingPRs, error }) {
  const { fetchData, setTotalUnread } = roger.useContext();
  const [ notifications ] = roger.useState('notifications');
  const { owner, name, prNumber, op } = match.params;
  const [ repos ] = roger.useState('repos', []);
  const subscribedRepos = repos.filter(repo => repo.selected);
  const [ fetchDataInterval, setFetchDataInterval ] = useState(null);

  /*useEffect(() => {
    const f = () => {
      fetchData({
        repos: subscribedRepos,
        repoName: name,
        prNumber: prNumber !== 'new' && op !== 'edit' ? prNumber : undefined
      }).then(
        () => {
          if (PULLING) {
            setFetchDataInterval(setTimeout(f, getPullingInterval()));
          }
        }
      );
    };

    f();

    return () => {
      clearTimeout(fetchDataInterval);
    };
  }, []);*/

  const repo = repos.find(
    ({ owner: repoOwner, name: repoName }) => owner === repoOwner && name === repoName
  );
  let pr;

  if (repo && repo.prs && repo.prs.length > 0) {
    pr = repo.prs.find(({ number }) => number.toString() === prNumber);
  }

  let totalUnread = 0;
  const reposList = repos.filter(({ selected }) => selected).map(repo => {
    const expanded = repo.owner === owner && repo.name === name;
    const linkUrl = expanded ? `/repo/${ repo.owner }` : `/repo/${ repo.owner }/${ repo.name }`;
    const repoEvents = flattenPRsEvents(repo.prs);

    totalUnread += repoEvents.filter(event => isItANewEvent(event, notifications)).length;

    return (
      <div key={ repo.repoId } className='relative'>
        <Link to={ linkUrl } className='list-link'>
          { expanded ? <CHEVRON_DOWN size={ 18 }/> : <CHEVRON_RIGHT size={ 18 }/> }
          { repo.nameWithOwner }
        </Link>
        { expanded && <PRs { ...match.params } prs={ repo.prs } loading={ fetchingPRs } /> }
        { !expanded && <Horn events={ repoEvents } /> }
      </div>
    );
  });

  setTotalUnread({ totalUnread });

  let PRComponent;

  if (pr && op === 'edit') {
    PRComponent = <PREdit pr={ pr } repo={ repo } owner={ owner }/>;
  } else if (pr) {
    PRComponent = <PR pr={ pr } url={ match.url } repo={ repo } />;
  } else if (prNumber === 'new') {
    PRComponent = <PRNew repo={ repo } owner={ owner }/>;
  } else {
    PRComponent = <PRFake />;
  }

  return (
    <div>
      <UpdateProgress fetchDataInterval={ fetchDataInterval }/>
      <div className='layout'>
        <aside>
          <Header profile={ profile } />
          <Link to='/' className='list-link'>
            <ARROW_RIGHT_CIRCLE size={ 18 }/>
            Dashboard
          </Link>
          <div className='pl05'>
           { subscribedRepos.length === 0 && (
              <div className='ml1'>You have no selected repositories. To select some click <Link to='/settings'>here</Link>.</div>
            ) }
            { reposList }
          </div>
          <Link to='/settings' className='list-link'>
            <CHEVRON_RIGHT size={ 18 }/>
            Settings
          </Link>
        </aside>
        <section className='pt1'>{ PRComponent }</section>
      </div>
    </div>
  );
}

Repos.propTypes = {
  match: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  fetchingPRs: PropTypes.bool,
  error: PropTypes.object
};

export default riew(Repos, fetchingPRs).with('api', 'profile', 'subscribedRepos');
