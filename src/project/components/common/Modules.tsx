import dynamic from 'next/dynamic';
import React from 'react';

const ABC_1 = dynamic(() => import('./ABC_1'), {
  ssr: false,
});
const ABC_2 = dynamic(() => import('./ABC_1'), {
  ssr: false,
});

const Modules = React.forwardRef<any, any>((props: any, ref) => {
  return (
    <>
      <ABC_1 />
    </>
  );
});

export default Modules;
