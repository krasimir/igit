import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import roger from '../jolly-roger';

import Loading from './Loading';
import PR from './PR';

export default function Repo({ match }) {
  const [ repos ] = roger.useState('repos', []);
  const repo = repos.find(({ repoId }) => repoId === parseInt(match.params.id, 10));
  const { getPRs } = roger.useContext();
  const [ prs, setPRs ] = useState(null);
  const [ error, setError ] = useState(false);

  useEffect(() => {
    getPRs(repo).then(setPRs, error => {
      console.log(error);
      setError(error);
    });
  }, []);

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

  if (prs === null) {
    return (
      <div className='view-repo'>
        <h1 className='tac'>{ repo.fullName }</h1>
        <Loading showLogo={ false } message={ `Loading pull requests for ${ repo.fullName }.` }/>
      </div>
    );
  }

  return (
    <div className='view-repo'>
      <h1 className='tac'>{ repo.fullName }</h1>
      {
        prs.map((pr, key) => <PR pr={ pr } key={ key }/>)
      }
    </div>
  );
}

Repo.propTypes = {
  match: PropTypes.object.isRequired
};
