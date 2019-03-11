/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';

import Loading from './Loading';
import Authorize from './Authorize';
import Settings from './Settings';
import Repo from './Repo';
import Header from './Header';
import Dashboard from './Dashboard';
import { NO_TOKEN } from '../constants';
import roger from '../jolly-roger';
import '../logic';

export default function App() {
  const { initialize } = roger.useContext();
  const [ profile ] = roger.useState('profile', null);
  const [ repos ] = roger.useState('repos', null);

  useEffect(() => {
    initialize();
  }, []);

  if (profile === null) {
    return <Loading />;
  } else if (profile === NO_TOKEN) {
    return <Authorize />;
  }

  if (repos === null) {
    return <Loading />;
  }

  return (
    <Router>
      <Fragment>
        <Header profile={ profile } />
        <Switch>
          <Route path='/settings' component={ Settings } />
          { repos.length === 0 && <Redirect to='/settings' /> }
          <Route path='/repo/:id/:prId' component={ Repo } />
          <Route path='/repo/:id' component={ Repo } />
          <Route path='/' component={ Dashboard } />
        </Switch>
      </Fragment>
    </Router>
  );
};
