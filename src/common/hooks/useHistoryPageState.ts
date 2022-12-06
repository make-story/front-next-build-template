import React, { useState, useEffect, useRef } from 'react';
import {
  NAVIGATION_TYPE,
  getNavigationType,
  setHistoryBFCache,
  getHistoryBFCache,
  setHistoryWindowScroll,
} from '@src/common/utils/history';

interface IProps {
  handler?: {
    pageshow?: Function; // pageshow callback
    pagehide?: Function; // pagehide callback
  };
}

export const useHistoryPageState = ({ handler = {} }: IProps = {}) => {
  // useHistoryState
  const [isBFCache, setIsBFCache] = useState(false);
  const [navigationType, setNavigationType] = useState('');
  const timeHistoryPageInterval = useRef<number | null>(null);
  const handlerPageshow = useRef<Function>();
  const handlerPagehide = useRef<Function>();

  // pageshow, pagehide callback
  useEffect(() => {
    handlerPageshow.current = handler?.pageshow;
    handlerPagehide.current = handler?.pagehide;
  }, [handler]);

  // pageshow
  useEffect(() => {
    // navigation
    setNavigationType(getNavigationType());

    // pageshow
    const pageshow = (event: PageTransitionEvent) => {
      console.log('useHistoryState > pageshow', event);
      console.log('useHistoryState > pageshow BFCache', event.persisted);
      //console.log('referrer', document.referrer);

      // event.persisted
      // true : BFCache 로 페이지 복원
      // false : BFCache 사용안함
      setIsBFCache(event.persisted);
      handlerPageshow.current && handlerPageshow.current(event);
    };
    window.addEventListener('pageshow', pageshow);

    return () => {
      window.removeEventListener('pageshow', pageshow);
    };
  }, []);

  // pagehide
  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(window?.navigator?.userAgent || '');

    // pagehide
    const pagehide = (event: PageTransitionEvent) => {
      console.log('useHistoryState > pagehide', event);
      console.log('useHistoryState > pagehide BFCache', event.persisted);

      // event.persisted
      // true : 현재 페이지 BFCache 저장시도
      // false : 현재 페이지 BFCache 로 저장하지 않음
      setHistoryBFCache(isBFCache);
      setHistoryWindowScroll();
      handlerPagehide.current && handlerPagehide.current(event);

      // 사파리에서는 BFCache 에 기존 JavaScript 코드가 실행되지 않는다.
      if (isSafari) {
        // 페이지 떠나기 전 인터벌 실행이 캐쉬되도록 한다. (BFCache 상태에서 setInterval 내부 코드 실행되도록 함)
        timeHistoryPageInterval?.current && window.clearInterval(timeHistoryPageInterval.current);
        timeHistoryPageInterval.current = window.setInterval(() => {
          console.log('safari history interval!!!!!');
          setNavigationType(getNavigationType());
        });
      }
    };
    window.addEventListener('pagehide', pagehide);

    return () => {
      timeHistoryPageInterval?.current && window.clearInterval(timeHistoryPageInterval.current); // removeEventListener 보다 먼저 해제되어야 함
      window.removeEventListener('pagehide', pagehide);
    };
  }, [isBFCache]);

  return { isBFCache, navigationType };
};

export default useHistoryPageState;
