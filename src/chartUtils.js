import prettyBytes from 'pretty-bytes';

export function formatTimeAsHoursAndMinutes(time) {
  let d = new Date(time);
  return ('0' + d.getUTCHours()).substr(-2) + ':' + ('0' + d.getUTCMinutes()).substr(-2);
}

export function formatTimeAsDayOfWeek(time) {
  let d = new Date(time);
  return d.getDate() + '/' + d.toLocaleString('en-us', {month: 'short'});
}

export function formatTimeAsDayAndMonth(time) {
  let d = new Date(time);
  return d.getDate() + '/' + d.toLocaleString('en-us', {month: 'short'});
}

export const timeFormattersByPeriod = {
  day: formatTimeAsHoursAndMinutes,
  week: formatTimeAsDayOfWeek,
  month: formatTimeAsDayAndMonth
};

export function formatResponseSize(size) {
  return Number.isFinite(size) ? prettyBytes(size) : '';
}

export function formatResponseTime(time) {
  return Math.round(time * 1000);
}
