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
// 이벤트 실행
// eventDispatch('EVENT_TYPE', 'TEST');
export const eventDispatch = (type: string, data: any) => {
  document.dispatchEvent(new CustomEvent(type, { detail: data }));
};

// 이벤트 청취
// const listener = ({ detail }: any = {}) => console.log(detail);
// eventOn('EVENT_TYPE', listener);
export const eventOn = (type: string, listener: any, options: any = {}) => {
  document.addEventListener(type, listener, options);
};

// 이벤트 해제
// const listener = ({ detail }: any = {}) => console.log(detail);
// eventOff('EVENT_TYPE', listener);
export const eventOff = (type: string, listener: any, options: any = {}) => {
  document.removeEventListener(type, listener, options);
};
