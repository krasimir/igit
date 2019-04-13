import React, { useState } from 'react';

import ls from '../../api/localStorage';

const DIM_SEEN_EVENTS = 'DIM_SEEN_EVENTS';

export default function useDimSeenEvents() {
  const [ dimKnownEvents, setDimKnownEvents ] = useState(ls.get(DIM_SEEN_EVENTS, { value: true }));

  return {
    dimKnownEvents: dimKnownEvents.value,
    component: (
      <label key='only-new'>
        <input
          type='checkbox'
          checked={ dimKnownEvents.value }
          onChange={ () => {
            const newValue = { value: !dimKnownEvents.value };

            ls.set(DIM_SEEN_EVENTS, newValue);
            setDimKnownEvents(newValue);
          } }/>
        <span>Dim seen events</span>
      </label>
    )
  };
}
