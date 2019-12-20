/* eslint-disable max-len */
import React, { useState } from 'react';

import ls from '../../api/localStorage';

const PULLING_INTERVAL = 'PULLING_INTERVAL';
const DEFAULT_VALUE = 120000;

export default function PullingInterval() {
  const interval = ls.get(PULLING_INTERVAL, { value: DEFAULT_VALUE });
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const newValue = parseInt(e.target.value, 10);

    if (isNaN(newValue)) {
      setError('Not a number.');
    } else if (newValue < 5000) {
      setError('The value can not be less then 5 seconds.');
    } else {
      setError(null);
      ls.set(PULLING_INTERVAL, { value: newValue });
    }
  };

  return (
    <React.Fragment>
      <div className='px05'>
        Pulling data interval
        <br />
        <small>
          This is the interval which is used between the requests to GitHub's API. It's in milliseconds. Have in mind
          that smaller interval will result in more requests to the API which has a{' '}
          <a href='https://developer.github.com/v4/guides/resource-limitations/' target='_blank'>
            rate limit
          </a>
          .
        </small>
        <input
          className={'block my1' + (error ? ' error' : '')}
          type='text'
          placeholder='interval'
          defaultValue={interval.value}
          onChange={onChange}
        />
        {error && <div className='error'>{error}</div>}
      </div>
    </React.Fragment>
  );
}

export function getPullingInterval() {
  const interval = ls.get(PULLING_INTERVAL, { value: DEFAULT_VALUE });

  return interval.value;
}
