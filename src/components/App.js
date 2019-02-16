import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getProfile } from '../redux/selectors';
import { NO_TOKEN } from '../redux/constants';
import Loading from './Loading';
import Authorize from './Authorize';

class App extends React.Component {
  render() {
    const { profile } = this.props;

    if (profile === null) {
      return <Loading />;
    } else if (profile === NO_TOKEN) {
      return <Authorize />;
    }

    return (
      <p>Welcome, { profile.name }</p>
    );
  }
}

App.propTypes = {
  profile: PropTypes.any
};

const mapStateToProps = (state) => ({
  profile: getProfile(state)
});

export default connect(mapStateToProps)(App);
