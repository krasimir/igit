import React from 'react';
import ReactDOM from 'react-dom';

const title = 'Hello2';

ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('app')
);

if (module && module.hot) {
  module.hot.accept();
}