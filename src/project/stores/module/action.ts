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

실행 단계
액션생성(createAction) -> 액션실행(dispatch) -> 미들웨어(redux-saga) -> 리듀서(handleActions)
*/
// 액션 타입 - 값을 '경로/액션타입값' 형태로 주는 이유는, 다른 Action type과 키값이 중복되는 것을 방지하고자 하는 것 (Saga 등 미들웨어에서 값이 동일한 Type 값 실행가능성 제거)
const FETCH_MODULE_TEST = 'module/FETCH_MODULE_TEST';
const FETCH_MODULE_TEST_SUCCESS = 'module/FETCH_MODULE_TEST_SUCCESS';
const FETCH_MODULE_TEST_FAILURE = 'module/FETCH_MODULE_TEST_FAILURE';
const FETCH_MODULE_CONTENT_TEST = 'module/FETCH_MODULE_CONTENT_TEST';
const FETCH_MODULE_CONTENT_TEST_SUCCESS = 'module/FETCH_MODULE_CONTENT_TEST_SUCCESS';
const FETCH_MODULE_CONTENT_TEST_FAILURE = 'module/FETCH_MODULE_CONTENT_TEST_FAILURE';
const SET_RENDER_STATE = 'module/SET_RENDER_STATE';
const SET_CONTENT_DISPATCH_STATE = 'module/SET_CONTENT_DISPATCH_STATE';

export const moduleActionType = {
  FETCH_MODULE_TEST,
  FETCH_MODULE_TEST_SUCCESS,
  FETCH_MODULE_TEST_FAILURE,
  FETCH_MODULE_CONTENT_TEST,
  FETCH_MODULE_CONTENT_TEST_SUCCESS,
  FETCH_MODULE_CONTENT_TEST_FAILURE,
  SET_RENDER_STATE,
  SET_CONTENT_DISPATCH_STATE,
};

// 액션 생성 함수 - dispatch 로 해당 액션 실행을 위한 구조를 가지고 있음
const fetchModuleTest = (payload?: any) => {
  console.log('module > createAction > fetchModuleTest', payload);
  return {
    type: FETCH_MODULE_TEST,
    payload, // 사용자 값
  };
};

const fetchModuleContentTest = (payload?: any) => {
  console.log('module > createAction > fetchModuleContentTest', payload);
  return {
    type: FETCH_MODULE_CONTENT_TEST,
    payload, // 사용자 값
  };
};

const setRenderState = (payload?: any) => {
  console.log('module > createAction > setRenderState', payload);
  return {
    type: SET_RENDER_STATE,
    payload, // 사용자 값
  };
};

const setContentDispatchState = (payload?: any) => {
  console.log('module > createAction > setContentDispatchState', payload);
  return {
    type: SET_CONTENT_DISPATCH_STATE,
    payload, // 사용자 값
  };
};

export const moduleActionCreator = {
  fetchModuleTest,
  fetchModuleContentTest,
  setRenderState,
  setContentDispatchState,
};
