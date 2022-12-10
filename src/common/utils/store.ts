import { Store, Dispatch } from 'redux';
import { END } from 'redux-saga';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next-redux-wrapper';

import { SagaStore } from '@src/store';

// next getServerSideProps context 타입
export type RootContext = GetServerSidePropsContext & {
  store: Store;
};

/**
 * 스토어 dispatch 후 동기적 실행
 */
export const fetchAndWaitStore = (store: Store, actionCreator: any, params = []) =>
  new Promise(resolve => {
    store.dispatch(actionCreator);
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      unsubscribe();
      return resolve(state);
    });
  });

/**
 * getServerSideProps 내 공통 실행 로직
 *
 * export const getServerSideProps = wrapper.getServerSideProps(async context => {
 *   return await getServerSideWithCommonLogic(context, {
 *     dispatch: async () => { ... },
 *     callback: () => { ... },
 *   });
 * });
 */
const setRedirect = (response: any, { url = '' }: any = {}) => {
  // next js 리다이렉트
  /*return {
        redirect: {
            permanent: false,
            destination: '/store/empty',
        },
    };*/

  // 일반 리다이렉트
  response.statusCode = 302;
  response.setHeader('Location', url);
  response.end();
};
export const getServerSideWithCommonLogic = async (
  context: RootContext,
  { dispatch, callback }: { dispatch?: Dispatch<any>; callback: Function },
) => {
  const { store, req, res, params, query /* ?a=b 파라미터값 */ } = context;
  const { headers, method } = req;
  const {} = query;

  // dispatch (fetch, 데이터 호출)
  // ... 서비스 공통 dispatch
  //await fetchAndWaitStore(store, 액션함수); // dispatch 동기적 실행
  // 사용자 dispatch
  typeof dispatch === 'function' && (await dispatch({ context, state: store.getState() }));
  store.dispatch(END);
  await (store as SagaStore).sagaTask?.toPromise();

  // 콜백
  if (typeof callback === 'function') {
    return callback({ context, state: store.getState() });
  }

  // props (컴포넌트에 전달 값)
  return {
    props: {
      referer: headers?.referer || '',
    },
  };
};
