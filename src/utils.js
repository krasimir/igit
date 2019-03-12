var monthNames = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
];

function fcn(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

export function formatDate(str, noTime = false) {
  var date = new Date(str);
  var day = date.getDate();
  var year = date.getFullYear();

  return day + ' ' + monthNames[date.getMonth()] + ' ' + year +
    (noTime ? '' : ', ' + fcn(date.getHours()) + ':' + fcn(date.getMinutes()));
}
