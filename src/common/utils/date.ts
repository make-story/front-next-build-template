/**
 * milliseconds -> 시, 분, 초 변환
 * @param milliseconds
 * @returns
 */
export const changeMsToTime = (milliseconds: number) => {
  function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  // new Date(milliseconds).toISOString().slice(11, 19); // HH:MM:SS
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  return {
    hours: padTo2Digits(hours),
    minutes: padTo2Digits(minutes),
    seconds: padTo2Digits(seconds),
  };
};

/**
 * 한국시간
 */
export const getKoreaStandardTime = (): Date => {
  // 1. 현재 시간(Locale)
  const date = new Date();

  // 2. UTC 시간 계산
  // getTimezoneOffset() 함수는 현재 사용자 PC 설정 시간대로부터 UTC 시간까지의 차이를 '분'단위로 리턴
  // getTime() 함수는 '1970년 1월1 일 00:00:00 UTC'로부터 주어진 시간 사이의 경과시간(밀리초)를 리턴
  const UTC = date.getTime() + date.getTimezoneOffset() * 60 * 1000;

  // 3. UTC to KST (UTC + 9시간)
  // 한국 시간(KST)은 UTC시간보다 9시간 더 빠름
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const dateKR = new Date(UTC + KR_TIME_DIFF);

  return dateKR;
};

/**
 * D-Day
 */
export interface IDDayResult {
  targetDate: Date | null;
  referenceDate: Date;
  timeDifference: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
}
export const getDDay = (
  targetDate: string | Date,
  { referenceDate = new Date() }: { referenceDate?: Date } = {},
): IDDayResult => {
  const result: IDDayResult = {
    targetDate: null, // D-Day 대상 날짜
    referenceDate, // 기준일자 (대부분 현재)
    timeDifference: 0, // 시간차이
    day: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  // D-Day 날짜 지정
  targetDate = targetDate instanceof Date ? targetDate : new Date(targetDate);
  // 'Invalid Date' 잘못된 Date 형식 확인
  if (isNaN(targetDate.getTime())) {
    return result;
  }
  result.targetDate = targetDate;

  // D-Day 날짜에서 현재 날짜의 차이를 getTime 메서드를 사용해서 밀리초의 값으로 가져온다.
  result.timeDifference = result.targetDate.getTime() - result.referenceDate.getTime();

  // D-day 날짜의 연,월,일 구하기
  //const dateYear = targetDate.getFullYear();
  //const dateMonth = targetDate.getMonth() + 1; // getMonth 메서드는 0부터 세기 때문에 +1 해준다.
  //const dateDay = targetDate.getDate();

  // Math.floor 함수를 이용해서 근접한 정수값을 가져온다.
  // 밀리초 값이기 때문에 1000을 곱한다.
  // 1000*60 => 60초(1분)*60 => 60분(1시간)*24 = 24시간(하루)
  // 나머지 연산자(%)를 이용해서 시/분/초를 구한다.
  result.day = Math.floor(result.timeDifference / (1000 * 60 * 60 * 24));
  result.hours = Math.floor((result.timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  result.minutes = Math.floor((result.timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  result.seconds = Math.floor((result.timeDifference % (1000 * 60)) / 1000);

  return result;
};

/**
 * 24시(자정)까지 남은 시간(분)
 */
export const getMidnightMinutes = (now: Date = new Date()): number => {
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0);
  const difference = midnight.getTime() - now.getTime(); // 밀리 초
  let minutes = Math.ceil(difference / (1000 * 60)); // 분
  if (minutes <= 0) {
    minutes = 60 * 24; // 24시간(분)
  }
  return minutes;
};
