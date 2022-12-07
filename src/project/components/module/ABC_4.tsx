import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import withModule from './withModule';
import { RootState } from '@src/rootReducer';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

const index = 4;
const ABC_4 = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 데이터 호출
    dispatch(moduleActionCreator.fetchModuleContentTest(index));
  }, []);

  return <>ABC_4</>;
};

export default withModule(ABC_4);
