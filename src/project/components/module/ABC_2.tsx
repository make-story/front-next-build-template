import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import withModule from './withModule';
import { RootState } from '@src/rootReducer';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

const index = 2;
const ABC_2 = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 데이터 호출
    dispatch(moduleActionCreator.fetchModuleContentTest(index));
  }, []);

  return <div style={{ height: '100px', border: '1px solid' }}>ABC_2</div>;
};

export default withModule(ABC_2);
