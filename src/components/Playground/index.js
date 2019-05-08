import React from 'react';

import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';

export default function Playground() {
  return (
    <Switch>
      <Route path='/playground/film' component={ Film } />
    </Switch>
  );
};
