import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import App from './components/App.js';
import Context from './context';

ReactDOM.render(
  <Context.Provider>
    <Provider store={ store }>
      <App />
    </Provider>
  </Context.Provider>,
  document.getElementById('app')
);

if (module && module.hot) {
  module.hot.accept();

  module.hot.addStatusHandler(status => {
    if (status === 'prepare') console.clear();
  });
}
