import React, { ReactNode, ComponentType, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch } from 'react-redux';

import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

/*
https://stackoverflow.com/questions/53139884/next-js-disable-server-side-rendering-on-some-pages
https://blog.bitsrc.io/using-non-ssr-friendly-components-with-next-js-916f38e8992c
<DynamicModule>TEST</DynamicModule>
*/
const Module = ({ children }: any) => <React.Fragment>{children}</React.Fragment>;
export const DynamicModule = dynamic(() => Promise.resolve(Module), {
  ssr: false,
});

// https://betterprogramming.pub/lazy-loading-in-next-js-simplified-435681afb18a
// https://www.aleksandrhovhannisyan.com/blog/react-lazy-dynamic-imports/
// https://helloinyong.tistory.com/323
const LazyModule = ({
  children,
  position,
  code = '',
  isLazyModule = true,
}: {
  children?: any;
  position?: number;
  code?: string;
  isLazyModule?: boolean;
} = {}) => {
  const dispatch = useDispatch();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isRender, setIsRender] = useState(false);
  const ref = useRef<any>(null);

  // observer
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting));
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer && observer.disconnect();
  }, []);

  // 화면 렌더링 상태
  useEffect(() => {
    if (isIntersecting || !isLazyModule) {
      setIsRender(true);
    }
  }, [isIntersecting, isLazyModule]);
  useEffect(() => {
    //console.log('isRender', position, code, isRender);
    dispatch(moduleActionCreator.setRenderState({ position, code, is: isRender }));
  }, [dispatch, position, code, isRender]);

  return (
    <div ref={ref} data-module-code={code} data-observer={isIntersecting} data-lazy-module={isLazyModule}>
      {/* 로딩중인 컴포넌트는 연한색의 스켈레톤 UI */}
      {/* 상단 모듈 렌더 기다리는 컴포넌트는 진한색의 스켈리톤 UI */}
      {isRender && children}
    </div>
  );
};

export default LazyModule;
