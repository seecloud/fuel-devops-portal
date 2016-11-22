import {times} from 'lodash';

export function generateFCIScore() {
  return times(10, () => 1 - Math.random() / 10);
}

export function generateAvailability() {
  return times(10, () => 1 - Math.random() / 5);
}

export function generateResponseTime() {
  return times(10, () => Math.random() * 2000);
}

export function generateResponseSize() {
  return times(10, () => Math.random() * 10000);
}

export function generateAPICalls() {
  return times(10, () => 5000 + Math.random() * 5000);
}
