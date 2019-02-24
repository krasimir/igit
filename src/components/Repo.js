import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import roger from '../jolly-roger';

export default function Repo({ match }) {
  const [ repos ] = roger.useState('repos', []);
  const { getPRs } = roger.useContext();
  const [ prs, setPRs ] = useState(null);
  const [ error, setError ] = useState(false);

  useEffect(() => {
    getPRs.then(
      prs => {
        console.log(prs);
      },
      error => {
        setError(error);
      }
    );
  }, []);

  const repo = repos.find(({ repoId }) => repoId === parseInt(match.params.id, 10));

  if (!repo) {
    return (
      <div className='view-repo'>
        <p className='tac'>
          Ops! The repository can not be found. Please go back to the <Link to='/'>dashboard</Link>.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='view-repo'>
        <p className='tac'>
          Ops! There is an error fetching the pull requests of { repo.fullName }. Wait a bit and refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className='view-repo'>
      <h1 className='tac'>{ repo.fullName }</h1>
    </div>
  );
}

Repo.propTypes = {
  match: PropTypes.object.isRequired
};
