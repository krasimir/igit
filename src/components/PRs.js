import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LoadingAnimation } from './Loading';

export default function PRs({ prs, owner, name, prNumber }) {
  if (!prs || prs.length === 0) {
    return (
      <div>
        <LoadingAnimation /> Loading, please wait ...
      </div>
    );
  }

  const selectedPR = prs.find(({ number }) => number.toString() === prNumber);

  return (
    <div>
      <div className='pl1 prs'>
        {
          prs.map((pr, key) => (
            <Link
              to={ `/repo/${ owner }/${ name }/${ pr.number }` }
              key={ pr.id }
              className={ selectedPR === pr ? 'list-link selected py05' : 'list-link py05' }>
              <img src={ pr.author.avatar } className='avatar small'/>
              { pr.title }&nbsp;(#{ pr.number })
            </Link>
          ))
        }
      </div>
    </div>
  );
}

PRs.propTypes = {
  prs: PropTypes.array,
  owner: PropTypes.string,
  name: PropTypes.string,
  prNumber: PropTypes.string
};
