import React, { useEffect, Suspense, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { moduleInfo, lazyModuleStartIndex } from '@src/common/config/index';
import { HISTORY_ACTION_TYPE, NAVIGATION_TYPE, getNavigationType } from '@src/common/utils/history';
import { eventOn } from '@src/common/utils/event';
import useHistoryState from '@src/common/hooks/useHistoryState';
import LazyModule from './LazyModule';

import { RootState } from '@src/rootReducer';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

const Modules = React.forwardRef<any, any>((props: any, ref) => {
  const dispatch = useDispatch();
  const loading = useSelector(({ loading }: RootState) => loading[moduleActionType.FETCH_MODULE_TEST]);
  const moduleData = useSelector(({ module }: RootState) => module.moduleData);
  const { isBFCache, navigationType } = useHistoryState();

  useEffect(() => {
    dispatch(moduleActionCreator.fetchModuleTest());
  }, []);

  // navigation 상태
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

  // react component dynamic name
  // https://stackoverflow.com/questions/29875869/react-jsx-dynamic-component-name
  // https://medium.com/@Carmichaelize/dynamic-tag-names-in-react-and-jsx-17e366a684e9
  // https://dirask.com/posts/React-how-to-create-dynamic-tag-name-jMm20j
  return (
    <>
      {loading && 'API...'}
      {!!moduleData?.length &&
        moduleData.map((item: any, index: number) => {
          const { code, type } = item;
          const isLazyModule =
            navigationType !== NAVIGATION_TYPE.BACK_FORWARD && lazyModuleStartIndex <= index ? true : false;
          const Component: any = (moduleInfo[code]?.component || <></>) as keyof JSX.IntrinsicElements;
          const property = { position: index, code };

          return (
            <React.Fragment key={`module-${index}`}>
              {(isLazyModule && (
                <LazyModule {...property}>
                  <Component {...property} />
                </LazyModule>
              )) || <Component {...property} />}
            </React.Fragment>
          );
        })}
    </>
  );
});

export default Modules;
