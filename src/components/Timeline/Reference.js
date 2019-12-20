import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { MESSAGE } from '../Icons';
import trim from '../utils/trim';
import { withHorn } from '../Horn';

function Reference({ event }) {
  return (
    <div className='timeline-thread-comment media small relative' id={event.id}>
      <img src={event.author.avatar} className='avatar' title={event.author.login} />
      <div>
        {event.author.login}&nbsp;
        <Date event={event} />
        &nbsp;
        <MESSAGE size={18} />
        <small>mentioned at</small>&nbsp;
        <a href={event.target.url} target='_blank'>
          {trim(`${event.target.title}`, 40)}
        </a>
      </div>
    </div>
  );
}

Reference.propTypes = {
  event: PropTypes.object.isRequired
};

export default withHorn(Reference);
