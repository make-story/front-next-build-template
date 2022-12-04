import React, { useEffect } from 'react';

import withModule from './withModule';

const ABC_1 = () => {
  useEffect(() => {
    // 데이터 호출
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
