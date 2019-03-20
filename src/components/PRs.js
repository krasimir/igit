import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function PRs({ prs, owner, name, prNumber }) {
  if (!prs || prs.length === 0) {
    return null;
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
              className={ selectedPR === pr ? 'list-link selected' : 'list-link' }>
              <img src={ pr.authorAvatar } className='avatar small'/>
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
