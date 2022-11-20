/**
 * apiManager 리액트 컴포넌트 내부에서 사용하는 방법
 */
import React, { useMemo, useContext, useEffect } from 'react';
import { ReactReduxContext, useDispatch, useSelector } from 'react-redux';

import { createApiManager } from '../index';

export default function useApiManager() {
  const { store } = useContext(ReactReduxContext);
  //const dispatch = useDispatch();
  //const state = useSelector((state: RootState) => state);
  //const channel = useSelector((state: RootState) => state?.agent?.channel);

  const instance = useMemo(() => {
    //console.log('useApiManager', store?.getState());
    return {
      ...createApiManager({ store }),
    };
  }, [store]);

  /*useEffect(() => {
    console.log('useApiManager > store > state', store?.getState());
  }, [store]);*/

  return instance;
}
