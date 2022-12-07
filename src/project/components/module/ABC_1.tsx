import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import withModule from './withModule';
import { RootState } from '@src/rootReducer';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

const index = 1;
const ABC_1 = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 데이터 호출
    dispatch(moduleActionCreator.fetchModuleContentTest(index));
  }, []);

  return (
    <div style={{ height: '100px', border: '1px solid' }}>
      ABC_1
      <p>
        <a href={'//naver.com'}>네이버</a>
      </p>
    </div>
  );
};

export default withModule(ABC_1);
