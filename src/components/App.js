/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
import riew from 'riew/react';

import Loading from './Loading';
import Authorize from './Authorize';
import Settings from './Settings';
import { BASE_PATH, NO_TOKEN } from '../constants';
import { initialize, getProfile, getRepos } from '../logic';
import Repos from './Repos';

const App = riew(
  function ({ profile, repos }) {
    if (profile === null) {
      return <Loading />;
    } else if (profile === NO_TOKEN) {
      return <Authorize />;
    }

    if (repos === null) {
      return <Loading />;
    }

    return (
      <Router basename={ BASE_PATH }>
        <Fragment>
          <Switch>
            <Route path='/settings' component={ Settings } />
            { repos.length === 0 && <Redirect to='/settings' /> }
            <Route path='/repo/:owner/:name/:prNumber/:op' component={ Repos } />
            <Route path='/repo/:owner/:name/:prNumber/files' component={ Repos } />
            <Route path='/repo/:owner/:name/:prNumber' component={ Repos } />
            <Route path='/repo/:owner/:name' component={ Repos } />
            <Route path='/' component={ Repos } />
          </Switch>
        </Fragment>
      </Router>
    );
  },
  async function () {
    await initialize();
  }
).with({ profile: getProfile, repos: getRepos });

export default App;
