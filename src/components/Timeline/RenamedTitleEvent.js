import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { EDIT } from '../Icons';
import trim from '../utils/trim';
import { withHorn } from '../Horn';

function RenamedTitleEvent({ event }) {
  return (
    <div className='timeline-thread-comment media small relative' id={event.id}>
      <img src={event.author.avatar} className='avatar' title={event.author.login} />
      <div>
        {event.author.login}&nbsp;
        <Date event={event} />
        &nbsp;
        <EDIT size={18} />
        {trim(`renamed to ${event.currentTitle}`)}
      </div>
    </div>
  );
}

RenamedTitleEvent.propTypes = {
  event: PropTypes.object.isRequired
};

export default withHorn(RenamedTitleEvent);
