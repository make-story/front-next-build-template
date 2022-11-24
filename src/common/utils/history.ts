/**
 * 히스토리 관련
 * IE10 이상이면 history.replaceState 저장, 이하이면 IE8 이상 지원하는 sessionStorage 저장
 * IOS 등에서 터치(플리킹)로 뒤로가기를 했을 경우 BFCache 활용됨
 * (IOS nitro엔진 WKWebview는 히스토리백시 BFCache를 사용)
 *
 * Page Lifecycle
 * https://developers.google.com/web/updates/2018/07/page-lifecycle-api
 *
 * BF Cache
 * https://web.dev/bfcache/
 * 비활성화 Cache-Control: no-store
 * onpageshow 이벤트를 통해 BFCache 여부를 알 수 있다하더라도,
 * 페이지이동 -> 뒤로가기로 BFCache 페이지 진입 -> 다시 페이지 이동 -> 뒤로가기로 BFCache 이력이 있던 페이지 진입
 * onpageshow 이벤트도 실행되지 않는다. (즉, BFCache 를 onpageshow 이벤트로 두번이상 부터는 알 수 없다.)
 */
import { eventDispatch } from './event';

let isBFCache: boolean | null = null;

/**
 * 상태 업데이트 타입
 */
export const HISTORY_ACTION_TYPE = {
  BF_CACHE_STATE_UPDATE: 'BF_CACHE_STATE_UPDATE',
  PAGE_HIDE: 'PAGE_HIDE',
};

/**
 * 스크롤 위치 복원 기능 값 설정
 */
export const setScrollRestoration = (value: 'manual' | 'auto' = 'manual') => {
  if (typeof window !== 'undefined' && window.history.scrollRestoration) {
    window.history.scrollRestoration = value;
  }
};

/**
 * page change
 */
// 현재 페이지 URL 정보
const getPageURL = () => {
  return window.location.href.split('?')?.shift() || '';
};
interface IScrollLeftTop {
  left?: number;
  top?: number;
}
const HISTORY_AMORE_SCROLL = 'HISTORY_AMORE_SCROLL';
// window 스크롤 값 반환
// TODO: 오버플로우 스크롤 설정된 element 의 경우 대응필요
export const getScroll = (element?: any) => {
  return {
    left: window.pageXOffset || window.scrollX,
    top: window.pageYOffset || window.scrollY,
  };
};
// window 스크롤 값 브라우저 스토리지에 저장
export const setHistoryWindowScroll = (
  { left, top }: IScrollLeftTop = getScroll(),
  { key = `${HISTORY_AMORE_SCROLL}_${getPageURL()}` }: { key?: string } = {},
) => {
  //console.log(`scroll left: ${left}, top: ${top}`);
  window.sessionStorage.setItem(key, JSON.stringify({ left, top }));
};
// window 스크롤 값 브라우저 스토리지에서 불러오기
export const getHistoryWindowScroll = ({
  key = `${HISTORY_AMORE_SCROLL}_${getPageURL()}`,
}: { key?: string } = {}): IScrollLeftTop => {
  //window.pageYOffset || window.scrollY || document.documentElement.scrollTop
  let scroll: any = window.sessionStorage.getItem(key);
  if (scroll) {
    scroll = JSON.parse(scroll) || {};
    return { left: Number(scroll.left) || 0, top: Number(scroll.top) || 0 };
  } else {
    return { left: 0, top: 0 };
  }
};

// 현재 페이지 BFCache 이력
const HISTORY_AMORE_BFCACHE = 'HISTORY_AMORE_BFCACHE';
// BFCache 된 페이지 였는지 이력 브라우저 스토리지에 저장
const setHistoryBFCache = (
  isBFCache: null | boolean,
  { key = `${HISTORY_AMORE_BFCACHE}_${getPageURL()}` }: { key?: string } = {},
) => {
  window.sessionStorage.setItem(key, String(isBFCache));
};
// BFCache 페이지 이력 브라우저 스토리지에서 불러오기
const getHistoryBFCache = ({ key = `${HISTORY_AMORE_BFCACHE}_${getPageURL()}` }: { key?: string } = {}) => {
  return window.sessionStorage.getItem(key);
};

/**
 * BFCache
 * pageshow, pagebeforeshow, pagebeforehide, pagehide 이벤트
 * https://developer.mozilla.org/en-US/docs/Web/Events/pagehide
 * https://developer.mozilla.org/en-US/docs/Web/Events/pageshow
 */
if (typeof window !== 'undefined') {
  // pageshow
  window.addEventListener('pageshow', (event: PageTransitionEvent) => {
    //console.log('event', event);
    //console.log('referrer', document.referrer);
    if (event.persisted) {
      //console.log('BFCache');
      isBFCache = true;
    } else {
      //console.log('새로 진입');
      isBFCache = false;
    }
    console.log('history > BFCache', isBFCache);
    console.log('history > referrer', document?.referrer);
    eventDispatch(HISTORY_ACTION_TYPE.BF_CACHE_STATE_UPDATE, isBFCache);
  });

  // hashchange
  /*window.addEventListener('hashchange', (event: any) => {
    console.log('history > hashchange');
  });*/

  // beforeunload
  /*window.addEventListener('beforeunload', (event) => { // 취소 가능한 이벤트 (사용자 페이지 이탈을 막을 수 있음)
		console.log('history > beforeunload', event);
  });*/

  // pagehide
  // unload (beforeunload 이벤트는 제외) 사용하지 않은 이유 : 브라우저는 페이지에 unload 이벤트 리스너가 추가되어 있는 경우, bfcache에 적합하지 않은 페이지로 판단하는 경우가 많다.
  window.addEventListener('pagehide', (event: PageTransitionEvent) => {
    console.log('history > pagehide');
    setHistoryBFCache(isBFCache);
    eventDispatch(HISTORY_ACTION_TYPE.PAGE_HIDE, isBFCache);
  });

  /**
   * popstate 이벤트
   * popstate 이벤트는 브라우저의 백 버튼이나 (history.back() 호출) 등을 통해서만 발생 (history.pushState, history.replaceState 의해 추가/변경된 state 값 확인)
   * popstate 이벤트의 state 속성은 히스토리 엔트리 state 객체의 복사본을 갖게 됩니다.
   * state 객체의 직렬화 결과 크기는 최대 640k로 제한됩니다.
   * 브라우저는 popstate 이벤트를 페이지 로딩시에 다르게 처리합니다. Chrome(v34 이전버전) 와 Safari는 popstate 이벤트를 페이지 로딩시에 발생시킵니다. 하지만 Firefox 는 그렇지 않습니다.
   * https://developer.mozilla.org/ko/docs/Web/API/History_API
   */
  /*window.onpopstate = function (event) {
    console.log('location: ', document.location);
    console.log('state: ', event.state);
  };*/
}

/**
 * 페이지 진입 방식 확인 (NavigationType)
 * window.performance.navigation 스팩아웃 (Level 2 스팩 사용 권장)
 * https://www.w3.org/TR/navigation-timing-2/#sec-performance-navigation-types
 */
export type TNavigationType =
  | 'navigate'
  | 'reload'
  | 'back_forward'
  | 'prerender'
  | 'bfcache'
  | 'reload_bfcache'
  | 'referrer_login'
  | '';
/*export const NAVIGATION_TYPE = {
  NAVIGATE: 'NAVIGATE',
  RELOAD: 'RELOAD',
  BACK_FORWARD: 'BACK_FORWARD',
  RELOAD_BF_CACHE: 'RELOAD_BF_CACHE',
  NONE: 'NONE',
};*/
export const getNavigationType = (callback?: Function /* options: any = {}*/): TNavigationType => {
  if (typeof window === 'undefined') {
    return '';
  }

  // navigation
  let type: TNavigationType = '';

  if (
    typeof window.performance?.getEntriesByType === 'function' &&
    window.performance.getEntriesByType('navigation')?.length
  ) {
    const timing: any = window.performance.getEntriesByType('navigation')[0] || {};
    type = timing?.type || '';
  } else {
    switch (window.performance?.navigation?.type) {
      case 0:
        type = 'navigate';
        break;
      case 1:
        type = 'reload';
        break;
      case 2:
        type = 'back_forward';
        break;
      default:
        type = '';
        break;
    }
  }

  // BFCache, referrer 확인
  if (['navigate', 'reload'].includes(type) && getHistoryBFCache() === 'true') {
    type = 'reload_bfcache'; // 이전 BFCache 상태에서 페이지 새로고침 됨
  }

  return type;
};
