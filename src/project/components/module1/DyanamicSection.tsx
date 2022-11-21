import React, { ReactChild, useRef } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

export default function DyanamicSection({
  bg,
  num,
  prefetch,
  freezeOnceVisible,
  children,
}: {
  bg: string;
  num: string;
  prefetch?: boolean;
  freezeOnceVisible?: boolean;
  children: ReactChild;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {
    freezeOnceVisible,
    prefetch,
  });
  const isVisible = !!entry?.isIntersecting;
  return (
    <div className={`section${num}`} ref={ref} style={{ background: bg, height: '100vh' }}>
      {(isVisible || prefetch) && children}
    </div>
  );
}
