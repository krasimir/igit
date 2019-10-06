import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import riew from 'riew/react';

import { PLUS } from './Icons';
import emojis from '../emoji.json';

const pushUser = (arr, user) => {
  if (user && user.login && arr.indexOf(user.login) < 0) {
    arr.push(user.login);
  }
};

function Suggestions({ visible, onSelect, repos }) {
  const filterInput = useRef(null);
  const [ opened, open ] = useState(false);
  const [ filterText, setFilterText ] = useState('');

  if (!visible && !opened) return null;

  const users = repos()
    .reduce((result, repo) => {
      if (repo.prs) {
        repo.prs.forEach(pr => {
          pushUser(result, pr.author);
          pr.events.forEach(event => {
            pushUser(result, event.author);
          });
        });
      }
      return result;
    }, [])
    .filter(login => {
      if (filterText.length === 0) return false;
      return login.match(new RegExp(filterText, 'gi'));
    });

  const emojisToRender = Object.keys(emojis).filter(emojiLabel => {
    if (filterText.length < 3) return false;
    return emojiLabel.match(new RegExp(filterText, 'gi'));
  });

  function onPlusClick() {
    open(!opened);
    setTimeout(() => {
      if (filterInput && filterInput.current) {
        filterInput.current.focus();
      }
    }, 1);
  }
  function onInputKeyDown(e) {
    if (e.keyCode === 27) {
      open(false);
      setFilterText('');
    }
  }
  function select(value) {
    onSelect(value);
    open(false);
    setFilterText('');
  }

  return (
    <div className='suggestions'>
      <a className='no-hover block right' onClick={ onPlusClick }>
        <PLUS color={ opened ? '#999' : '#e2e2e2' } />
      </a>
      <div className='cf' />
      { opened && <section>
        <input
          placeholder='username or emoji'
          type='text'
          ref={ filterInput }
          onChange={ (e) => setFilterText(e.target.value) }
          onKeyDown={ onInputKeyDown }/>
        <div className='suggestions-items mt05'>
          {
            users.map(userLoginName => (
              <a key={ userLoginName } onClick={ () => select(`@${ userLoginName }`) }>{ userLoginName }</a>
            ))
          }
        </div>
        { emojisToRender.length > 0 &&
          <div className='suggestions-items mt05 pt05' style={ { maxHeight: '98px', overflowY: 'scroll' } }>
            {
              emojisToRender.map(emojiLabel => (
                <a key={ emojiLabel } onClick={ () => select(emojis[emojiLabel]) }>{ emojis[emojiLabel] }</a>
              ))
            }
          </div> }
      </section> }
    </div>
  );
}

Suggestions.defaultProps = {
  visible: true
};

Suggestions.propTypes = {
  visible: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  repos: PropTypes.func.isRequired
};

export default riew(Suggestions).with('repos');
