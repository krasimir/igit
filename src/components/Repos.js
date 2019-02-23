/* eslint-disable max-len */
import React, { useEffect } from 'react';

import { CHECK } from './Icons';
import Loading from './Loading';
import { useState } from '../react-process';

export default function Repos() {
  const [ repos, { fetchAllRepos, toggleRepo } ] = useState('repos');
  const error = false;

  useEffect(() => {
    fetchAllRepos();
  }, []);

  if (error) {
    return (
      <div className='error tac centered-content'>
        GitHorn can't fetch your repositories. Try again by refreshing the page.
      </div>
    );
  }
  if (repos.length === 0) {
    return (
      <div className='centered-content tac'>
        <Loading showLogo={ false } message='Loading your repositories. Please wait.'/>
      </div>
    );
  }
  return (
    <div className='repos'>
        <h1 className='tac'>Your repositories</h1>
        <p className='tac'>Select the repositories that you want to manage.</p>
        <ul className='centered-content mt3'>
          {
            repos.map(repo => {
              const className = `repo${ repo.selected ? ' selected' : ''}`;

              return (
                <li key={ repo.repoId } className={ className }>
                  <p>
                    <a className='subscribe' onClick={ () => toggleRepo(repo) }>
                      <CHECK /> { repo.fullName }
                    </a>
                  </p>
                  <small><a href={ repo.githubURL } target='_blank'>view</a></small>
                </li>
              );
            })
          }
        </ul>
    </div>
  );
}
