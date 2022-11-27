import React, { useState, useEffect, useRef } from 'react';
import { getScroll, setHistoryWindowScroll, getHistoryWindowScroll } from '@src/common/utils/history';

interface IScrollLeftTop {
  left?: number;
  top?: number;
}
export const NAVIGATION_TYPE = {
  NAVIGATE: 'NAVIGATE',
  RELOAD: 'RELOAD',
  BACK_FORWARD: 'BACK_FORWARD',
  RELOAD_BF_CACHE: 'RELOAD_BF_CACHE',
  NONE: 'NONE',
};
export const useHistoryState = () => {
  // useHistoryState
  const [isBFCache, setIsBFCache] = useState(false);
  const [navigationType, setNavigationType] = useState('');
  const timePageShowTimeout = useRef<number | null>(null);
  const timeHistoryPageInterval = useRef<number | null>(null);

  // 현재 페이지 URL 정보
  const getPageURL = () => {
    return window.location.href.split('?')?.shift() || '';
  };

  // 현재 페이지 BFCache 이력
  const HISTORY_BFCACHE = 'HISTORY_BFCACHE';
  const setHistoryBFCache = (isBFCache: null | boolean, { key = HISTORY_BFCACHE }: { key?: string } = {}) => {
    // BFCache 된 페이지 였는지 이력 브라우저 스토리지에 저장
    const value = { isBFCache, url: getPageURL() };
    window.sessionStorage.setItem(key, JSON.stringify(value));
  };
  const getHistoryBFCache = ({ key = HISTORY_BFCACHE }: { key?: string } = {}) => {
    // BFCache 페이지 이력 브라우저 스토리지에서 불러오기
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

  // BFCache 에 따른 새로고침 전 스크롤값 저장
  const HISTORY_BFCACHE_SCROLL = 'HISTORY_BFCACHE_SCROLL';
  const setHistoryBFCacheScroll = (key: string = HISTORY_BFCACHE_SCROLL) => {
    window.sessionStorage.setItem(key, JSON.stringify(getHistoryWindowScroll()));
  };
  const getHistoryBFCacheScroll = (key: string = HISTORY_BFCACHE_SCROLL) => {
    return JSON.parse(window.sessionStorage.getItem(key) || '{}');
  };

  // 브라우저 스크롤 이동
  const setNavigationTypeWindowScroll = (navigationType: string) => {
    let top: any = 0;
    if (window.history.scrollRestoration && window.history.scrollRestoration !== 'manual') {
      // 브라우저 히스토리 스크롤 수동제어 모드가 아닌 경우
      return;
    } else if ([NAVIGATION_TYPE.BACK_FORWARD].includes(navigationType)) {
      top = Number(getHistoryWindowScroll().top) || 0;
    } else if (navigationType === NAVIGATION_TYPE.RELOAD_BF_CACHE) {
      top = Number(getHistoryBFCacheScroll().top) || 0;
    } /* else if (navigationType === 'navigate' && window.location.href === getHistoryLocation()) {
      // safari 에서 새로고침되는 이슈 때문에 조건삽입
      top = Number(getHistoryReloadScroll().top) || 0;
    }*/
    if (0 < top) {
      console.log('setNavigationTypeWindowScroll', navigationType, top);
      window.scrollTo({ top, behavior: 'auto' });
    }
  };

  useEffect(() => {
    // pageshow
    const pageshow = (event: PageTransitionEvent) => {
      console.log('history > pageshow', event);
      //console.log('referrer', document.referrer);
      if (event.persisted) {
        //console.log('BFCache');
        setIsBFCache(true);
      } else {
        //console.log('새로 진입');
        setIsBFCache(false);
      }
    };
    window.addEventListener('pageshow', pageshow);
    // pagehide
    const pagehide = (event: PageTransitionEvent) => {
      console.log('history > pagehide', event);
      setHistoryBFCache(isBFCache);
      setHistoryWindowScroll();
      // 사파리에서는 BFCache 에 기존 JavaScript 코드가 실행되지 않는다.
      /*if (isSafari) {
        // 일부 브라우저 자동 새로고침 이슈 때문에 기존 스크롤 값 저장
        setHistoryReloadScroll();
        setHistoryLocation();
        // 페이지 떠나기 전 인터벌 실행이 캐쉬되도록 한다. (해당 페이지를 BFCache 작동상태로 돌아왔을 때, 히스토리 확인 코드가 작동되도록 하기위함)
        timeHistoryPageInterval?.current && window.clearInterval(timeHistoryPageInterval.current);
        timeHistoryPageInterval.current = window.setInterval(() => {
          console.log('safari history interval!!!!!');
          // ..
        });
      }*/
    };
    window.addEventListener('pagehide', pagehide);
    return () => {
      window.removeEventListener('pageshow', pageshow);
      window.removeEventListener('pagehide', pagehide);
      //timeHistoryPageInterval?.current && window.clearInterval(timeHistoryPageInterval.current);
    };
  }, []);
  useEffect(() => {
    // navigation
    let type = '';

    if (
      typeof window.performance?.getEntriesByType === 'function' &&
      window.performance.getEntriesByType('navigation')?.length
    ) {
      const timing: any = window.performance.getEntriesByType('navigation')[0] || {};
      type = timing?.type || '';
    } else {
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

    setNavigationType(type);
  }, []);
  useEffect(() => {
    if (navigationType === 'bfcache') {
      setHistoryBFCacheScroll(); // BFCache 상태의 스크롤값 (새로고침 전 이전 스크롤값 저장)
      window.location.reload();
    } else {
      timePageShowTimeout?.current && window.clearTimeout(timePageShowTimeout.current);
      timePageShowTimeout.current = window.setTimeout(() => {
        setNavigationTypeWindowScroll(navigationType);
      }, 350); // Next.js Route 실행으로 페이지 최상단 이동되는 것 이후 실행 (사파리 등에서 Next routeChangeStart, routeChangeComplete 등 실행됨)
    }
    return () => {
      timePageShowTimeout?.current && window.clearTimeout(timePageShowTimeout.current);
    };
  }, [navigationType]);

  return { isBFCache, navigationType, getPageURL, setHistoryBFCache, getHistoryBFCache };
};

export default useHistoryState;
