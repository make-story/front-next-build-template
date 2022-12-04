import React, { useEffect, Suspense, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';

import { moduleInfo, LazyComponentStartIndex } from '@src/common/config/index';
import { HISTORY_ACTION_TYPE, NAVIGATION_TYPE, getNavigationType } from '@src/common/utils/history';
import { eventOn } from '@src/common/utils/event';
import useHistoryState from '@src/common/hooks/useHistoryState';
import LazyComponent from './LazyComponent';
import NonSSRWrapper from './NonSSRWrapper';
import ABC_4 from './ABC_4';
import ABC_5 from './ABC_5';

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
  // https://stackoverflow.com/questions/62942727/dynamic-importing-of-an-unknown-component-nextjs
  return (
    <>
      {loading && <Skeleton></Skeleton>}
      <NonSSRWrapper>
        <ABC_4 />
      </NonSSRWrapper>
      <ABC_5 />
      {!!moduleData?.length &&
        moduleData.map((item: any, index: number) => {
          const { code, type } = item;
          const isLazyComponent =
            navigationType !== NAVIGATION_TYPE.BACK_FORWARD && LazyComponentStartIndex <= index ? true : false;
          const Component: any = (moduleInfo[code]?.component || <></>) as keyof JSX.IntrinsicElements;
          const property = { position: index, code };

          // LazyComponent 기능 및 isLazyComponent 설정값에 따라 컴포넌트가 그려지므로, SSR 작동안함
          return (
            <React.Fragment key={`module-${index}`}>
              {(isLazyComponent && (
                <LazyComponent>
                  <Component {...property} />
                </LazyComponent>
              )) || <Component {...property} />}
            </React.Fragment>
          );
        })}
    </>
  );
});

export default Modules;
