import React, { useEffect, Suspense, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { moduleInfo, lazyModuleStartIndex } from '@src/common/config/index';
import { HISTORY_ACTION_TYPE, NAVIGATION_TYPE, getNavigationType } from '@src/common/utils/history';
import { eventOn } from '@src/common/utils/event';
import useHistoryState from '@src/common/hooks/useHistoryState';
import { fetchModuleTest1 } from '@src/project/api/module/index';
import LazyModule from './LazyModule';

import { RootState } from '@src/rootReducer';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

const Modules = React.forwardRef<any, any>((props: any, ref) => {
  const dispatch = useDispatch();
  /*const loading = useSelector(
    ({ loading }: RootState) => loading[moduleActionType.FETCH_MODULE_TEST],
  );*/
  const moduleData = useSelector(({ module }: RootState) => module.moduleData);
  const { isBFCache, navigationType } = useHistoryState();

  useEffect(() => {
    /*fetchModuleTest1()
      .then((data: any) => {
        console.log('data', data);
      })
      .catch((error: any) => {
        console.log('error', error);
      });*/
    dispatch(moduleActionCreator.fetchModuleTest());
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
      {!!moduleData?.length &&
        moduleData.map((item: any, index: number) => {
          const { code, type } = item;

          // react component dynamic name
          // https://stackoverflow.com/questions/29875869/react-jsx-dynamic-component-name
          // https://medium.com/@Carmichaelize/dynamic-tag-names-in-react-and-jsx-17e366a684e9
          // https://dirask.com/posts/React-how-to-create-dynamic-tag-name-jMm20j
          const Component: any = (moduleInfo[code]?.component || <></>) as keyof JSX.IntrinsicElements;
          const isLazyModule =
            navigationType !== NAVIGATION_TYPE.BACK_FORWARD && lazyModuleStartIndex <= index ? true : false;
          return (
            <LazyModule key={`module-${index}`} position={index} code={code} isLazyModule={isLazyModule}>
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
