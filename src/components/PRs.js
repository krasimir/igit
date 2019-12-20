import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LoadingAnimation } from './Loading';
import Horn from './Horn';
import flattenPREvents from '../api/utils/flattenPREvents';
import { PLUS, GITHUB } from './Icons';

export default function PRs({ prs, owner, name, prNumber, loading, triggerUpdate, numberOfFetches }) {
  if (!prs) {
    return (
      <div>
        <LoadingAnimation /> Loading, please wait ...
      </div>
    );
  }

  const selectedPR = prs.find(({ number }) => number.toString() === prNumber);
  const getLinkClasses = (pr) => {
    const classes = ['list-link', 'py05', 'block', 'relative'];
    if (selectedPR === pr) {
      classes.push('selected');
    }
    if (pr.merged) {
      classes.push('merged');
    } else if (pr.closed) {
      classes.push('closed');
    }
    return classes.join(' ');
  };

  if (prs.length === 0 && !loading) {
    return (
      <div className='prs'>
        <div className='pl1'>No pull requests.</div>
      </div>
    );
  }
  return (
    <div className='prs'>
      {prs
        .sort((pr1, pr2) => (parseInt(pr1.number, 10) > parseInt(pr2.number, 10) ? -1 : 1))
        .map((pr, i) => (
          <Link to={`/repo/${owner}/${name}/${pr.number}`} key={pr.id} className={getLinkClasses(pr)}>
            <img src={pr.author.avatar} className='avatar tiny' />
            {pr.title}&nbsp;(#{pr.number})
            <Horn events={flattenPREvents(pr)} />
          </Link>
        ))}
      <Link to={`/repo/${owner}/${name}/new`} className='as-link tac list-link'>
        <PLUS size={14} style={{ transform: 'translateY(2px)' }} />
        New pull request
      </Link>
      <a onClick={triggerUpdate} className='as-link tac list-link'>
        <GITHUB size={14} style={{ transform: 'translateY(3px)' }} />
        Fetch data <sup style={{ opacity: 0.3 }}>{numberOfFetches}</sup>
      </a>
    </div>
  );
}

PRs.propTypes = {
  prs: PropTypes.array,
  owner: PropTypes.string,
  name: PropTypes.string,
  prNumber: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  triggerUpdate: PropTypes.func,
  numberOfFetches: PropTypes.number
};
