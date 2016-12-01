// FIXME(vkramskikh): properly parse time

export function formatTimeAsHoursAndMinutes(time) {
  return time.replace(/^.*?T/, '');
}

export function formatTimeAsDayAndMonth(time) {
  return time.replace(/^\d+-(\d+-\d+)T.*/, '$1');
}
