import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

if (module && module.hot) {
  module.hot.accept();

  module.hot.addStatusHandler(status => {
    if (status === 'prepare') console.clear();
  });
}
