import React, { ReactNode, ComponentType, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch } from 'react-redux';

import { MODULE_DEFINE, LAZY_MODULE_START_INDEX } from '@src/common/config/index';
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
const LazyComponent = ({ children }: { children?: any } = {}) => {
  const dispatch = useDispatch();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  // observer 상태
  useEffect(() => {
    // https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      entry.isIntersecting && observer.unobserve(entry.target);
    });
    if (ref?.current) {
      observer.observe(ref.current);
    }
    return () => observer && observer.disconnect();
  }, []);

  // 로딩중인 컴포넌트는 연한색의 스켈레톤 UI
  // 상단 모듈 렌더 기다리는 컴포넌트는 진한색의 스켈리톤 UI
  return (
    <>
      {/* https://stackoverflow.com/questions/63654496/is-it-possible-to-add-ref-to-the-props-children-elements */}
      <div data-observer-target={''} ref={ref}></div>
      {isIntersecting && children}
    </>
  );
};

export default LazyComponent;
