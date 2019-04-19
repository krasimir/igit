import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { CHECK } from '../Icons';
import { LoadingAnimation } from '../Loading';
import roger from 'jolly-roger';

export default function ResolveThread({ event, onSuccess }) {
  const { resolveThread, unresolveThread } = roger.useContext();
  const [ submitted, setSubmittedFlag ] = useState(false);

  async function submit() {
    setSubmittedFlag(true);
    if (event.isResolved) {
      await unresolveThread({ threadId: event.id });
      onSuccess(false);
    } else {
      await resolveThread({ threadId: event.id });
      onSuccess(true);
    }
  }

  if (submitted) {
    return <span className='block'><LoadingAnimation /></span>;
  }

  return (
    <button className='as-link opa5 block' onClick={ submit }>
      <CHECK size={ 18 }/>{ event.isResolved ? 'Unresolve conversation' : 'Resolve conversation' }
    </button>
  );
}

ResolveThread.propTypes = {
  event: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  dim: PropTypes.bool
};
ResolveThread.defaultProps = {
  onSuccess: () => {}
};
