import { applyMiddleware, createStore, Store } from 'redux';
import createSagaMiddleware, { Task } from 'redux-saga';
import { createWrapper, Context } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import produce from 'immer';
import _omit from 'lodash/omit';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

export interface SagaStore extends Store {
  sagaTask?: Task;
}

const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== 'production') {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

/**
 * 스토어 생성
 * Next js 에 의해 서버에서는 사용자별로 스토어 생성
 */
const makeStore = (context: Context) => {
  // 1: Create the middleware
  const sagaMiddleware = createSagaMiddleware();
  // 2: Add an extra parameter for applying middleware:
  const store = createStore(rootReducer, bindMiddleware([sagaMiddleware]));
  // 3: Run your sagas on server
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);
  // 4: now return the store:
  return store;
};

/**
 * getServerSideProps에 공통로직 추가
 */
const createWrapperWithCommonLogic = () => {
  // Next.js는 유저가 요청할때마다 redux store를 새로 생성
  const wrapper = createWrapper(makeStore, { debug: false });

  type AddParameters<F, P extends {}> = F extends (arg: infer U) => infer R ? (arg: U & P) => R : unknown;
  type Callback = AddParameters<
    Parameters<typeof wrapper['getServerSideProps']>[0],
    {
      apiManager: any;
      test?: string;
    }
  >;

  const getServerSideProps = (callback: Callback) => {
    return wrapper.getServerSideProps(async context => {
      const { store, req, res, params, query } = context;
      console.log('getServerSideProps', Date.now());

      // axios
      // await preFetch(context); // 사전 데이터 호출(세팅) 부분
      //const apiManager: TApiManager = await createApiManagerServerSide(context);
      const apiManager = {};

      const test = 'TEST';
      return (await callback({ ...context, apiManager, test })) || {};
    });
  };

  return {
    ..._omit(wrapper, 'getServerSideProps'), // wrapper 에서 getServerSideProps 생략
    getServerSideProps, // getServerSideProps 새로 주입
  };
};

export const wrapper = createWrapperWithCommonLogic();
