import React from 'react';
import PropTypes from 'prop-types';

import { formatDate } from '../../utils';

export default function Date({ entry }) {
  if (entry.date && entry.html_url) {
    return (
      <small className='opa5'>
        <a href={ entry.html_url } target='_blank'>{ formatDate(entry.date) }</a>
      </small>
    );
  }
  return (
    <small className='opa5'>
      { formatDate(entry.date) }
    </small>
  );
}

Date.propTypes = {
  entry: PropTypes.object.isRequired
};
