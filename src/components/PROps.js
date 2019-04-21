/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { CLOSE, CHECK, MORE_HORIZONTAL, CIRCLE } from './Icons';
import roger from 'jolly-roger';
import { LoadingAnimation } from './Loading';
import Reviewers from './Reviewers';

const isStatusSuccessful = (status) => {
  if (status === null) return true;

  return status.every(({ state }) => state === 'SUCCESS');
};
const isPending = (status) => {
  if (status === null) return false;

  return status.some(({ state }) => (state === 'PENDING' || state === 'EXPECTED'));
};

export default function PROps({ pr, repo }) {
  const [ closingAreYouSure, areYouSure ] = useState(false);
  const { mergePR, closePR, getPRStatuses } = roger.useContext();
  const [ submitted, setSubmitted ] = useState(false);
  const [ statuses, setStatuses ] = useState(null);
  const isLastCheckOk =
    statuses === null ||
    statuses.length === 0 ||
    isStatusSuccessful(statuses[statuses.length - 1].status);
  const areThereAnyChecks = statuses && statuses.length > 0 && statuses.some(s => s.status !== null);
  let mergeButtonLabel = 'Merge pull request';

  useEffect(() => {
    setStatuses(null);
    getPRStatuses({ prNumber: pr.number, repo }).then(setStatuses);
  }, [ pr.number ]);

  async function merge() {
    setSubmitted(`Merging <code>${ pr.title }</code> pull request.`);
    await mergePR({ id: pr.id, repo });
    setSubmitted(false);
  }

  async function close() {
    if (!closingAreYouSure) {
      areYouSure(true);
      return;
    }
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

  if (pr.mergeable === 'CONFLICTING') {
    mergeButtonLabel = 'Can not be merged. Conflicting.';
  } else if (!isLastCheckOk) {
    mergeButtonLabel = 'Merge even checks failure';
  }

  return (
    <div>
      <hr />
      <button
        className='brand'
        disabled={ submitted }
        onClick={ close }>
        <CLOSE size={ 18 } />&nbsp;
        { !closingAreYouSure ? 'Close pull request' : 'Closing. Are you sure?' }
      </button>
      <button
        className={ `brand right ${ isLastCheckOk && pr.mergeable !== 'CONFLICTING' ? 'cta' : 'delete' }` }
        disabled={ submitted || pr.mergeable !== 'MERGEABLE' }
        onClick={ () => merge() }>
        <CHECK size={ 18 } />&nbsp;
        { mergeButtonLabel }
      </button>
      { statuses && statuses.length > 0 ? (
        areThereAnyChecks && <div className='mt1 fz8 pr-card-light'>
          {
            statuses.map(
              ({ commit, status }) =>
                <Status key={ commit.id } commit={ commit } status={ status } />
            )
          }
        </div>
      ) : (
        <div className='mt1 fz8 pr-card-light'>
          <LoadingAnimation className='m0'/>
        </div>
      ) }
      <Reviewers pr={ pr }/>
    </div>
  );
};

PROps.propTypes = {
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired
};

function Status({ commit, status }) {
  const [ expanded, expand ] = useState(false);
  let icon;

  if (status === null) {
    icon = <CIRCLE size={ 14 } color='#e8e8e8' />;
  } else if (isPending(status)) {
    icon = <MORE_HORIZONTAL size={ 14 } />;
  } else {
    icon = isStatusSuccessful(status) ?
      <CHECK size={ 14 } color='#079221' /> :
      <CLOSE size={ 14 } color='#920721' />;
  }

  return (
    <div className='opa7'>
      <button className='as-link tal' onClick={ () => expand(!expanded) }>
        { icon }
        { commit.message }
      </button>
      { expanded && <div className='ml2'>
        {
          status && status.map(context => {
            return (
              <div key={ context.id }>
                <div className='media small'>
                  <img src={ context.creator.avatar } className='avatar' alt={ context.creator.login } />
                  <div>
                    { statusIcon(context.state) }
                    <a href={ context.targetUrl } target='_blank'>{ context.context }</a>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div> }
    </div>
  );
}

Status.propTypes = {
  commit: PropTypes.object.isRequired,
  status: PropTypes.any
};

function statusIcon(state) {
  switch (state) {
    case 'ERROR':
    case 'FAILURE': return <CLOSE size={ 18 } color='#920721' />;
    case 'EXPECTED':
    case 'PENDING': return <MORE_HORIZONTAL size={ 18 } />;
  }
  return <CHECK size={ 18 } color='#079221' />;
}
