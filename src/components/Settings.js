/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    <div className='settings'>
      <h2 className='tac mb1 mt2'>/ settings</h2>
      <p className='tac'>Select the repositories that you want to manage.<br />Once you are done go back to the <Link to='/'>repos page</Link>.</p>
      <div className='centered-content mt3'>
        <div key='filter'>
          <input type='text' placeholder='Filter' className='mb1' onChange={ (e) => setFilter(e.target.value) }/>
        </div>
        {
          repos
            .filter(({ nameWithOwner, selected }) => {
              return filter === '' || nameWithOwner.match(new RegExp(filter, 'gi')) || selected;
            })
            .map(repo => {
              const className = `list-link ${ repo.selected ? ' selected' : 'list-link'}`;

              return (
                <a className={ className } key={ repo.repoId } onClick={ () => toggleRepo(repo) }>
                  <CHECK /> { repo.nameWithOwner }
                </a>
              );
            })
        }
      </div>
      { loading && (
        <div className='centered-content tac'>
          <Loading showLogo={ false } message='Loading your repositories. Please wait.'/>
        </div>
      ) }
    </div>
  );
}
