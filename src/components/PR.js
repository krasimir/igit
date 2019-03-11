import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import roger from '../jolly-roger';

import Loading from './Loading';
import Timeline from './Timeline';

const formatBranchLabels = (base, head) => {
  if (base.owner === head.owner) {
    return [ base.ref, head.ref ];
  }
  return [ base.owner + ':' + base.ref, head.owner + ':' + head.ref ];
};

export default function PR({ repo, pr: rawPR }) {
  const { getPR } = roger.useContext();
  const [ pr, setPR ] = useState(null);
  const [ error, setError ] = useState(false);
  const [ tab, setTab ] = useState('timeline');

  useEffect(() => {
    setPR(null);
    getPR({ repo, pr: rawPR }).then(setPR, error => {
      console.log(error);
      setError(error);
    });
  }, [rawPR]);

  if (error) {
    return (
      <div className='pr-details'>
        <div className='pr-card tac'>
          Ops! There is an error fetching the pull request.<br />Wait a bit and refresh the page.
        </div>
      </div>
    );
  }

  if (pr === null) {
    return (
      <div className='pr-details'>
        <div className='pr-card'>
          <Loading showLogo={ false } message={ `Loading pull request "${ rawPR.title }".` }/>
        </div>
      </div>
    );
  }

  // console.log(JSON.stringify(pr, null, 2));
  console.log(pr);

  let content;
  const [ base, head ] = formatBranchLabels(pr.base, pr.head);

  if (tab === 'timeline') {
    // content = <Timeline pr={ pr } />;
  }

  return (
    <div className='pr-details'>
      <div className='pr-card'>
        <div className='media'>
          <a href={ pr.author.url } target='_blank'>
            <img src={ pr.author.avatar } className='avatar'/>
          </a>
          <div>
            <h2>
              { pr.title }&nbsp;
              <a href={ pr.url } target='_blank'><span>(#{ pr.number })</span></a>
            </h2>
            <small>
              <span className='branch'>{ base }</span> ← <span className='branch'>{ head }</span>
            </small>
          </div>
        </div>
      </div>
      <div className='pr-card-light markdown'>
        <div dangerouslySetInnerHTML={ { __html: marked(pr.body) } } />
      </div>
      <nav className={ tab }>
        <a href='javascript:void(0);' onClick={ () => setTab('timeline') }>Timeline</a>
        <a href='javascript:void(0);' onClick={ () => setTab('commits') }>Files</a>
      </nav>
      { content }
    </div>
  );
};

PR.propTypes = {
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired
};
