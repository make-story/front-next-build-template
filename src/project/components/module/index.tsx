import React, { useEffect } from 'react';

import { moduleInfo, lazyModuleStartIndex } from '@src/common/config/index';
import { fetchModuleTest1 } from '@src/project/api/module/index';
import LazyModule from './LazyModule';

const Modules = React.forwardRef<any, any>((props: any, ref) => {
  const list = ['ABC_1', 'ABC_2', 'ABC_3']; // API 응답 예

  useEffect(() => {
    fetchModuleTest1().then((value: any) => {
      const { data, error } = value;
      console.log('data', data);
      console.log('error', error);
    });
  }, []);

  return (
    <>
      {list.map((item: any, index: number) => {
        // react component dynamic name
        // https://stackoverflow.com/questions/29875869/react-jsx-dynamic-component-name
        // https://medium.com/@Carmichaelize/dynamic-tag-names-in-react-and-jsx-17e366a684e9
        // https://dirask.com/posts/React-how-to-create-dynamic-tag-name-jMm20j
        const Component: any = (moduleInfo[item]?.component || <></>) as keyof JSX.IntrinsicElements;
        const isLazyModule = lazyModuleStartIndex < index ? true : false;
        return (
          <LazyModule key={`module-${index}`} moduleName={item} isLazyModule={isLazyModule}>
            <Component />
          </LazyModule>
        );
      })}
    </>
  );
});

export default Modules;
