import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Details from './Details';

const formatBranchLabels = (base, head) => {
  const [ baseRepo ] = base.label.split(':');
  const [ headRepo ] = head.label.split(':');

  if (baseRepo === headRepo) {
    return [ base.ref, head.ref ];
  }
  return [ base.label, head.label ];
};

export default function PR({ pr }) {
  const [ base, head ] = formatBranchLabels(pr.base, pr.head);
  const [ details, toggleDetails ] = useState(false);

  return (
    <div className={ `pr ${ details ? 'pr-with-details' : ''}` }>
      <div className='pr-main'>
        <div className='user'>
          <a href={ pr.user.html_url } target='_blank'>
            <img src={ pr.user.avatar_url } />
          </a>
        </div>
        <div>
          <h3>
            <a href='javascript:void(0);' onClick={ () => toggleDetails(!details) }>{ pr.title }</a>&nbsp;
            <a href={ pr.html_url } target='_blank'><span>(#{ pr.number })</span></a>
          </h3>
          <small>
            <span className='branch'>{ base }</span>
            { details ? <div>↑</div> : ' ← ' }
            <span className='branch'>{ head }</span>
          </small>
        </div>
      </div>
      { details && <Details pr={ pr }/> }
    </div>
  );
};

PR.propTypes = {
  pr: PropTypes.object.isRequired
};
