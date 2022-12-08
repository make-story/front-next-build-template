/**
 * 공통 설정 값
 */
import React, { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Skeleton from 'react-loading-skeleton';

import ABC_3 from '@src/project/components/module/ABC_3';

interface IModuleItem {
  code: string;
  path: string;
  component: any;
}
interface IModuleInfo {
  [key: string]: IModuleItem;
}

const defaultItem: IModuleItem = {
  code: '',
  path: '',
  component: null,
};

// Lazy 모듈 적용 기준
export const LazyComponentStartIndex = 1;

// 모듈 상태값 (모듈 리스트 API 응답값에 상태 추가)
export const moduleState = {
  _isRender: false,
};

// https://stackoverflow.com/questions/62942727/dynamic-importing-of-an-unknown-component-nextjs
// https://nextjs.org/docs/advanced-features/dynamic-import  공식 페이지(22년 12월 기준)에 따르면,
// 컴포넌트 경로(path)는 템플릿 문자열이나 변수가 될 수 없습니다.
/*export const getDynamicComponent = function (path: string) {
  return dynamic(() => import(`${path}`), {
    ssr: false,
    loading: () => <Skeleton></Skeleton>,
    //suspense: true,
  });
};*/

// 모듈 정보
// dynamic ssr 설정을 true 로 하더라도, LazyComponentStartIndex 설정값에 의해, SSR 되지 않는다.
// SSR 렌더 확인 방법 : 크롬 개발자 도구 > 네트워크탭 > 유형 '문서' HTML 'text/html' 반환값 확인
export const moduleInfo: IModuleInfo = {
  ABC_1: {
    ...defaultItem,
    code: 'ABC_1',
    path: '@src/project/components/module/ABC_1',
    // path 정보만 있고, 아래 dynamic 기능은 별도 컴포넌트로 분리!!!!!!!
    component: dynamic(() => import('@src/project/components/module/ABC_1'), {
      //ssr: true,
      loading: () => <Skeleton></Skeleton>,
    }),
  },
  ABC_2: {
    ...defaultItem,
    code: 'ABC_2',
    path: '@src/project/components/module/ABC_2',
    component: dynamic(() => import('@src/project/components/module/ABC_2'), {
      //ssr: false,
      loading: () => <Skeleton></Skeleton>,
    }),
  },
  ABC_3: {
    ...defaultItem,
    code: 'ABC_3',
    path: '@src/project/components/module/ABC_3',
    component: dynamic(() => import('@src/project/components/module/ABC_3'), {
      //ssr: false,
      loading: () => <Skeleton></Skeleton>,
    }),
  },
};

export default {};
