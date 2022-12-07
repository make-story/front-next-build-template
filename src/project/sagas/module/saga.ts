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

import { createRequestSaga } from '../createRequestSaga';
import { loadingActionType, loadingActionCreator } from '@src/common/stores/loading/action';
import { moduleActionType, moduleActionCreator } from '@src/project/stores/module/action';
import * as api from '@src/project/api/module';

// 테스트
const fetchModuleTest = createRequestSaga(moduleActionType.FETCH_MODULE_TEST, api.fetchModuleTest1);
const fetchModuleContentTest = createRequestSaga(
  moduleActionType.FETCH_MODULE_CONTENT_TEST,
  api.fetchModuleContentTest1,
);

// Saga 미들웨어 - 액션타입 등록
export function* watchModuleSaga() {
  yield takeLatest(moduleActionType.FETCH_MODULE_TEST, fetchModuleTest);
  yield takeLatest(moduleActionType.FETCH_MODULE_CONTENT_TEST, fetchModuleContentTest);
}
