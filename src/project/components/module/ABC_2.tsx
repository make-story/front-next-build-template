import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MODULE_DEFINE } from '@src/common/config/index';
import withModuleState from './withModuleState';
import { RootState } from '@src/rootReducer';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

const index = 2;
const ABC_2 = () => {
  const dispatch = useDispatch();
  const moduleContentData = useSelector(({ module }: RootState) => module.moduleContentData[index]);

  useEffect(() => {
    // 데이터 호출
  }, []);

  return (
    <div style={{ border: '1px solid' }}>
      ABC_2
      <div>
        <p>{index}</p>
        {moduleContentData?.content?.test || '-'} {moduleContentData?.time || '-'}
      </div>
    </div>
  );
};

export default withModuleState(ABC_2);
