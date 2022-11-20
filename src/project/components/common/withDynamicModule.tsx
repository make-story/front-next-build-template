import React, { ReactNode, ComponentType, useState, useRef, useEffect } from 'react';

// https://betterprogramming.pub/lazy-loading-in-next-js-simplified-435681afb18a
// https://www.aleksandrhovhannisyan.com/blog/react-lazy-dynamic-imports/
// https://helloinyong.tistory.com/323
export const withDynamicModule = (Component: ComponentType<any> | null = null) => {
  return (props: any) => {
    const [isIntersecting, setIntersecting] = useState(false);
    const ref = useRef<any>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));
      if (ref.current) {
        observer.observe(ref.current);
      }
      return () => observer && observer.disconnect();
    }, []);

    return (
      <React.Fragment>
        <div ref={ref}>{!!Component && isIntersecting && <Component {...props} />}</div>
      </React.Fragment>
    );
  };
};
