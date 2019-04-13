/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Header from './Header';
import roger from '../jolly-roger';
import PRs from './PRs';
import PR from './PR';
import { CHEVRON_RIGHT, CHEVRON_DOWN, ARROW_RIGHT_CIRCLE } from './Icons';
import FakePR from './FakePR';
import Horn from './Horn';
import flattenPREvents from '../api/utils/flattenPREvents';
import { PULLING } from '../constants';
import isItANewEvent from './utils/isItANewEvent';

const flattenPRsEvents = allPRs => {
  if (allPRs && allPRs.length > 0) {
    return allPRs.reduce((events, pr) => {
      return events.concat(flattenPREvents(pr));
    }, []);
  }
  return [];
};

export default function Repos({ match }) {
  const { fetchData, setTotalUnread } = roger.useContext();
  const [ profile ] = roger.useState('profile', null);
  const [ notifications ] = roger.useState('notifications');
  const { owner, name, prNumber } = match.params;
  const [ repos ] = roger.useState('repos', []);
  const subscribedRepos = repos.filter(repo => repo.selected);
  const [ error, setError ] = useState(null);
  const [ fetchDataInterval, setFetchDataInterval ] = useState(null);

  if (subscribedRepos.length === 0) {
    return (
      <div className='layout'>
        <aside>
          <p className='tac mt3'>You have no selected repositories. Do it <Link to='/settings'>here</Link>.</p>
        </aside>
        <section>...</section>
      </div>
    );
  }

  useEffect(() => {
    const f = () => fetchData({ repos: subscribedRepos, repoName: name, prNumber }).then(
      () => {
        if (PULLING) {
          setFetchDataInterval(setTimeout(f, PULLING));
        }
      },
      error => {
        console.error(error);
        setError(error);
      }
    );

    f();

    return () => {
      clearTimeout(fetchDataInterval);
    };
  }, []);

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
        { expanded && <PRs { ...match.params } prs={ repo.prs }/> }
        <Horn events={ repoEvents } />
      </div>
    );
  });

  setTotalUnread(totalUnread);

  return (
    <div className='layout'>
      <aside>
        <Header profile={ profile } />
        <Link to='/' className='list-link'>
          <ARROW_RIGHT_CIRCLE size={ 18 }/>
          Dashboard
        </Link>
        <div className='pl05'>
          { reposList }
        </div>
        <Link to='/settings' className='list-link'>
          <ARROW_RIGHT_CIRCLE size={ 18 }/>
          Settings
        </Link>
      </aside>
      <section className='pt1'>
        { pr ? <PR pr={ pr } url={ match.url } repo={ repo } /> : <FakePR /> }
      </section>
    </div>
  );
}

Repos.propTypes = {
  match: PropTypes.object.isRequired
};
