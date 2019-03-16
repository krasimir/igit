import React from 'react';
import PropTypes from 'prop-types';

import { formatDate, formatDateShort } from '../../utils';

export default function Date({ event, className }) {
  const cls = typeof className !== 'undefined' ? className : 'opa5';

  if (event.url) {
    return (
      <small className={ cls }>
        <a href={ event.url } target='_blank' title={ formatDate(event.date) }>{ formatDateShort(event.date) }</a>
      </small>
    );
  }
  return (
    <small className={ cls }>
      { formatDateShort(event.date) }
    </small>
  );
}

Date.propTypes = {
  event: PropTypes.object.isRequired,
  className: PropTypes.string
};
