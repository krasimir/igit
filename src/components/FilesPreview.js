/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { CHEVRON_RIGHT, CHEVRON_DOWN } from './Icons';

function filesToDirs(files) {
  console.log(files);

}

export default function Reviewers({ pr }) {
  const [ expanded, expand ] = useState(pr.reviewers.length > 0);
  const files = filesToDirs(pr.files.items);

  console.log(JSON.stringify(files, null, 2));

  return (
    <div className='mt1 fz8'>
      <button className='as-link' onClick={ () => expand(!expanded) }>
        { expanded ? <CHEVRON_DOWN size={ 14 } /> : <CHEVRON_RIGHT size={ 14 } /> }
        Files changed ({ pr.files.total })
      </button>
      {
        (expanded && pr.reviewers.length > 0) && (
          <div className='pl1 bl1 ml1'>
          {
            pr.reviewers.map(reviewer => (
              <div key={ reviewer.avatar }>
                <img
                  src={ reviewer.avatar }
                  alt={ reviewer.name || reviewer.login }
                  className='avatar tiny'/>&nbsp;
                { reviewer.name || reviewer.login }
              </div>
            ))
          }
          </div>
        )
      }
    </div>
  );
}

Reviewers.propTypes = {
  pr: PropTypes.object.isRequired
};
