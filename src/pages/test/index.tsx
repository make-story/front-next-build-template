import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { wrapper } from 'src/store';
import { RootState } from 'src/rootReducer';
import { testActionCreator } from 'src/project/stores/test/action';
import Test from 'src/project/components/test';

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
  // ...

  // props (컴포넌트에 전달 값)
  return {
    props: {
      referer: headers?.referer || '',
    },
  };
});

export default Page;
