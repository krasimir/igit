/* eslint-disable max-len, camelcase */
import React from 'react';

import Logo from './Logo';
import VerifyToken from './VerifyToken';

export default function Authorize() {
  return (
    <VerifyToken>
      {
        (verify, verifying, error) => {
          const handleKeyUp = e => {
            if (e.key === 'Enter' && e.target.value !== '') {
              verify(e.target.value);
            }
          };

          return (
            <div className='authorize centered-content'>
              <Logo />
              <h1 className='tac mb1'>Authorization required</h1>
              <p className='tac'>IGit connects to GitHub via API token.<br />Grab one <a href='https://github.com/settings/tokens' target='_blank'>here</a>, paste it below and hit <em>Enter</em> key.<br /><small>While defining the scopes select <em>repo</em>, <em>read:org</em>, <em>read:repo_hook</em> and <em>read:user</em> checkbox. Otherwise some of the requests that the app is doing will probably fail.</small></p>
              { !verifying && error && <p className='error'>Verification failed! Make sure that you have a valid access token and try again.</p> }
              {
                verifying ?
                  <input type='text' disabled value='Verifying your token. Please wait.' key='verifying'/> :
                  <input type='text' onKeyUp={ handleKeyUp } key='input' autoFocus/>
              }
              <p className='tac'>IGit is a single page app that communicates only with GitHub. The data is stored <strong>only</strong> locally in your browser in a <a href='https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API' target='_blank'>IndexedDB</a> database. There is no remote tracking in any sense. This means that the token that you paste here lives only in your browser and it is used only to communicate via GitHub's API. There are no calls to third parties.</p>
              <p className='tac'>IGit is open source. For feedback and contributions go <a href='https://github.com/krasimir/IGit' target='_blank'>here</a>.</p>
            </div>
          );
        }
      }
    </VerifyToken>
  );
}
