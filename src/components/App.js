import React from 'react';
import { connect, Provider } from 'react-redux';

import { getProfile } from '../redux/selectors';
import Loading from './Loading';

class App extends React.Component {
  render() {
    const { profile } = this.props;

    if (profile === null) {
      return <Loading />;
    }

    return (
      <p>He</p>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: getProfile(state)
})

export default connect(mapStateToProps)(App);
