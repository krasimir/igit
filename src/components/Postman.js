/* eslint-disable no-sequences */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import roger from '../jolly-roger';
import { LoadingAnimation } from './Loading';

export default function Postman({
  handler,
  value,
  className,
  onCancel,
  onSave,
  resetOnSave,
  focus,
  children,
  placeholder,
  showAvatar
}) {
  const textareaEl = useRef(null);
  const [ profile ] = roger.useState('profile');
  const [ text, type ] = useState(value ? value.text : null);
  const [ submitted, submit ] = useState(false);
  const [ deleteSure, areYouSure ] = useState(false);
  const [ textareaClassName, setTextAreaClassName ] = useState(text !== null ? 'type' : '');
  const isEditing = !!value;
  const disableInputs = text === '' || text === null;

  useEffect(() => {
    if (focus) {
      setTextAreaClassName('type');
      textareaEl.current.focus();
    }
  }, []);

  useEffect(() => {
    if (text !== null) {
      setTextAreaClassName('type');
    }
  }, [ text ]);

  const reset = () => {
    submit(false);
    areYouSure(false);
    type(value ? value.text : null);
    setTextAreaClassName('');
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
      <div className={ showAvatar ? 'media small' : '' }>
        { showAvatar && <img src={ profile.avatar } className='avatar' title={ profile.login }/> }
        <textarea
          ref={ textareaEl }
          value={ text ? text : '' }
          placeholder={ placeholder }
          className={ textareaClassName }
          onClick={ () => type(text || '') }
          disabled={ submitted }
          onChange={ e => type(e.target.value) } />
      </div>
      { (isEditing && !submitted) && <div className={ showAvatar ? 'left mt05 ml2' : 'left mt05' }>
        <button className='light' onClick={ () => {
          if (!deleteSure) {
            areYouSure(true);
          } else {
            submit(true);
            handler.del(value.id);
          }
        } }>{ !deleteSure ? 'Delete' : 'Deleting! Are you sure?' }</button>
      </div> }
      { (!submitted && text !== null) && <div className='right mt05'>
        <button
          className='brand cancel'
          onClick={ () => (reset(), onCancel()) }
          disabled={ textareaClassName === '' }>Cancel</button>
        { handler.add &&
          <button
            className='brand cta'
            onClick={ () => comment('add') }
            disabled={ disableInputs }>Comment</button> }
        { handler.edit &&
          <button
            className='brand cta'
            onClick={ () => comment('edit') }
            disabled={ disableInputs }>Edit</button> }
        { (!isEditing && handler.addToReview) &&
          <button
            className='brand cta'
            onClick={ () => comment('addToReview') }
            disabled={ disableInputs }>Add review comment</button> }
        { (!isEditing && handler.addSingleComment) &&
          <button
            className='brand cta'
            onClick={ () => comment('addSingleComment') }
            disabled={ disableInputs }>Add single comment</button> }
        { (!isEditing && handler.startReview) &&
          <button
            className='brand cta'
            onClick={ () => comment('startReview') }
            disabled={ disableInputs }>Start review</button> }
      </div> }
      { submitted && <div className='right mt05'><LoadingAnimation /></div> }
      { children }
    </div>
  );
}

Postman.propTypes = {
  handler: PropTypes.object.isRequired,
  value: PropTypes.object,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  resetOnSave: PropTypes.bool,
  focus: PropTypes.bool,
  showAvatar: PropTypes.bool,
  children: PropTypes.object
};
Postman.defaultProps = {
  className: '',
  resetOnSave: false,
  focus: false,
  onCancel: () => {},
  onSave: () => {},
  placeholder: 'Reply',
  showAvatar: true
};
