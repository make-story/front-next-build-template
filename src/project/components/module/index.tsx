import React from 'react';
import dynamic from 'next/dynamic';
import { moduleInfo } from '../../../common/config/index';
import LazyModule from './LazyModule';

// 모듈
const modules: any = {
  ABC_1: dynamic(() => import('./ABC_1'), {
    ssr: false,
  }),
  ABC_2: dynamic(() => import('./ABC_2'), {
    ssr: false,
  }),
};

const Modules = React.forwardRef<any, any>((props: any, ref) => {
  const list = ['ABC_1', 'ABC_2'];
  return (
    <>
      {list.map((item: any, index: number) => {
        // react component dynamic name
        // https://stackoverflow.com/questions/29875869/react-jsx-dynamic-component-name
        // https://medium.com/@Carmichaelize/dynamic-tag-names-in-react-and-jsx-17e366a684e9
        // https://dirask.com/posts/React-how-to-create-dynamic-tag-name-jMm20j
        const Component: any = (modules[item] || <></>) as keyof JSX.IntrinsicElements;
        return (
          <LazyModule key={`module-${index}`} moduleName={item}>
            <Component />
          </LazyModule>
        );
      })}
    </>
  );
});

export default Modules;
