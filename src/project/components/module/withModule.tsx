import React, { ComponentProps, ComponentType, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

export default function withModule<P extends { position: number; code: string; isLazyModule: boolean }>(
  WrappedComponent: ComponentType<P>,
) {
  return React.forwardRef<any, any>((props: ComponentProps<typeof WrappedComponent>, ref) => {
    const { position, code, isLazyModule } = props;
    const dispatch = useDispatch();

    // 렌더 상태 업데이트
    useEffect(() => {
      //console.log('render!', position, code);
      dispatch(moduleActionCreator.setRenderState({ position, code, is: true }));
    }, [dispatch, position, code]);

    return (
      <div ref={ref} data-module-code={code} data-module-position={position}>
        <WrappedComponent {...props} />
      </div>
    );
  });
}
