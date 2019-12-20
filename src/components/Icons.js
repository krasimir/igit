/* eslint-disable max-len, react/prop-types */
import React from 'react';

export const CHECK = ({ size, color }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color ? color : 'currentColor'}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='icon'
  >
    <polyline points='20 6 9 17 4 12' />
  </svg>
);

export const GIT_COMMIT = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='icon'
  >
    <circle cx='12' cy='12' r='4' />
    <line x1='1.05' y1='12' x2='7' y2='12' />
    <line x1='17.01' y1='12' x2='22.96' y2='12' />
  </svg>
);

export const MESSAGE = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='icon'
  >
    <path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
  </svg>
);

export const CORNER_DOWN_RIGHT = ({ size, style }) => (
  <svg
    style={style || {}}
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='15 10 20 15 15 20' />
    <path d='M4 4v7a4 4 0 0 0 4 4h12' />
  </svg>
);

export const CHEVRON_RIGHT = ({ size, style }) => (
  <svg
    style={style || {}}
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='9 18 15 12 9 6' />
  </svg>
);

export const CHEVRON_DOWN = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='6 9 12 15 18 9' />
  </svg>
);

export const EYE = ({ size, color }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color ? color : 'currentColor'}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
    <circle cx='12' cy='12' r='3' />
  </svg>
);

export const PULL_REQUEST = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='18' cy='18' r='3' />
    <circle cx='6' cy='6' r='3' />
    <path d='M13 6h3a2 2 0 0 1 2 2v7' />
    <line x1='6' y1='9' x2='6' y2='21' />
  </svg>
);

export const CHECK_CIRCLE = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
    <polyline points='22 4 12 14.01 9 11.01' />
  </svg>
);

export const STORM = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9' />
    <polyline points='13 11 9 17 15 17 11 23' />
  </svg>
);

export const EDIT = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M12 20h9' />
    <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
  </svg>
);

export const GIT_MERGE = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='18' cy='18' r='3' />
    <circle cx='6' cy='6' r='3' />
    <path d='M6 21V9a9 9 0 0 0 9 9' />
  </svg>
);

export const CLIPBOARD = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
    <rect x='8' y='2' width='8' height='4' rx='1' ry='1' />
  </svg>
);

export const CLOSE = ({ size, color }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color ? color : 'currentColor'}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
  </svg>
);

export const ARROW_RIGHT_CIRCLE = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='10' />
    <polyline points='12 16 16 12 12 8' />
    <line x1='8' y1='12' x2='16' y2='12' />
  </svg>
);

export const MORE_HORIZONTAL = ({ size }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='1' />
    <circle cx='19' cy='12' r='1' />
    <circle cx='5' cy='12' r='1' />
  </svg>
);

export const CIRCLE = ({ size, color }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color ? color : 'currentColor'}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='10' />
  </svg>
);

export const PLUS = ({ size, color, style }) => (
  <svg
    style={style || {}}
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color ? color : 'currentColor'}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
    <line x1='12' y1='8' x2='12' y2='16' />
    <line x1='8' y1='12' x2='16' y2='12' />
  </svg>
);

export const GITHUB = ({ size, color, style }) => (
  <svg
    style={style || {}}
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
  </svg>
);

export const MAXIMIZE_ARROWS = ({ size, color, style }) => (
  <svg
    style={style || {}}
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokewidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='15 3 21 3 21 9' />
    <polyline points='9 21 3 21 3 15' />
    <line x1='21' y1='3' x2='14' y2='10' />
    <line x1='3' y1='21' x2='10' y2='14' />
  </svg>
);

export const ARROW_UP_RIGHT = ({ size, color, style }) => (
  <svg
    style={style || {}}
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <line x1='7' y1='17' x2='17' y2='7' />
    <polyline points='7 7 17 7 17 17' />
  </svg>
);

export const MAXIMIZE = ({ size, color, style }) => (
  <svg
    style={style || {}}
    width={size || 24}
    height={size || 24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3' />
  </svg>
);
