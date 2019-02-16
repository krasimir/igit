/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Logo from './Logo';
import { verifyAccessToken } from '../redux/actions';

class Authorize extends React.Component {
  constructor(props) {
    super(props);

    this.onInputKeyUp = this.onInputKeyUp.bind(this);
    this.state = { verifying: false };
  }
  componentDidMount() {
    if (this.accessTokenInput) {
      this.accessTokenInput.focus();
    }
  }
  onInputKeyUp(e) {
    if (e.key === 'Enter' && this.accessTokenInput.value !== '') {
      this.setState({ verifying: true });
      this.props.verifyAccessToken(this.accessTokenInput.value);
    }
  }
  render() {
    return (
      <div className='authorize centered-content'>
        <Logo />
        <h1 className='tac'>Authorization required</h1>
        <p className='tac'>GitHorn connects to GitHub via API token.<br />Grab one <a href='https://github.com/settings/tokens' target='_blank'>here</a>, paste it below and hit <em>Enter</em> key.<br /><small>While defining the scopes select the <em>repo</em> checkbox. Otherwise some of the requests that the app is doing will probably fail.</small></p>
        {
          this.state.verifying ?
            <input type='text' disabled value='Verifying your token. Please wait.' key='verifying'/> :
            <input type='text' ref={ (e) => (this.accessTokenInput = e) } onKeyUp={ this.onInputKeyUp } key='input'/>
        }
        <p className='tac'>GitHorn is a single page app that communicates only with GitHub. The data is stored locally in your browser <strong>only</strong> in a <a href='https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API' target='_blank'>IndexedDB</a> database. This means that the token that you paste here lives only in your browser and it is used only to communicate via GitHub's API. There are no calls to third parties. This sounds good from a security point of view but also means that if you purge the data of your browser you'll lose all the work done in GitHorn. <br />This is intentional and by design.</p>
        <p>GitHorn is open source. For feedback and contributions go <a href='https://github.com/krasimir/githorn' target='_blank'>here</a>.</p>
      </div>
    );
  }
}

Authorize.propTypes = {
  verifyAccessToken: PropTypes.func.isRequired
};

export default connect(
  null,
  dispatch => ({
    verifyAccessToken: token => dispatch(verifyAccessToken(token))
  })
)(Authorize);
