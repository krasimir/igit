import React from 'react';
import Placeholder from './Placeholder';

export default function FakePR() {
  return (
    <div>
      <div className='pr-details opa5'>
        <div className='pr-card'>
          <div className='media'>
            <img src='/img/avatar.png' className='avatar' />
            <div>
              <Placeholder height={10} length={10} />
              <Placeholder className='mt05' height={3} length={10} />
            </div>
          </div>
        </div>
        <nav>
          <a className='selected'>Timeline</a>
          <a>Files</a>
        </nav>
        <div className='timeline'>
          <div className='timeline-thread-comment my03'>
            <div className='media small'>
              <img src='/img/avatar.png' className='avatar' />
              <Placeholder className='pl05' height={3} length={10} />
            </div>
          </div>
          <div className='timeline-thread-comment my03'>
            <div className='media small'>
              <img src='/img/avatar.png' className='avatar' />
              <Placeholder className='pl05' height={3} length={10} />
            </div>
          </div>
          <div className='timeline-thread-comment my03'>
            <div className='media small'>
              <img src='/img/avatar.png' className='avatar' />
              <Placeholder className='pl05' height={3} length={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
