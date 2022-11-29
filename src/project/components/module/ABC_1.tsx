import React, { useEffect } from 'react';

import withModule from './withModule';

const ABC_1 = () => {
  useEffect(() => {
    // 데이터 호출
  }, []);

  return (
    <>
      ABC_1
      <div>
        <a href={'//naver.com'}>네이버</a>
      </div>
    </>
  );
};

export default withModule(ABC_1);
