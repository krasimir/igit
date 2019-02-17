import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';

import { getProfile, getRepos } from '../redux/selectors';
import { NO_TOKEN } from '../redux/constants';
import Loading from './Loading';
import Authorize from './Authorize';
import Repos from './Repos';
import Header from './Header';

class App extends React.Component {
  render() {
    const { profile, numOfRepos } = this.props;

    if (profile === null) {
      return <Loading />;
    } else if (profile === NO_TOKEN) {
      return <Authorize />;
    }

    return (
      <Router>
        <Fragment>
          <Header profile={ profile } />
          <Switch>
            <Route path='/repos' component={ Repos } />
            { numOfRepos === 0 && <Redirect to='/repos' /> }
          </Switch>
        </Fragment>
      </Router>
    );
  }
}

App.propTypes = {
  profile: PropTypes.any,
  numOfRepos: PropTypes.number
};

const mapStateToProps = (state) => ({
  profile: getProfile(state),
  numOfRepos: getRepos(state).length
});

export default connect(mapStateToProps)(App);
