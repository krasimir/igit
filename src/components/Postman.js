/* eslint-disable no-sequences */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import roger from '../jolly-roger';
import { LoadingAnimation } from './Loading';

export default function Postman({ handler, value, className, onCancel, onSave, resetOnSave }) {
  const [ profile ] = roger.useState('profile');
  const [ text, type ] = useState(value ? value.text : null);
  const [ submitted, submit ] = useState(false);
  const [ deleteSure, areYouSure ] = useState(false);
  const isEditing = !!value;

  const reset = () => {
    submit(false);
    areYouSure(false);
    type(value ? value.text : null);
  };
  const comment = async (method = 'add') => {
    if (text !== '') {
      submit(true);
      isEditing ? await handler.edit(value.id, text) : await handler[method](text);
      resetOnSave ? reset() : submit(false);
      onSave(text);
    }
  };

  return (
    <div className={ `postman cf ${ className }` }>
      <div className='media small'>
        <img src={ profile.avatar } className='avatar' title={ profile.login }/>
        <textarea
          value={ text ? text : '' }
          placeholder='Reply'
          className={ text !== null ? 'type' : '' }
          onClick={ () => type(text || '') }
          disabled={ submitted }
          onChange={ e => type(e.target.value) } />
      </div>
      { (isEditing && !submitted) && <div className='left mt05 ml2'>
        <button className='light' onClick={ () => {
          if (!deleteSure) {
            areYouSure(true);
          } else {
            submit(true);
            handler.del(value.id);
          }
        } }>{ !deleteSure ? 'Delete' : 'Deleting! Are you sure?' }</button>
      </div> }
      { (text !== null && !submitted) && <div className='right mt05'>
        <button className='brand cancel' onClick={ () => (reset(), onCancel()) }>Cancel</button>
        { handler.add &&
          <button className='brand cta' onClick={ () => comment('add') }>Comment</button> }
        { handler.edit &&
          <button className='brand cta' onClick={ () => comment('edit') }>Edit</button> }
        { (!isEditing && handler.addToReview) &&
          <button className='brand cta' onClick={ () => comment('addToReview') }>Add review comment</button> }
        { (!isEditing && handler.addSingleComment) &&
          <button className='brand cta' onClick={ () => comment('addSingleComment') }>
            Add single comment
          </button> }
        { (!isEditing && handler.startReview) &&
          <button className='brand cta' onClick={ () => comment('startReview') }>Start review</button> }
      </div> }
      { submitted && <div className='right mt05'><LoadingAnimation /></div> }
    </div>
  );
}

Postman.propTypes = {
  handler: PropTypes.object.isRequired,
  value: PropTypes.object,
  className: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  resetOnSave: PropTypes.bool
};
Postman.defaultProps = {
  className: '',
  resetOnSave: false,
  onCancel: () => {},
  onSave: () => {}
};
