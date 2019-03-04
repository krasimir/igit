import React from 'react';
import PropTypes from 'prop-types';

const formatBranchLabels = (base, head) => {
  const [ baseRepo ] = base.label.split(':');
  const [ headRepo ] = head.label.split(':');

  if (baseRepo === headRepo) {
    return [ base.ref, head.ref ];
  }
  return [ base.label, head.label ];
};

export default function PR({ pr }) {
  console.log(pr);
  const [ base, head ] = formatBranchLabels(pr.base, pr.head);


  return (
    <div className='pr'>
      <div className='user'>
        <a href={ pr.user.html_url } target='_blank'>
          <img src={ pr.user.avatar_url } />
        </a>
      </div>
      <div>
        <h3><a href={ pr.html_url } target='_blank'>{ pr.title } <span>(#{ pr.number })</span></a></h3>
        <small>
          <span className='branch'>{ base }</span> ← <span className='branch'>{ head }</span>
        </small>
      </div>
    </div>
  );
};

PR.propTypes = {
  pr: PropTypes.object.isRequired
};
