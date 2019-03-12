import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import roger from '../jolly-roger';

import Loading from './Loading';
import PR from './PR';

export default function Repo({ match }) {
  const [ repos ] = roger.useState('repos', []);
  const { owner, name, prNumber } = match.params;
  const repo = repos.find(({ owner: repoOwner, name: repoName }) => owner === repoOwner && name === repoName);
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
        <p className='tac mt2'>
          Ops! The repository can not be found. Please go back to the <Link to='/'>dashboard</Link>.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='view-repo'>
        <p className='tac mt2'>
          Ops! There is an error fetching the pull requests at { repo.name }. Wait a bit and refresh the page.
        </p>
      </div>
    );
  }

  if (prs === null) {
    return (
      <div className='view-repo'>
        <h2 className='tac mt2'>/ { repo.nameWithOwner }</h2>
        <Loading showLogo={ false } message={ `Fetching pull requests at ${ repo.name }.` }/>
      </div>
    );
  }

  if (prs.length === 0) {
    return (
      <div className='view-repo'>
        <h2 className='tac mb1 mt2'>
          <Link to='/'>/ repos</Link> / { repo.name } / pull requests
        </h2>
        <p className='tac mt2'>No pull requests at { repo.name } repository.</p>
      </div>
    );
  }

  const selectedPR = prs.find(({ number }) => number.toString() === prNumber);

  return (
    <div className={ prNumber ? 'view-repo open-pr' : 'view-repo' }>
      <h2 className='tac mb1 mt2'>
        <Link to='/'>/ repos</Link> / { repo.name } / pull requests
      </h2>
      <div className='repo-content'>
        <div className='prs'>
          {
            prs.map((pr, key) => (
              <Link
                to={ `/repo/${ owner }/${ name }/${ pr.number }` }
                key={ pr.id }
                className={ selectedPR === pr ? 'list-link pr-link selected' : 'list-link pr-link' }>
                <img src={ pr.authorAvatar } className='avatar small right'/>
                { pr.title }&nbsp;(#{ pr.number })
              </Link>
            ))
          }
        </div>
        { prNumber && <PR repo={ repo } prNumber={ prNumber } url={ match.url }/> }
      </div>
    </div>
  );
}

Repo.propTypes = {
  match: PropTypes.object.isRequired
};
