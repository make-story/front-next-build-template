import React, { ReactChild, useRef } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

export default function DyanamicSection({
  prefetch,
  freezeOnceVisible,
  children,
}: {
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
  return <div ref={ref}>{(isVisible || prefetch) && children}</div>;
}
