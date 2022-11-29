/**
 * 공통 설정 값
 */
import React, { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Skeleton from 'react-loading-skeleton';

import ABC_3 from '@src/project/components/module/ABC_3';

interface IModuleItem {
  code: string;
  component: any;
}
interface IModuleInfo {
  [key: string]: IModuleItem;
}

const defaultItem: IModuleItem = {
  code: '',
  component: null,
};

// Lazy 모듈 적용 기준
export const lazyModuleStartIndex = 0;

// 모듈 상태값 (모듈 리스트 API 응답값에 상태 추가)
export const moduleState = {
  _isRender: false,
};

// 모듈 정보
export const moduleInfo: IModuleInfo = {
  ABC_1: {
    ...defaultItem,
    code: 'ABC_1',
    component: dynamic(() => import('@src/project/components/module/ABC_1'), {
      ssr: false,
      loading: () => <Skeleton></Skeleton>,
      //suspense: true,
    }),
  },
  ABC_2: {
    ...defaultItem,
    code: 'ABC_2',
    component: dynamic(() => import('@src/project/components/module/ABC_2'), {
      ssr: false,
      loading: () => <Skeleton></Skeleton>,
      //suspense: true,
    }),
  },
  ABC_3: {
    ...defaultItem,
    code: 'ABC_3',
    component: ABC_3,
  },
};

export default {};
