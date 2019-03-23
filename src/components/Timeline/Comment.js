import React, { useState } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';

import Date from '../utils/Date';
import roger from '../../jolly-roger';
import { MESSAGE } from '../Icons';
import Postman from '../Postman';

export default function Comment({ event, repo, pr }) {
  const [ isBodyVisible, bodyVisibility ] = useState(false);
  const [ isEditing, edit ] = useState(false);
  const [ profile ] = roger.useState('profile');
  const allowEdit = event.author.login === profile.login && isBodyVisible;

  return (
    <div className='media small'>
      <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
      <div>
        <Date event={ event } />&nbsp;
        <MESSAGE size={ 18 }/>
        { event.body !== '' && <button className='card-tag-button' onClick={ () => bodyVisibility(!isBodyVisible) }>
          ···
        </button> }
        { allowEdit && <button className='card-tag-button' onClick={ () => edit(!isEditing) }>
          edit
        </button> }
        { (isBodyVisible && !isEditing) && <div
          className='markdown'
          dangerouslySetInnerHTML={ { __html: marked(event.body) } } /> }
        { isEditing &&
          <Postman
            className='mt05'
            context={ event.type }
            repo={ repo }
            pr={ pr }
            value={ { text: event.body, id: event.id } }
            onSave={ () => edit(false) }/> }
      </div>
    </div>
  );
};

Comment.propTypes = {
  event: PropTypes.object.isRequired,
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired
};
