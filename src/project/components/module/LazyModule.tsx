import React, { ReactNode, ComponentType, useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

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
    <React.Fragment>
      <div ref={ref} data-observer={isIntersecting}>
        {(isIntersecting || !isLazyModule) && children}
      </div>
    </React.Fragment>
  );
};

export default LazyModule;
