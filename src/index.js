import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import App from './components/App.js'

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('app')
);

if (module && module.hot) {
  module.hot.accept();
}