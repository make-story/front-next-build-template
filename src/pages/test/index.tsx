import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';

import { fetchAndWaitStore } from '@src/common/utils/store';
import Test from '@src/project/components/test';
import { moduleInfo } from '@src/common/config/index';

import { wrapper, SagaStore } from '@src/store';
import { RootState } from '@src/rootReducer';
import { testActionCreator } from '@src/project/stores/test/action';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';

// 테스트 (IOS vh 이슈대응)
if (typeof window !== 'undefined') {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  // CSS 적용
  // height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  // height: calc(var(--vh, 1vh) * 100);
}

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // apiManager
  //const apiManager = useApiManager();

  // 전역 상태
  const data = useSelector(({ test /*각 스토어 - rootReducer.ts 참고*/ }: RootState) => test.data);

  useEffect(() => {
    console.log('test page > data', data);
  }, [data, dispatch]);
  useEffect(() => {
    // 데이터 호출
    dispatch(testActionCreator.fetchTest());
  }, []);

  return (
    <>
      <Test />
    </>
  );
};

/**
 * 서버사이드 데이터 호출
 */
export const getServerSideProps = wrapper.getServerSideProps(async context => {
  const { store, req, res, params, query /* URL ?a=b 파라미터값 */ } = context;
  const { headers } = req;

  // dispatch (fetch, 데이터 호출)
  await fetchAndWaitStore(store, moduleActionCreator.fetchModuleTest());

  // 상위 노출 모둘 getServerSideProps 실행
  console.log('getServerSideProps > moduleData', store.getState()?.module?.moduleData);
  store.getState()?.module?.moduleData?.forEach(({ code }: any = {}) => {
    console.log('code', code);
    moduleInfo?.[code]?.getServerSideProps(context);
  });

  // 호출하는 환경이 서버일 경우에는는 모든 sagaTask가 완료된 상태의 스토어를 주입시켜줘야 한다.
  // https://hhyemi.github.io/2021/05/04/ssrprops.html
  // https://okky.kr/articles/1042931
  store.dispatch(END); // redux-saga 의 END 액션 이용하여 saga task 가 종료되도록 한다.
  await (store as SagaStore).sagaTask?.toPromise(); // saga task 가 모두 종료되면 resolve 된다.

  // props (컴포넌트에 전달 값)
  return {
    props: {
      referer: headers?.referer || '',
    },
  };
});

export default Page;
