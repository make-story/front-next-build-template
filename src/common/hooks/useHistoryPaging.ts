import React, { useState, useEffect, useRef } from 'react';
import { getScroll, NAVIGATION_TYPE, getNavigationType } from '@src/common/utils/history';

interface IProps {
  HISTORY_KEY: string;
  totalCount: number; // API 에서 응답받은 값 중 총 데이터 수
  dataLength: number; // 현재 data list length 값 (예: list.length)
  isLoading: boolean; // 데이터 로딩중 여부 (fetch)
  initialPaging?: {
    offset: number; // 페이징 값
    limit: number; // 총 가져올 수
    limitMax: number; // API 측 부하관련 요청에 따른 제한
  };
}
export const useHistoryPaging = ({
  HISTORY_KEY = '',
  totalCount = 0,
  dataLength = 0,
  isLoading = false,
  initialPaging = { offset: 0, limit: 10, limitMax: 100 },
}: IProps) => {
  const [paging, setPaging] = useState({ ...initialPaging });
  const refInfiniteTarget = useRef<HTMLDivElement | null>(null);

  // 히스토리 설정
  useEffect(() => {
    const pagehide = (event: PageTransitionEvent) => {
      // offset, limit 등
      window.sessionStorage.setItem(
        HISTORY_KEY,
        JSON.stringify({ limit: paging.offset + paging.limit, scroll: getScroll().top }),
      );
    };
    window.addEventListener('pagehide', pagehide);

    return () => {
      window.removeEventListener('pagehide', pagehide);
    };
  }, [HISTORY_KEY, paging]);

  // 히스토리 가져오기 - limit 이 100 이상의 경우 API에서 오류 반환할 가능성 존재
  useEffect(() => {
    const historyInfo = JSON.parse(window.sessionStorage.getItem(HISTORY_KEY) || '{}');
    window.sessionStorage.removeItem(HISTORY_KEY);
    if (
      Number(historyInfo?.limit) &&
      paging.limit < historyInfo?.limit &&
      historyInfo?.limit < paging.limitMax &&
      [NAVIGATION_TYPE.BACK_FORWARD, NAVIGATION_TYPE.RELOAD, NAVIGATION_TYPE.RELOAD_BFCACHE].includes(
        getNavigationType(),
      )
    ) {
      setPaging({ ...paging, limit: historyInfo.limit });
    }
  }, [HISTORY_KEY, paging]);

  // 스크롤에 따른 페이징 - 초기 데이터 로드 이후 실행되어야 함
  useEffect(() => {
    const target = refInfiniteTarget.current!;
    if (!target) {
      return;
    }

    // IntersectionObserver
    const callback: IntersectionObserverCallback = (
      [{ boundingClientRect, intersectionRect, intersectionRatio, isIntersecting, rootBounds, target, time }],
      observer,
    ) => {
      //
      if (totalCount <= dataLength || totalCount < paging.offset) {
        // 옵져버 해제
        console.log('페이징 해제!');
        observer.disconnect();
        //observer.unobserve(target);
      } else if (isIntersecting && !isLoading && dataLength) {
        // 페이징 실행
        console.log('페이징 실행!');
        // 다음 페이지 호출 (page 값은 limit 단위로 증가)
        setPaging({
          ...paging,
          offset: dataLength, // stateParam.offset + stateParam.limit
          limit: paging.limit,
        });
      }
    };
    const options = {
      rootMargin: '50px 0px', // 바깥 여백(Margin)을 이용해 Root 범위를 확장하거나 축소
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [refInfiniteTarget, paging, totalCount, dataLength, isLoading]);

  return { paging, setPaging, refInfiniteTarget };
};
