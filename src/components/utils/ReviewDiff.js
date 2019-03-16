import diff2html from 'diff2html';
import React from 'react';
import PropTypes from 'prop-types';

export default function ReviewDiff({ data }) {
  return <pre><code>{ data.diffHunk }</code></pre>
  // const formatter = diff2html.Diff2Html;
  // const diffHunk = [
  //   `diff --git ${ data.path } ${ data.path }\n${ data.diffHunk }`
  // ].join('\n');

  // return <div className='code-diff' dangerouslySetInnerHTML={ { __html: html } } />;
}

ReviewDiff.propTypes = {
  data: PropTypes.object.isRequired
};
