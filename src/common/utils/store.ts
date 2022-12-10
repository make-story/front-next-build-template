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
    // subscribe : store에 변화가 일어날 때(state값이 변경될 때) 자동으로 실행됨(리스너).
    // 반환값 : 변경 리스너를 구독 해지하는 함수.
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      unsubscribe();
      return resolve(state);
    });
  });

/**
 * 리덕스 미들웨어
 */
/*const middleware = (store: any) => (dispatch: Dispatch<any>) => (action: any) => {
  if (action.type === '비동기 작업') {
    setTimeout(() => {
      dispatch({
        type: 'fetch-response',
        payload: [1, 2, 3],
      });
    }, 2000);
  } else {
    dispatch(action);
  }
};*/
//const store = createStore(reducer, [middleware]);

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
