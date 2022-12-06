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
import useHistoryPageState from './useHistoryPageState';

export const useHistoryPageScroll = () => {
  const timePageShowTimeout = useRef<number | null>(null);
  const { isBFCache, navigationType } = useHistoryPageState();

  // 브라우저 스크롤 이동
  const setNavigationTypeWindowScroll = (navigationType: string) => {
    let top: any = 0;
    if (window.history.scrollRestoration && window.history.scrollRestoration !== 'manual') {
      // 브라우저 히스토리 스크롤 수동제어 모드가 아닌 경우
      return;
    } else if ([NAVIGATION_TYPE.BACK_FORWARD].includes(navigationType)) {
      top = Number(getHistoryWindowScroll().top) || 0;
    } else if (navigationType === NAVIGATION_TYPE.RELOAD_BFCACHE) {
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
    if (isBFCache) {
      setHistoryBFCacheScroll(); // BFCache 상태의 스크롤값 (새로고침 전 이전 스크롤값 저장)
      window.location.reload();
    }
  }, [isBFCache]);

  useEffect(() => {
    timePageShowTimeout?.current && window.clearTimeout(timePageShowTimeout.current);
    timePageShowTimeout.current = window.setTimeout(() => {
      setNavigationTypeWindowScroll(navigationType);
    }, 350); // Next.js Route 실행으로 페이지 최상단 이동되는 것 이후 실행 (사파리 등에서 Next routeChangeStart, routeChangeComplete 등 실행됨)

    return () => {
      timePageShowTimeout?.current && window.clearTimeout(timePageShowTimeout.current);
    };
  }, [navigationType]);
};

export default useHistoryPageScroll;
