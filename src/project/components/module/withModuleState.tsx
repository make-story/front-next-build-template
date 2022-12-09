import React, { ComponentProps, ComponentType, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';

import { MODULE_DEFINE, LAZY_MODULE_START_INDEX } from '@src/common/config/index';
import { RootState } from '@src/rootReducer';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

export default function withModule<P extends { index: number; code: string }>(ModuleComponent: ComponentType<P>) {
  return React.forwardRef<any, any>((props: ComponentProps<typeof ModuleComponent>, ref) => {
    const { index, code } = props;
    const dispatch = useDispatch();
    const router = useRouter();

    const moduleData = useSelector(({ module }: RootState) => module.moduleData?.[index]);

    useEffect(() => {
      console.log('setRenderState!', index, code);
      // 해당 컴포넌트 렌더되었다는 상태 변경
      if (code) {
        dispatch(moduleActionCreator.setRenderState({ index, code, is: true }));
      }
    }, [dispatch, index, code]);

    useEffect(() => {
      // 컴포넌트 dispatch 실행
      if (code && /*LAZY_MODULE_START_INDEX < index || */ moduleData?._isContentDispatch === false) {
        MODULE_DEFINE?.[code]?.dispatch({ dispatch, query: router?.query });
        dispatch(moduleActionCreator.setContentDispatchState({ index, code, is: true }));
      }
    }, [dispatch, index, code, router, moduleData]);

    return (
      <div ref={ref} data-module-code={code} data-module-index={index}>
        <ModuleComponent {...props} />
      </div>
    );
  });
}
