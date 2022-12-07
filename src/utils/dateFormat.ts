import moment from 'moment';
import 'moment/locale/ko';

export function fromNow(createdAt: Date) {
  if (moment(createdAt).fromNow().includes('몇 초 전')) {
    return '방금';
  } else {
    return moment(createdAt).fromNow();
  }
}

export function formatKR(createdAt: Date) {
  return moment(createdAt).format('YYYY.MM.DD');
}

export function formatDate(createdAt: Date) {
  return moment(createdAt).format('YYYY-MM-DD');
}

export function formatTime(date: Date) {
  return moment(date).format('HH:mm');
}

export function formatRemainingExpiryDateKR(date: Date) {
  const currentDate = new Date();
  const currentYear = +moment(currentDate).format('YYYY');
  const currnetMonth = +moment(currentDate).format('MM');
  const currentDay = +moment(currentDate).format('DD');
  const currentHour = +moment(currentDate).format('HH');
  const currentMinute = +moment(currentDate).format('mm');

  const betweenTime = Math.floor(
    (new Date(date).getTime() -
      new Date(
        currentYear,
        currnetMonth === 0 ? 11 : currnetMonth - 1,
        currentDay,
        currentHour + 9,
        currentMinute,
      ).getTime() +
      86400000) /
      1000 /
      60,
  );
  const betweenHour = Math.floor(betweenTime / 60);
  const betweenDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTime <= 0) {
    return `유통기한 ${formatKR(date).slice(2, 10)}`;
  } else if (betweenTime <= 60) {
    return `유통기한 ${betweenTime}분 남음`;
  } else if (betweenHour <= 72) {
    return `유통기한 ${betweenHour}시간 남음`;
  } else if (betweenDay <= 30) {
    return `유통기한 ${betweenDay}일 남음`;
  } else {
    return `유통기한 ${formatKR(date).slice(2, 10)}`;
  }
}
export function formatValidateTime(date: Date) {
  return moment(date).format('HH:mm');
}

export function formatMonthDay(date: Date) {
  return moment(date).format('MM월 DD일');
}
