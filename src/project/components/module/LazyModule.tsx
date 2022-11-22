import React, { ReactNode, ComponentType, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch } from 'react-redux';

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
  moduleName = '',
  isLazyModule = true,
}: {
  children?: any;
  moduleName?: string;
  isLazyModule?: boolean;
} = {}) => {
  const dispatch = useDispatch();
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer && observer.disconnect();
  }, []);

  useEffect(() => {
    // 현재 모듈 렌더 여부
    if (isIntersecting || !isLazyModule) {
      // 련더링됨
      //dispatch(aaa.bbb(moduleName));
    }
  }, [isIntersecting, isLazyModule]);

  return (
    <div ref={ref} data-module-name={moduleName} data-observer={isIntersecting} data-lazy-module={isLazyModule}>
      {/* 로딩중인 컴포넌트는 연한색의 스켈레톤 UI */}
      {/* 상단 모듈 렌더 기다리는 컴포넌트는 진한색의 스켈리톤 UI */}
      {(isIntersecting || !isLazyModule) && children}
    </div>
  );
};

export default LazyModule;
