import { Store } from 'redux';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next-redux-wrapper';

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
