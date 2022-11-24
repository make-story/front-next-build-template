/**
 * 이벤트 모듈
 *
 * event options
 *
 * capture?: boolean;
 * once?: boolean;
 * passive?: boolean;
 * mozSystemGroup?: boolean;
 */
export const eventDispatch = (type: string, data: any) => {
  // 이벤트 실행
  document.dispatchEvent(new CustomEvent(type, { detail: data }));
};
export const eventOn = (type: string, listener: any, options: any = {}) => {
  // 이벤트 청취
  document.addEventListener(type, listener, options);
};
export const eventOff = (type: string, listener: any, options: any = {}) => {
  // 이벤트 해제
  document.removeEventListener(type, listener, options);
};
