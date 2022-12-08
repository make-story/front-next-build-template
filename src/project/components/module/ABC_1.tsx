import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import withModule from './withModule';
import { RootState } from '@src/rootReducer';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

const index = 1;
const ABC_1 = () => {
  const dispatch = useDispatch();
  const moduleContentData = useSelector(({ module }: RootState) => module.moduleContentData[index]);

  useEffect(() => {
    // 데이터 호출
    dispatch(moduleActionCreator.fetchModuleContentTest(index));
  }, []);

  return (
    <div style={{ border: '1px solid' }}>
      ABC_1
      <div>
        <p>{index}</p>
        {moduleContentData?.content?.test || '-'} {moduleContentData?.time || '-'}
      </div>
      <p>
        <a href={'//naver.com'}>네이버</a>
      </p>
    </div>
  );
};

export default withModule(ABC_1);
