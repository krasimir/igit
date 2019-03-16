/* eslint-disable max-len */

const monthNames = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
];
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

function fcn(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

export function formatDate(str, noTime = false) {
  const date = new Date(str);
  const day = date.getDate();
  const year = date.getFullYear();
  const dayOfTheWeek = days[date.getDay()];

  return fcn(day) + ' ' + monthNames[date.getMonth()] + ' (' + dayOfTheWeek + ') ' + year +
    (noTime ? '' : ', ' + fcn(date.getHours()) + ':' + fcn(date.getMinutes()));
}

export function formatDateShort(str) {
  const date = new Date(str);
  const day = date.getDate();
  const month = monthNames[date.getMonth()];

  return `${ day } ${ month }`;
}
