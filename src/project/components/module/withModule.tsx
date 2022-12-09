import React, { ComponentProps, ComponentType, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';

import { moduleInfo, lazyComponentStartIndex } from '@src/common/config/index';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

export default function withModule<P extends { position: number; code: string; isLazyModule: boolean }>(
  ModuleComponent: ComponentType<P>,
) {
  return React.forwardRef<any, any>((props: ComponentProps<typeof ModuleComponent>, ref) => {
    const { position, code, isLazyModule } = props;
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
      //console.log('render!', position, code);
      // 해당 컴포넌트 렌더되었다는 상태 변경
      dispatch(moduleActionCreator.setRenderState({ position, code, is: true }));

      // 컴포넌트 dispatch 실행
      if (lazyComponentStartIndex < position) {
        moduleInfo?.[code]?.dispatch({ dispatch, query: router?.query });
      }
    }, [dispatch, position, code, router]);

    return (
      <div ref={ref} data-module-code={code} data-module-position={position}>
        <ModuleComponent {...props} />
      </div>
    );
  });
}
