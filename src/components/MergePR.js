import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { CLOSE, CHECK } from './Icons';
import roger from '../jolly-roger';
import { LoadingAnimation } from './Loading';

export default function MergePR({ pr, repo }) {
  const { mergePR, closePR } = roger.useContext();
  const [ submitted, setSubmitted ] = useState(false);

  async function merge() {
    setSubmitted(`Merging <code>${ pr.title }</code> pull request.`);
    await mergePR({ id: pr.id, repo });
    setSubmitted(false);
  }

  async function close() {
    setSubmitted(`Closing <code>${ pr.title }</code> pull request.`);
    await closePR({ id: pr.id, repo });
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div>
        <hr />
        <span className='markdown' dangerouslySetInnerHTML={ { __html: submitted } } />
        <LoadingAnimation className='m0'/>
      </div>
    );
  }

  return (
    <div>
      <hr />
      <button
        className='brand'
        disabled={ submitted }
        onClick={ () => close() }>
        <CLOSE size={ 18 } />&nbsp;Close pull request
      </button>
      <button
        className='brand cta right'
        disabled={ submitted || pr.mergeable !== 'MERGEABLE' }
        onClick={ () => merge() }>
        <CHECK size={ 18 } />&nbsp;
        { pr.mergeable === 'CONFLICTING' ? 'Can not be merged. Conflicting.' : 'Merge pull request' }
      </button>
    </div>
  );
};

MergePR.propTypes = {
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired
};
