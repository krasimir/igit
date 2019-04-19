import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getPullingInterval } from './Settings/PullingInterval';

function now() {
  return new Date().getTime();
}

let start = now();

export default function UpdateProgress({ fetchDataInterval }) {
  const [ loadingInterval, setLoadingInterval ] = useState(null);
  const [ percent, setPercent ] = useState(0);

  useEffect(() => {
    clearInterval(loadingInterval);
    start = now();
    setLoadingInterval(setInterval(() => {
      setPercent(Math.ceil((now() - start) / getPullingInterval() * 100));
    }, 1000));
  }, [ fetchDataInterval ]);

  return (
    <div className='update-progress'>
      <div style={ { width: `${ percent > 100 ? 100 : percent }%` } }/>
    </div>
  );
}

UpdateProgress.propTypes = {
  fetchDataInterval: PropTypes.number
};
