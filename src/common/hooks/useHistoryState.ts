import React, { useState, useEffect, useRef } from 'react';
import {
  NAVIGATION_TYPE,
  getNavigationType,
  setHistoryWindowScroll,
  getHistoryWindowScroll,
  setHistoryBFCache,
  getHistoryBFCache,
  setHistoryBFCacheScroll,
  getHistoryBFCacheScroll,
} from '@src/common/utils/history';

export const useHistoryState = () => {
  // useHistoryState
  const [isBFCache, setIsBFCache] = useState(false);
  const [navigationType, setNavigationType] = useState('');
  const timePageShowTimeout = useRef<number | null>(null);
  const timeHistoryPageInterval = useRef<number | null>(null);

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
    // navigation
    setNavigationType(getNavigationType());

    // pageshow
    const pageshow = (event: PageTransitionEvent) => {
      console.log('history > pageshow', event);
      //console.log('referrer', document.referrer);
      if (event.persisted) {
        // BFCache 로 페이지 복원
        setIsBFCache(true);
      } else {
        // BFCache 사용안함
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
        // 페이지 떠나기 전 인터벌 실행이 캐쉬되도록 한다. (BFCache 상태에서 setInterval 내부 코드 실행되도록 함)
        timeHistoryPageInterval?.current && window.clearInterval(timeHistoryPageInterval.current);
        timeHistoryPageInterval.current = window.setInterval(() => {
          console.log('safari history interval!!!!!');
          //setNavigationType(getNavigationType());
          // ...
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
    if (navigationType === 'bfcache') {
      setHistoryBFCacheScroll(); // BFCache 상태의 스크롤값 (새로고침 전 이전 스크롤값 저장)
      window.location.reload();
    } /*else {
      timePageShowTimeout?.current && window.clearTimeout(timePageShowTimeout.current);
      timePageShowTimeout.current = window.setTimeout(() => {
        setNavigationTypeWindowScroll(navigationType);
      }, 350); // Next.js Route 실행으로 페이지 최상단 이동되는 것 이후 실행 (사파리 등에서 Next routeChangeStart, routeChangeComplete 등 실행됨)
    }*/

    return () => {
      //timePageShowTimeout?.current && window.clearTimeout(timePageShowTimeout.current);
    };
  }, [navigationType]);

  return { isBFCache, navigationType };
};

export default useHistoryState;
