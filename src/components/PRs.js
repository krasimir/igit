import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LoadingAnimation } from './Loading';
import Horn from './Horn';
import flattenPREvents from '../api/utils/flattenPREvents';

export default function PRs({ prs, owner, name, prNumber, loading }) {
  if (!prs) {
    return (
      <div>
        <LoadingAnimation /> Loading, please wait ...
      </div>
    );
  }

  const selectedPR = prs.find(({ number }) => number.toString() === prNumber);

  if (prs.length === 0 && !loading) {
    return (
      <div className='prs'>
        <div className='pl1'>No pull requests.</div>
      </div>
    );
  }

  return (
    <div className='prs'>
      {
        prs
          .sort((pr1, pr2) => parseInt(pr1.number, 10) > parseInt(pr2.number, 10) ? -1 : 1)
          .map((pr, i) => (
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
  );
}

PRs.propTypes = {
  prs: PropTypes.array,
  owner: PropTypes.string,
  name: PropTypes.string,
  prNumber: PropTypes.string,
  loading: PropTypes.bool.isRequired
};
