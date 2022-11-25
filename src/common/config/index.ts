/**
 * 공통 설정 값
 */
import React, { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import ABC_3 from '@src/project/components/module/ABC_3';

interface IModuleItem {
  moduleName: string;
  component: any;
}
interface IModuleInfo {
  [key: string]: IModuleItem;
}

const defaultItem: IModuleItem = {
  moduleName: '',
  component: null,
};

// Lazy 모듈 적용 기준
export const lazyModuleStartIndex = 3;

// 모듈 상태값
export const moduleState = {
  _isRender: false,
  _isLazyModule: true,
};

// 모듈 정보
export const moduleInfo: IModuleInfo = {
  ABC_1: {
    ...defaultItem,
    moduleName: 'ABC_1',
    component: dynamic(() => import('@src/project/components/module/ABC_1'), {
      ssr: false,
      //suspense: true,
    }),
  },
  ABC_2: {
    ...defaultItem,
    moduleName: 'ABC_2',
    component: dynamic(() => import('@src/project/components/module/ABC_2'), {
      ssr: false,
      //suspense: true,
    }),
  },
  ABC_3: {
    ...defaultItem,
    moduleName: 'ABC_3',
    component: ABC_3,
  },
};

export default {};
