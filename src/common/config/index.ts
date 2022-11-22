/**
 * 공통 설정 값
 */
import React, { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import ABC_3 from '@src/project/components/module/ABC_3';

interface IModuleItem {
  moduleName: string;
  component: any;
  isRender: boolean;
  isLazyModule: boolean;
}
interface IModuleInfo {
  [key: string]: IModuleItem;
}

const defaultItem: IModuleItem = {
  moduleName: '',
  component: null,
  isRender: false,
  isLazyModule: true,
};
export const moduleInfo: IModuleInfo = {
  ABC_1: {
    ...defaultItem,
    moduleName: 'ABC_1',
    component: dynamic(() => import('@src/project/components/module/ABC_1'), {
      ssr: false,
    }),
  },
  ABC_2: {
    ...defaultItem,
    moduleName: 'ABC_2',
    component: dynamic(() => import('@src/project/components/module/ABC_2'), {
      ssr: false,
    }),
  },
  ABC_3: {
    ...defaultItem,
    moduleName: 'ABC_3',
    component: ABC_3,
  },
};

export default {};
