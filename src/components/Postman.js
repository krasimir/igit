/* eslint-disable no-sequences, no-use-before-define */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import riew from 'riew/react';

import { LoadingAnimation } from './Loading';
import Suggestions from './Suggestions';
import setCaretPosition from './utils/setCaretPosition';

function Postman({
  handler,
  value,
  className,
  onCancel,
  onSave,
  resetOnSave,
  focus,
  children,
  placeholder,
  showAvatar,
  profile
}) {
  const textareaEl = useRef(null);
  const [ text, type ] = useState(value ? value.text : null);
  const [ textareaPosition, setTextareaPosition ] = useState(0);
  const [ submitted, submit ] = useState(false);
  const [ deleteSure, areYouSure ] = useState(false);
  const [ textareaClassName, setTextAreaClassName ] = useState(text !== null ? 'type' : '');
  const [ suggestionsEnabled, enableSuggestions ] = useState(false);
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

  const onTextChange = (e) => {
    type(e.target.value);
    setTextareaPosition(e.target.selectionStart);
  };
  const reset = () => {
    submit(false);
    areYouSure(false);
    type(value ? value.text : null);
    setTextAreaClassName('');
    setTextareaPosition(0);
  };
  const comment = async (method = 'add') => {
    if (text !== '') {
      submit(true);
      isEditing ? await handler.edit(value.id, text) : await handler[method](text);
      resetOnSave ? reset() : submit(false);
      onSave(text);
    }
  };
  const addToText = (value) => {
    const before = (text || '').substr(0, textareaPosition);
    const after = (text || '').substr(textareaPosition, text ? text.length : 0);

    type(before + value + after);
    const newPosition = textareaPosition + value.length;

    textareaEl.current.focus();

    setTimeout(() => setCaretPosition(textareaEl.current, newPosition), 10);
  };

  return (
    <div className={ `cf ${ className } relative` }>
      <div className={ showAvatar ? 'media small' : '' }>
        { showAvatar && <img src={ profile.avatar } className='avatar' title={ profile.login }/> }
        <textarea
          ref={ textareaEl }
          value={ text ? text : '' }
          placeholder={ placeholder }
          className={ textareaClassName }
          disabled={ submitted }
          onChange={ onTextChange }
          onFocus={ () => enableSuggestions(true) }
          onBlur={ () => setTimeout(() => enableSuggestions(false), 200) }
          onClick={ (e) => {
            setTextareaPosition(e.target.selectionStart);
            setTextAreaClassName('type');
          } } />
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
      <Suggestions
        visible={ suggestionsEnabled }
        onSelect={ addToText } />
    </div>
  );
}

Postman.propTypes = {
  handler: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
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

export default riew(Postman).with('profile');
