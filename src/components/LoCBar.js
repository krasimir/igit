import React from 'react';
import PropTypes from 'prop-types';

export default function LoCBar({ add, del }) {
  const totalLines = add + del;
  const delPercents = Math.ceil(del / totalLines * 100);
  const style = {
    gridTemplateColumns: `${ delPercents }% ${ 100 - delPercents }%`
  };

  return (
    <div className='loc-bar' style={ style }>
      <div/>
      <div/>
    </div>
  );
}

LoCBar.propTypes = {
  add: PropTypes.number.isRequired,
  del: PropTypes.number.isRequired
};
