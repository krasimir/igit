/* eslint-disable max-len, react/prop-types */
import React from 'react';

export const CHECK = ({ size }) => <svg
  width={ size || 24 }
  height={ size || 24 }
  viewBox='0 0 24 24'
  fill='none'
  stroke='currentColor'
  strokeWidth='2'
  strokeLinecap='round'
  strokeLinejoin='round'
  className='icon'
  >
    <polyline points='20 6 9 17 4 12' />
</svg>;

export const GIT_COMMIT = () => <svg
width='24'
height='24'
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
</svg>;

export const MESSAGE = () => <svg
width='24'
height='24'
viewBox='0 0 24 24'
fill='none'
stroke='currentColor'
strokeWidth='2'
strokeLinecap='round'
strokeLinejoin='round'
className='icon'
>
<path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
</svg>;

export const CORNER_DOWN_RIGHT = ({ size }) => <svg width={ size || 24 } height={ size || 24 } viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><polyline points='15 10 20 15 15 20'/><path d='M4 4v7a4 4 0 0 0 4 4h12' /></svg>;

export const CHEVRON_RIGHT = ({ size }) => <svg width={ size || 24 } height={ size || 24 } viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' ><polyline points='9 18 15 12 9 6'/></svg>;

export const CHEVRON_DOWN = ({ size }) => <svg width={ size || 24 } height={ size || 24 } viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' ><polyline points='6 9 12 15 18 9'/></svg>;

export const EYE = ({ size }) => <svg width={ size || 24 } height={ size || 24 } viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3' /></svg>;

export const PULL_REQUEST = ({ size }) => <svg width={ size || 24 } height={ size || 24 } viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' ><circle cx='18' cy='18' r='3'/><circle cx='6' cy='6' r='3'/><path d='M13 6h3a2 2 0 0 1 2 2v7'/><line x1='6' y1='9' x2='6' y2='21'/></svg>;

export const CHECK_CIRCLE = ({ size }) => <svg width={ size || 24 } height={ size || 24 } viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg>;

export const STORM = ({ size }) => <svg width={ size || 24 } height={ size || 24 } viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9'/><polyline points='13 11 9 17 15 17 11 23'/></svg>;
