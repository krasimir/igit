/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';

import roger from '../jolly-roger';

export default function Dashboard() {
  const [ repos ] = roger.useState('repos');

  const selectedRepos = repos.filter(repo => repo.selected);

  if (selectedRepos.length === 0) {
    return (
      <div className='dashboard'>
        <p className='tac mt3'>You have no selected repositories. Do it <Link to='/settings'>here</Link>.</p>
      </div>
    );
  }

  return (
    <div className='dashboard centered-content'>
      <h2 className='tac mb1'>/ repos</h2>
      {
        selectedRepos.map(repo => (
          <Link to={ `/repo/${ repo.repoId }` } className='list-link' key={ repo.repoId }>
            { repo.fullName }
          </Link>
        ))
      }
      <p className='tac mt2'>
        Those are the repositories that you are subscribed to. To list all repositories and make a selection go to the <Link to={ '/settings' }>settings page</Link>.
      </p>
    </div>
  );
}
