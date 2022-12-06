/*
-
FSA(Flux Standard Action)
https://github.com/redux-utilities/flux-standard-action

객체는 액션을 구분할 고유한 문자열을 가진 `type` 필드가 반드시 있으며,
`payload` 필드에 데이터를 담아 전달한다.
그 외에 `meta`, `error` 필드를 가질 수도 있다.
{
    type: ACTION_NAME,
    payload: 'createAction 활용할 경우, 두 번째 파라미터 함수 반환 값',
    meta: '사용자값',
    error: '사용자값',
}
*/
import { AnyAction } from 'redux';
import { call, delay, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { loadingActionType, loadingActionCreator } from '@src/common/stores/loading/action';

// API요청/응답 공통 Saga함수 (제너레이터 함수 생성하여 반환)
export function createRequestSaga(actionType: string, reuqest: any) {
  //console.log(`createRequestSaga actionType: ${actionType}`); // actionType: 액션 타입(액션 이름)

  // {해당액션타입}_SUCCESS 와 {해당액션타입}_FAILURE 타입이 있다는 전제
  const SUCCESS = `${actionType}_SUCCESS`;
  const FAILURE = `${actionType}_FAILURE`;

  return function* (action: AnyAction) {
    const { type, payload } = action;

    // 로딩 시작
    yield put(loadingActionCreator.startLoading(actionType));

    try {
      // call(비동기 실행함수, 함꼐 넘길 파라미터 값)
      //const data = (yield reuqest(payload)) as IResponse;
      const data = yield call(reuqest, payload);

      // createAction 활용한 액션함수 사용 없이, type 지정 바로 호출!
      yield put({
        type: SUCCESS, // 액션 타입
        payload: data, // 응답 데이터 값
        meta: payload, // 호출정보 (파라미터 등)
      });
    } catch (e) {
      // createAction 활용한 액션함수 사용 없이, type 지정 바로 호출!
      yield put({
        type: FAILURE, // 액션 타입
        payload: e,
        error: true, // 에러발생 여부
      });
    }

    // 로딩 끝
    yield put(loadingActionCreator.finishLoading(actionType));
  };
}
