import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LoadingAnimation } from './Loading';
import Horn from './Horn';
import flattenPREvents from '../api/utils/flattenPREvents';

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
          prs.map(pr => (
            <Link
              to={ `/repo/${ owner }/${ name }/${ pr.number }` }
              key={ pr.id }
              className={
                selectedPR === pr ? 'list-link selected py05 block relative' : 'list-link py05 block relative'
              }>
              <img src={ pr.author.avatar } className='avatar tiny'/>
              { pr.title }&nbsp;(#{ pr.number })
              <Horn events={ flattenPREvents(pr) } />
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
