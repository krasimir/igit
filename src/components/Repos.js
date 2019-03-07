/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';

import { CHECK } from './Icons';
import Loading from './Loading';
import roger from '../jolly-roger';

export default function Repos() {
  const { fetchAllRepos, toggleRepo } = roger.useContext();
  const [ repos, setRepos ] = roger.useState('repos', []);
  const [ filter, setFilter ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const error = false;

  useEffect(() => {
    setLoading(true);
    fetchAllRepos().then(
      result => {
        setRepos(result);
        setLoading(false);
      },
      error => {
        console.log(error);
        setLoading(false);
      }
    );
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
        <li key='filter'>
          <input type='text' placeholder='Filter' className='mb1' onChange={ (e) => setFilter(e.target.value) }/>
        </li>
        {
          repos
            .filter(({ fullName, selected }) => {
              return filter === '' || fullName.match(new RegExp(filter, 'gi')) || selected;
            })
            .map(repo => {
              const className = `repo${ repo.selected ? ' selected' : ''}`;

              return (
                <li key={ repo.repoId } className={ className }>
                  <p>
                    <CHECK />
                    <a className='subscribe' onClick={ () => toggleRepo(repo) }>
                      { repo.fullName }
                    </a>
                  </p>
                  <small><a href={ repo.githubURL } target='_blank'>view</a></small>
                </li>
              );
            })
        }
      </ul>
      { loading && (
        <div className='centered-content tac'>
          <Loading showLogo={ false } message='Loading your repositories. Please wait.'/>
        </div>
      ) }
    </div>
  );
}
