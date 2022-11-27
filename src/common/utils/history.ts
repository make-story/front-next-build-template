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
 * 상태
 */
export const HISTORY_ACTION_TYPE = {
  BF_CACHE_STATE: 'BF_CACHE_STATE',
  PAGE_SHOW: 'PAGE_SHOW',
  PAGE_HIDE: 'PAGE_HIDE',
};
const HISTORY_SCROLL = 'HISTORY_SCROLL';
const HISTORY_BFCACHE = 'HISTORY_BFCACHE';
const HISTORY_BFCACHE_SCROLL = 'HISTORY_BFCACHE_SCROLL';
export const NAVIGATION_TYPE = {
  // window.performance.getEntriesByType('navigation') 반환값
  NAVIGATE: 'navigate',
  RELOAD: 'reload',
  BACK_FORWARD: 'back_forward',
  RELOAD_BF_CACHE: 'reload_bfcache',
  PRERENDER: 'prerender',
  NONE: '',
};
interface IScrollLeftTop {
  left?: number;
  top?: number;
}

/**
 * 스크롤 위치 복원 기능 값 설정
 */
export const setScrollRestoration = (value: 'manual' | 'auto' = 'manual') => {
  if (typeof window !== 'undefined' && window.history.scrollRestoration) {
    window.history.scrollRestoration = value;
  }
};

/**
 * 현재 페이지 정보
 */
// 현재 페이지 URL 정보
const getPageURL = () => {
  return window.location.href.split('?')?.shift() || '';
};

// window 스크롤 값 반환
export const getScroll = (element?: any) => {
  // TODO: 오버플로우 스크롤 설정된 element 의 경우 대응필요
  return {
    left: window.pageXOffset || window.scrollX,
    top: window.pageYOffset || window.scrollY,
  };
};

// 현재 페이지 URL 기준, window 스크롤 값 브라우저 스토리지에 저장
export const setHistoryWindowScroll = (
  { left, top }: IScrollLeftTop = getScroll(),
  { key = `${HISTORY_SCROLL}_${getPageURL()}` }: { key?: string } = {},
) => {
  //console.log(`scroll left: ${left}, top: ${top}`);
  window.sessionStorage.setItem(key, JSON.stringify({ left, top }));
};

// 현재 페이지 URL 기준, window 스크롤 값 브라우저 스토리지에서 불러오기
export const getHistoryWindowScroll = ({
  key = `${HISTORY_SCROLL}_${getPageURL()}`,
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

/**
 * BFCache
 * https://web.dev/bfcache/
 * https://blog.naver.com/PostView.nhn?blogId=qls0147&logNo=222157982248&categoryNo=0&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=postView
 * unload 이벤트 리스너가 추가되어 있는 경우 bfcache에 적합하지 않은 페이지로 판단하는 브라우저 있음 (BFCache 활용안됨)
 *
 * - pageshow, pagebeforeshow, pagebeforehide, pagehide 이벤트
 * https://developer.mozilla.org/en-US/docs/Web/Events/pagehide
 * https://developer.mozilla.org/en-US/docs/Web/Events/pageshow
 *
 * - BFCache 사용 안하는 법
 * 최상위 페이지 응답 헤더의 Cache-Control을 no-store로 설정
 * Cache-Control: no-store
 *
 * - 크롬은 모바일 환경에서 BFCache 작동(사용)
 * 데스크탑에서 테스트 필요한 경우, #back-forward-cache flag 설정
 * https://www.chromium.org/developers/how-tos/run-chromium-with-flags/
 */
// BFCache 된 페이지 였는지 이력 브라우저 스토리지에 저장
export const setHistoryBFCache = (isBFCache: null | boolean, { key = HISTORY_BFCACHE }: { key?: string } = {}) => {
  const value = { isBFCache, url: getPageURL() };
  window.sessionStorage.setItem(key, JSON.stringify(value));
};

// BFCache 페이지 이력 브라우저 스토리지에서 불러오기
export const getHistoryBFCache = ({ key = HISTORY_BFCACHE }: { key?: string } = {}) => {
  let value = { isBFCache: null, url: '' };
  try {
    value = {
      ...value,
      ...JSON.parse(window.sessionStorage.getItem(key) || '{}'),
    };
    return value?.isBFCache && value?.url === getPageURL();
  } catch (error) {
    return false;
  }
};

// 현재 페이지 URL 기준, BFCache 에 따른 새로고침 전, 기존 저장되어 있던 스크롤값 저장
export const setHistoryBFCacheScroll = (key: string = HISTORY_BFCACHE_SCROLL) => {
  window.sessionStorage.setItem(key, JSON.stringify(getHistoryWindowScroll()));
};

// 현재 페이지 URL 기준, BFCache 에 따른 새로고침 전, 기존 저장되어 있던 스크롤값 불러오기
export const getHistoryBFCacheScroll = (key: string = HISTORY_BFCACHE_SCROLL) => {
  return JSON.parse(window.sessionStorage.getItem(key) || '{}');
};

/**
 * Page Lifecycle
 * https://wd.imgix.net/image/kheDArv5csY6rvQUJDbWRscckLr1/Hs3H9gK98YT0pvvU3k25.png
 * pageshow > beforeunload > pagehide > unload > bfcache
 */
if (typeof window !== 'undefined') {
  // pageshow
  window.addEventListener('pageshow', (event: PageTransitionEvent) => {
    console.log('history > pageshow', event);
    //console.log('referrer', document.referrer);
    if (event.persisted) {
      // BFCache 로 페이지 복원
      isBFCache = true;
    } else {
      // BFCache 사용안함
      isBFCache = false;
    }
    console.log('history > BFCache', isBFCache);
    console.log('history > referrer', document?.referrer);
    eventDispatch(HISTORY_ACTION_TYPE.PAGE_SHOW, event);
    eventDispatch(HISTORY_ACTION_TYPE.BF_CACHE_STATE, isBFCache);
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
    console.log('history > pagehide', event);
    if (event.persisted === true) {
      // 현재 페이지 BFCache 저장시도
      //setHistoryBFCache(true);
    } else {
      // 현재 페이지 BFCache 로 저장하지 않음
      //setHistoryBFCache(false);
    }
    setHistoryBFCache(isBFCache);
    eventDispatch(HISTORY_ACTION_TYPE.PAGE_HIDE, event);
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
export const getNavigationType = (): typeof NAVIGATION_TYPE[keyof typeof NAVIGATION_TYPE] => {
  if (typeof window === 'undefined') {
    return '';
  }

  // navigation type
  let type: typeof NAVIGATION_TYPE[keyof typeof NAVIGATION_TYPE] = NAVIGATION_TYPE.NONE;

  if (
    typeof window.performance?.getEntriesByType === 'function' &&
    window.performance?.getEntriesByType('navigation')?.length
  ) {
    // 표준
    // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
    // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type
    const timing: any = window.performance?.getEntriesByType('navigation')[0] || {};
    type = timing?.type || NAVIGATION_TYPE.NONE;
  } else {
    // 비표준
    // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigation/type
    switch (window.performance?.navigation?.type) {
      case 0:
        type = NAVIGATION_TYPE.NAVIGATE;
        break;
      case 1:
        type = NAVIGATION_TYPE.RELOAD;
        break;
      case 2:
        type = NAVIGATION_TYPE.BACK_FORWARD;
        break;
      default:
        type = NAVIGATION_TYPE.NONE;
        break;
    }
  }

  // BFCache, referrer 확인
  if (['navigate', 'reload'].includes(type) && getHistoryBFCache()) {
    type = NAVIGATION_TYPE.BACK_FORWARD; // 이전 BFCache 상태에서 페이지 새로고침 됨
  }

  return type;
};
