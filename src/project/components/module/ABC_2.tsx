import React, { useEffect } from 'react';

import withModule from './withModule';

const ABC_2 = () => {
  useEffect(() => {
    // 데이터 호출
  }, []);

  return <div style={{ height: '100px', border: '1px solid' }}>ABC_2</div>;
};

export default withModule(ABC_2);
