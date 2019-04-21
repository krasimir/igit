/* eslint-disable max-len, consistent-return, handle-callback-err */
import React, { useState, useRef, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { PULL_REQUEST } from './Icons';
import Suggestions from './Suggestions';
import setCaretPosition from './utils/setCaretPosition';
import { LoadingAnimation } from './Loading';
import roger from 'jolly-roger';

function errorsReducer(state, error) {
  if (error === null) return {};
  if (error.value === null) {
    delete state[error.key];
  } else {
    state[error.key] = error.value;
  }
  return { ...state };
}
function valuesReducer(state, data) {
  state[data.key] = data.value;
  return { ...state };
}

export default function PREdit({ repo, owner, pr }) {
  const bodyTextarea = useRef(null);
  const { editPR } = roger.useContext();
  const [ textareaPosition, setTextareaPosition ] = useState(0);
  const [ submitted, submit ] = useState(false);
  const [ errors, setError ] = useReducer(errorsReducer, {});
  const [ isEdited, edited ] = useState(null);
  const [ values, setValue ] = useReducer(valuesReducer, {
    title: pr.title,
    body: pr.body
  });

  const onBodyChange = (e) => {
    setValue({ value: e.target.value, key: 'body' });
    setTextareaPosition(e.target.selectionStart);
  };
  const addToText = (value) => {
    const text = values.body;
    const before = (text || '').substr(0, textareaPosition);
    const after = (text || '').substr(textareaPosition, text ? text.length : 0);

    setValue({ value: before + value + after, key: 'body' });
    const newPosition = textareaPosition + value.length;

    bodyTextarea.current.focus();

    setTimeout(() => setCaretPosition(bodyTextarea.current, newPosition), 10);
  };
  const edit = async () => {
    let valid = true;

    if (values.title === '') {
      setError({ value: '"title" can not be empty.', key: 'title' });
      valid = false;
    }
    if (valid) {
      submit(true);
      setError(null);
      try {
        await editPR({
          repo,
          title: values.title,
          body: values.body,
          prId: pr.id
        });
        edited(true);
      } catch (error) {
        submit(false);
        setError({ value: error.message ? error.message : error.toString(), key: 'request' });
      }
    }
  };

  if (isEdited) {
    return <Redirect to={ `/repo/${ owner }/${ repo.name }/${ pr.number }` }/>;
  }

  return (
    <div className='pr-card cf'>
      <h1><PULL_REQUEST /> { repo.name }: { pr.title }</h1>
      <hr />
      <div>
        <input
          className={ 'block my1' + (errors.title ? ' error' : '') }
          type='text'
          placeholder='title'
          value={ values.title }
          disabled={ submitted }
          onChange={ (e) => setValue({ value: e.target.value, key: 'title' }) } />
        { errors.title && <div className='error'>{ errors.title }</div> }
      </div>
      <div className='relative'>
        <textarea
          ref={ bodyTextarea }
          className={ 'block my1 type as-input' }
          placeholder='body'
          value={ values.body }
          disabled={ submitted }
          onChange={ onBodyChange }
          onBlur={ (e) => setTextareaPosition(e.target.selectionStart) }
          style={ { height: '570px' } }/>
        { errors.body && <div className='error'>{ errors.body }</div> }
        { !submitted && <Suggestions visible onSelect={ addToText } /> }
      </div>
      <hr />
      { submitted ?
        <LoadingAnimation className='right mt1'/> :
        <button className='brand right' onClick={ edit }>Edit</button> }
      { errors.request && <div className='cf'><div className='error mt1'>{ errors.request }</div></div> }
    </div>
  );
}

PREdit.propTypes = {
  repo: PropTypes.object.isRequired,
  owner: PropTypes.string.isRequired,
  pr: PropTypes.object
};
