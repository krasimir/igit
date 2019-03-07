import React from 'react';
import roger from '../jolly-roger';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [ repos ] = roger.useState('repos');

  const selectedRepos = repos.filter(repo => repo.selected);

  if (selectedRepos.length === 0) {
    return (
      <div className='dashboard'>
        <p className='tac mt3'>You have no selected repositories. Do it <Link to='/repos'>here</Link>.</p>
      </div>
    );
  }

  return (
    <div className='dashboard centered-content'>
      {
        selectedRepos.map(repo => (
            <div className='repo' key={ repo.repoId }>
              <Link to={ `/repo/${ repo.repoId }` }>
                { repo.fullName }
              </Link>
            </div>
          ))
      }
    </div>
  );
}
