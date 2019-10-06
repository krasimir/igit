/* eslint-disable max-len, consistent-return, handle-callback-err */
import React, { useState, useRef, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import riew from 'riew/react';

import { PULL_REQUEST } from './Icons';
import Suggestions from './Suggestions';
import setCaretPosition from './utils/setCaretPosition';
import { LoadingAnimation } from './Loading';

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

function PRNew({ repo, owner, pr, api, createPR }) {
  const headInput = useRef(null);
  const bodyTextarea = useRef(null);
  const [ textareaPosition, setTextareaPosition ] = useState(0);
  const [ submitted, submit ] = useState(false);
  const [ newPR, setNewPR ] = useState(null);
  const [ gettingTemplateInProgress, gettingTemplate ] = useState(true);
  const [ textareaPlaceholder, setTextareaPlaceholder ] = useState(`Getting the pull request template for ${ repo.nameWithOwner }...`);
  const [ errors, setError ] = useReducer(errorsReducer, {});
  const [ values, setValue ] = useReducer(valuesReducer, {
    base: 'master',
    head: '',
    title: '',
    body: ''
  });

  useEffect(() => {
    headInput.current.focus();
    api.fetchPRFile(repo, '.github/PULL_REQUEST_TEMPLATE.md').then(
      prTemplate => {
        setValue({ value: prTemplate, key: 'body' });
        gettingTemplate(false);
        setTextareaPlaceholder('body');
      },
      error => {
        gettingTemplate(false);
        setTextareaPlaceholder('body');
      }
    );
  }, []);

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
  const create = async () => {
    let valid = true;

    if (values.base === '') {
      setError({ value: '"base" can not be empty.', key: 'base' });
      valid = false;
    }
    if (values.head === '') {
      setError({ value: '"head" can not be empty.', key: 'head' });
      valid = false;
    }
    if (values.title === '') {
      setError({ value: '"title" can not be empty.', key: 'title' });
      valid = false;
    }
    if (valid) {
      submit(true);
      setError(null);
      try {
        const pr = await createPR({
          repo,
          title: values.title,
          body: values.body,
          base: values.base,
          head: values.head
        });

        setNewPR(pr);
      } catch (error) {
        submit(false);
        setError({ value: error.message ? error.message : error.toString(), key: 'request' });
      }
    }
  };

  if (newPR) {
    return <Redirect to={ `/repo/${ owner }/${ repo.name }/${ newPR.number }` }/>;
  }

  return (
    <div className='pr-card cf'>
      <h1><PULL_REQUEST /> { repo.name }: new pull request</h1>
      <hr />
      <div>
        <input
          className={ 'block my1' + (errors.base ? ' error' : '') }
          type='text'
          placeholder='base'
          value={ values.base }
          disabled={ submitted }
          onChange={ (e) => setValue({ value: e.target.value, key: 'base' }) } />
        { errors.base && <div className='error'>{ errors.base }</div> }
      </div>
      <div>
        <input
          ref={ headInput }
          className={ 'block my1' + (errors.head ? ' error' : '') }
          type='text'
          placeholder='head'
          value={ values.head }
          disabled={ submitted }
          onChange={ (e) => setValue({ value: e.target.value, key: 'head' }) } />
        { errors.head && <div className='error'>{ errors.head }</div> }
      </div>
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
          placeholder={ textareaPlaceholder }
          value={ values.body }
          disabled={ submitted || gettingTemplateInProgress }
          onChange={ onBodyChange }
          onBlur={ (e) => setTextareaPosition(e.target.selectionStart) }
          style={ { height: '570px' } }/>
        { errors.body && <div className='error'>{ errors.body }</div> }
        { !submitted && <Suggestions visible onSelect={ addToText } /> }
      </div>
      <hr />
      { submitted ?
        <LoadingAnimation className='right mt1'/> :
        <button className='brand right' onClick={ create }>Create</button> }
      { errors.request && <div className='cf'><div className='error mt1'>{ errors.request }</div></div> }
    </div>
  );
}

PRNew.propTypes = {
  repo: PropTypes.object.isRequired,
  owner: PropTypes.string.isRequired,
  api: PropTypes.object.isRequired,
  pr: PropTypes.object,
  createPR: PropTypes.func.isRequired
};

export default riew(PRNew).with('api', 'createPR');
