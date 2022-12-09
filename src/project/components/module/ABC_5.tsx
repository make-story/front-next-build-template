import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import withModuleState from './withModuleState';
import { RootState } from '@src/rootReducer';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

const index = 5;
const ABC_5 = () => {
  const dispatch = useDispatch();
  const moduleContentData = useSelector(({ module }: RootState) => module.moduleContentData[index]);

  useEffect(() => {
    // 데이터 호출
    dispatch(moduleActionCreator.fetchModuleContentTest(index));
  }, []);

  return (
    <div style={{ border: '1px solid' }}>
      ABC_5
      <div>
        <p>{index}</p>
        {moduleContentData?.content?.test || '-'} {moduleContentData?.time || '-'}
      </div>
    </div>
  );
};

export default withModuleState(ABC_5);
