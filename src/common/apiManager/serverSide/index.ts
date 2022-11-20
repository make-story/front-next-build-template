/**
 * apiManager 서버서이드 사용 방법
 */
import { createApiManager, TApiManager } from '../index';

export default async function createApiManagerServerSide(context: any) {
  const { store, req, res, params, query } = context;
  //console.log('createApiManagerServerSide', Date.now());

  // axios 인스턴스
  //const state = store?.getState() || {};
  const apiManager: TApiManager = createApiManager({
    store,
    //state,
    //dispatch: store?.dispatch,
  });
  //console.log('apiManager', apiManager.api);
  //console.log('Authorization', headers.Authorization);

  return apiManager;
}
