import React from 'react';
import PropTypes from 'prop-types';

export default function Diff({ data, className }) {
  const { additions, deletions } = data;

  return (
    <span className={ `diff ${ className }` }>
      { (deletions && deletions > 0) ? <span className='diff-delete'>-{deletions}</span> : null }
      { (additions && additions > 0) ? <span className='diff-add'>+{additions}</span> : null }
    </span>
  );
}

Diff.propTypes = {
  data: PropTypes.object.isRequired,
  className: PropTypes.string
};
