import prettyBytes from 'pretty-bytes';
import moment from 'moment';

export function formatDateAsHoursAndMinutes(date) {
  return moment(date).format('HH:mm');
}

export function formatDateAsDayOfWeek(date) {
  return moment(date).format('MMM D');
}

export function formatDateAsDayAndMonth(date) {
  return moment(date).format('MMM D');
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
