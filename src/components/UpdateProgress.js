import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getPullingInterval } from './Settings/PullingInterval';

function now() {
  return new Date().getTime();
}

let start = now();

export default function UpdateProgress({ numberOfFetches }) {
  const [loadingInterval, setLoadingInterval] = useState(null);
  const [percent, setPercent] = useState(0);
  const pullingInterval = getPullingInterval();

  useEffect(() => {
    clearInterval(loadingInterval);
    start = now();
    setLoadingInterval(
      setInterval(() => {
        setPercent(Math.ceil(((now() - start) / pullingInterval) * 100));
        if (pullingInterval < now() - start) {
          start = now();
        }
      }, 1000)
    );
  }, [numberOfFetches]);

  return (
    <div className='update-progress'>
      <div style={{ width: `${percent > 100 ? 100 : percent}%` }} />
    </div>
  );
}

UpdateProgress.propTypes = {
  numberOfFetches: PropTypes.number
};
