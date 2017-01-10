import prettyBytes from 'pretty-bytes';
import moment from 'moment';

export function formatDateAsHoursAndMinutes(time) {
  return moment(time).format('HH:mm');
}

export function formatDateAsDayOfWeek(time) {
  return moment(time).format('MMM D');
}

export function formatDateAsDayAndMonth(time) {
  return moment(time).format('MMM D');
}

export const dateFormattersByPeriod = {
  day: formatDateAsHoursAndMinutes,
  week: formatDateAsDayOfWeek,
  month: formatDateAsDayAndMonth
};

export function formatResponseSize(size) {
  return Number.isFinite(size) ? prettyBytes(size) : '';
}

export function formatResponseTime(time) {
  return Math.round(time * 1000);
}
