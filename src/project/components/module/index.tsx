import React, { useEffect, Suspense, useState } from 'react';

import { moduleInfo, lazyModuleStartIndex } from '@src/common/config/index';
import { HISTORY_ACTION_TYPE, getNavigationType } from '@src/common/utils/history';
import { eventOn } from '@src/common/utils/event';
import useHistoryState from '@src/common/hooks/useHistoryState';
import { fetchModuleTest1 } from '@src/project/api/module/index';
import LazyModule from './LazyModule';

const Modules = React.forwardRef<any, any>((props: any, ref) => {
  const { isBFCache, navigationType } = useHistoryState();
  const list = ['ABC_1', 'ABC_2', 'ABC_3']; // API 응답 예

  useEffect(() => {
    fetchModuleTest1().then((value: any) => {
      const { data, error } = value;
      console.log('data', data);
      console.log('error', error);
    });
  }, []);

  useEffect(() => {
    // 브라우저 접속 형태 확인
    console.log('navigation', getNavigationType());
    eventOn(HISTORY_ACTION_TYPE.BF_CACHE_STATE, ({ detail }: any = {}) => {
      console.log('BF_CACHE_STATE', detail);
    });
  }, []);

  useEffect(() => {
    console.log('useHistoryState isBFCache', isBFCache);
  }, [isBFCache]);
  useEffect(() => {
    console.log('useHistoryState navigationType', navigationType);
  }, [navigationType]);

  return (
    <>
      {list.map((item: any, index: number) => {
        // react component dynamic name
        // https://stackoverflow.com/questions/29875869/react-jsx-dynamic-component-name
        // https://medium.com/@Carmichaelize/dynamic-tag-names-in-react-and-jsx-17e366a684e9
        // https://dirask.com/posts/React-how-to-create-dynamic-tag-name-jMm20j
        const Component: any = (moduleInfo[item]?.component || <></>) as keyof JSX.IntrinsicElements;
        const isLazyModule = lazyModuleStartIndex <= index ? true : false;
        return (
          <LazyModule key={`module-${index}`} moduleName={item} isLazyModule={isLazyModule}>
            {/*<Suspense fallback={<p>Loading module...</p>}>*/}
            <Component />
            {/*</Suspense>*/}
          </LazyModule>
        );
      })}
    </>
  );
});

export default Modules;
