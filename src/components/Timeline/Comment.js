import React, { useState } from 'react';
import PropTypes from 'prop-types';
import riew from 'riew/react';

import marked from '../utils/marked';
import Date from '../utils/Date';
import { MESSAGE } from '../Icons';
import Postman from '../Postman';
import { withHorn } from '../Horn';

function Comment({ event, repo, pr, profile, postman }) {
  const [isBodyVisible, bodyVisibility] = useState(true);
  const [isEditing, edit] = useState(false);
  const allowEdit = event.author.login === profile.login && isBodyVisible;

  return (
    <div className='timeline-thread-comment relative'>
      <div className='media small' id={event.id}>
        <img src={event.author.avatar} className='avatar' title={event.author.login} />
        <div>
          {event.author.login}&nbsp;
          <Date event={event} />
          &nbsp;
          <MESSAGE size={18} />
          {event.body !== '' && !isBodyVisible && (
            <button className='card-tag-button' onClick={() => bodyVisibility(!isBodyVisible)}>
              ···
            </button>
          )}
          {allowEdit && (
            <button className='card-tag-button' onClick={() => edit(!isEditing)}>
              edit
            </button>
          )}
        </div>
      </div>
      <div className='mt05'>
        {isBodyVisible && !isEditing && (
          <div className='markdown' dangerouslySetInnerHTML={{ __html: marked(event.body, repo) }} />
        )}
        {isEditing && (
          <Postman
            handler={postman({ repo, pr })[event.type]}
            className='mt05'
            value={{ text: event.body, id: event.id }}
            onCancel={() => edit(false)}
            onSave={() => edit(false)}
            showAvatar={false}
          />
        )}
      </div>
    </div>
  );
}

Comment.propTypes = {
  event: PropTypes.object.isRequired,
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  postman: PropTypes.func.isRequired
};

export default withHorn(riew(Comment).with('postman', 'profile'));
