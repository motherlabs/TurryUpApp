// function getDayOfWeek(date: string){ //ex) getDayOfWeek('2022-06-13')

import {formatTime} from './dateFormat';

export function getBusinessHours(
  dayOff: string,
  businessHours: string,
): '영업중' | '영업종료' {
  const businessHoursArray = businessHours.split(',');
  const date = new Date();
  const week = date.getDay();
  const timeArray = businessHoursArray[week].split('-');
  const currentTime = formatTime(date).replace(':', '');
  const timeStart = timeArray[0].replace(':', '');
  const timeEnd = timeArray[1].replace(':', '');

  let dayBefore: number = 0;
  if (week === 0) {
    dayBefore = 6;
  } else {
    dayBefore = week - 1;
  }
  const beforeTimeArray = businessHoursArray[dayBefore].split('-');
  const beforeTimeEnd = beforeTimeArray[1].replace(':', '');

  //오늘 휴뮤 여부
  if (dayOff.includes(week.toString())) {
    //오늘 휴무며 전날 휴무 여부
    if (dayOff.includes(dayBefore.toString())) {
      return '영업종료';
    } else {
      //전날 휴무 아니고 전날 새벽장사 여부
      if (beforeTimeEnd.charAt(0) === '0') {
        //새벽장사 하고 시간계산
        if (+currentTime <= +beforeTimeEnd) {
          return '영업중';
        } else {
          return '영업종료';
        }
      } else {
        return '영업종료';
      }
    }
  } else {
    //오늘 휴무 아니지만 전날 휴무여부
    if (dayOff.includes(dayBefore.toString())) {
      //전날 휴무며 오늘날짜 영업계산
      if (timeEnd.charAt(0) === '0') {
        if (+currentTime >= +timeStart) {
          return '영업중';
        } else {
          return '영업종료';
        }
      } else if (+currentTime >= +timeStart && +currentTime <= +timeEnd) {
        return '영업중';
      } else {
        return '영업종료';
      }
    } else {
      // 전날 휴무아니고 전날 새벽장사 하는지
      if (beforeTimeEnd.charAt(0) === '0') {
        if (+currentTime <= +beforeTimeEnd) {
          return '영업중';
        } else if (timeEnd.charAt(0) === '0') {
          //전날 새벽장사 끝났으며 오늘자 영업계산(새벽까지 하는경우)
          if (+currentTime >= +timeStart) {
            return '영업중';
          } else {
            return '영업종료';
          }
        } else if (+currentTime >= +timeStart && +currentTime <= +timeEnd) {
          //오늘자 영업계산(새벽까지 안하는경우)
          return '영업중';
        } else {
          return '영업종료';
        }
      } else if (timeEnd.charAt(0) === '0') {
        //전날 새벽장사 안하며 오늘 영업계산(새벽까지 하는경우)
        if (+currentTime >= +timeStart) {
          return '영업중';
        } else {
          return '영업종료';
        }
      } else if (+currentTime >= +timeStart && +currentTime <= +timeEnd) {
        // 오늘 영업계산(새벽까지 안하는경우)
        return '영업중';
      } else {
        return '영업종료';
      }
    }
  }
}

export function getBusinessHoursTime(businessHours: string): string {
  const businessHoursArray = businessHours.split(',');
  const date = new Date();
  const week = date.getDay();
  return businessHoursArray[week];
}
