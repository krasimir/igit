import React from 'react';
import PropTypes from 'prop-types';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default function Placeholder({ height, length, className }) {
  const items = [];

  for (let i = 0; i < length; i++) {
    items.push(
      <span key={ i } style={ { height: height + 'px', width: getRandom(30, 200) + 'px'} } />
    );
  }

  return (
    <div className={ `placeholder ${ className }` }>
      { items }
    </div>
  );
};

Placeholder.propTypes = {
  height: PropTypes.number,
  length: PropTypes.number,
  className: PropTypes.string
};

Placeholder.defaultProps = {
  height: 10,
  length: 4
};
