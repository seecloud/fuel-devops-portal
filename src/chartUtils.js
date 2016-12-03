
export function getFormatTime(period) {
  if (period === 'day') return formatTimeAsHoursAndMinutes;
  if (period === 'week') return formatTimeAsDayOfWeek;
  return formatTimeAsDayAndMonth;
}

export function formatTimeAsHoursAndMinutes(time, index) {
  if (index % 6) return null;
  return time.replace(/^.*?T/, '');
}

export function formatTimeAsDayOfWeek(time, index) {
  if (index % 2) return null;
  let d = new Date(time);
  return d.getDate() + '/' + d.toLocaleString('en-us', {month: 'short'});
}

export function formatTimeAsDayAndMonth(time, index) {
  if (index % 6 && index !== 0) return null;
  let d = new Date(time);
  return d.getDate() + '/' + d.toLocaleString('en-us', {month: 'short'});
}
