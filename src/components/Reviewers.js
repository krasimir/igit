/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { CHEVRON_RIGHT, CHEVRON_DOWN } from './Icons';

export default function Reviewers({ pr }) {
  const [expanded, expand] = useState(pr.reviewers.length > 0);

  // temporary till github fixes the api so we are able to get
  // the members of a organization
  // https://github.community/t5/GitHub-API-Development-and/v4-API-return-Field-members-doesn-t-exist-on-type-Organization/m-p/22221
  if (pr.reviewers.length === 0) {
    return null;
  }

  return (
    <div className='mt1 fz8'>
      <button className='as-link' onClick={() => expand(!expanded)}>
        {expanded ? <CHEVRON_DOWN size={14} /> : <CHEVRON_RIGHT size={14} />}
        {pr.reviewers.length === 0 ? 'Assign reviewers' : `Reviewers (${pr.reviewers.length})`}
      </button>
      {expanded && pr.reviewers.length > 0 && (
        <div className='pl1 bl1 ml1'>
          {pr.reviewers.map((reviewer) => (
            <div key={reviewer.avatar}>
              <img src={reviewer.avatar} alt={reviewer.name || reviewer.login} className='avatar tiny' />
              &nbsp;
              {reviewer.name || reviewer.login}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Reviewers.propTypes = {
  pr: PropTypes.object.isRequired
};
