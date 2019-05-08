import React from 'react';
import PropTypes from 'prop-types';

import Lines, { createLine, createTable } from './Lines';

function toCodeItem(historyItem) {
  const table = createTable();
  const lines = historyItem.content.split('\n');

  table.rows = lines.map((lineContent, lineNumber) => createLine('', lineNumber, lineContent, 'normal'));

  return table;
}

export default function Film({ history }) {
  const items = history.map(toCodeItem);

  return <Lines items={ items } />;
}

Film.propTypes = {
  history: PropTypes.array.isRequired
};
