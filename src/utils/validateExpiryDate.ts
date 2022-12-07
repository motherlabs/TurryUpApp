import {formatDate} from './dateFormat';

export function validateExpiryDate(targetDate: Date): boolean {
  const date = new Date();

  const foramtCurrentDateArray = formatDate(date).split('-');
  const formatTargetDateArray = formatDate(targetDate).split('-');

  let formatCurrentDate: string = '';
  let formatTargetDate: string = '';
  formatTargetDateArray.map(v => {
    formatTargetDate += v;
  });
  foramtCurrentDateArray.map(v => {
    formatCurrentDate += v;
  });

  if (+formatTargetDate < +formatCurrentDate) {
    return true;
  } else {
    return false;
  }
}
