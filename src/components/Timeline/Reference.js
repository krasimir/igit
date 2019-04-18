import React from 'react';
import PropTypes from 'prop-types';

import Date from '../utils/Date';
import { MESSAGE } from '../Icons';
import trim from '../utils/trim';
import { withHorn } from '../Horn';

function Reference({ event, dim }) {
  const cls = `timeline-thread-comment media small relative ${ dim ? 'dim' : ''}`;

  return (
    <div className={ cls } id={ event.id }>
      <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
      <div>
        <Date event={ event } />&nbsp;
        <MESSAGE size={ 18 }/>
        <small>mentioned at</small>&nbsp;
        <a href={ event.target.url } target='_blank'>{ trim(`${ event.target.title }`, 40) }</a>
      </div>
    </div>
  );
};

Reference.propTypes = {
  event: PropTypes.object.isRequired,
  dim: PropTypes.bool
};

export default withHorn(Reference);
