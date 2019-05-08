import React from 'react';

import { Switch, Route } from 'react-router-dom';
import Film from '../Files/Film';

import fileHistory from './mocks/fileHistory.json';

const FilmPlayground = () => (
  <div style={ { width: '765px' } }>
    <Film history={ fileHistory } />
  </div>
);

export default function Playground() {
  return (
    <Switch>
      <Route path='/playground/film' component={ FilmPlayground } />
    </Switch>
  );
};
