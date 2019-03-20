/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import roger from '../jolly-roger';
import PRs from './PRs';
import PR from './PR';
import { CHEVRON_RIGHT, CHEVRON_DOWN } from './Icons';

export default function Repos({ match }) {
  const { fetchData } = roger.useContext();
  const { owner, name, prNumber } = match.params;
  const [ repos ] = roger.useState('repos', []);
  const subscribedRepos = repos.filter(repo => repo.selected);
  const [ reposWithData, setData ] = useState(subscribedRepos);
  const [ error, setError ] = useState(null);

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
    fetchData(subscribedRepos).then(
      setData,
      error => {
        console.error(error);
        setError(error);
      }
    );
  }, []);

  const repo = reposWithData
    .find(({ owner: repoOwner, name: repoName }) => owner === repoOwner && name === repoName);
  let pr;

  if (repo && repo.prs && repo.prs.length > 0) {
    pr = repo.prs.find(({ number }) => number.toString() === prNumber);
  }

  return (
    <div className='layout'>
      <aside>
        {
          reposWithData.map(repo => {
            const expanded = repo.owner === owner && repo.name === name;

            return (
              <div key={ repo.repoId }>
                <Link to={ `/repo/${ repo.owner }/${ repo.name }` } className='list-link'>
                  { expanded ? <CHEVRON_DOWN size={ 26 }/> : <CHEVRON_RIGHT size={ 26 }/> }
                  { repo.nameWithOwner }
                </Link>
                { expanded && <PRs { ...match.params } prs={ repo.prs }/> }
              </div>
            );
          })
        }
      </aside>
      <section>
        { pr && <PR pr={ pr.data } url={ match.url } repo={ repo } /> }
      </section>
    </div>
  );
}

Repos.propTypes = {
  match: PropTypes.object.isRequired
};
