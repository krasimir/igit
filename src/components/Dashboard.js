import React from 'react';
import roger from '../jolly-roger';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [ repos ] = roger.useState('repos');

  return (
    <div className='dashboard'>
      {
        repos
          .filter(repo => repo.selected)
          .map(repo => (
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
