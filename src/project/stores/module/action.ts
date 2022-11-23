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
const FETCH_MODULE_TEST = 'test/FETCH_MODULE_TEST';
const FETCH_MODULE_TEST_SUCCESS = 'test/FETCH_MODULE_TEST_SUCCESS';
const FETCH_MODULE_TEST_FAILURE = 'test/FETCH_MODULE_TEST_FAILURE';

export const testActionType = {
  FETCH_MODULE_TEST,
  FETCH_MODULE_TEST_SUCCESS,
  FETCH_MODULE_TEST_FAILURE,
};

// 액션 생성 함수 - dispatch 로 해당 액션 실행을 위한 구조를 가지고 있음
const fetchModuleTest = (payload?: any) => {
  console.log('module > createAction > fetchModuleTest', payload);
  return {
    type: FETCH_MODULE_TEST,
    payload, // 사용자 값
  };
};

export const testActionCreator = {
  fetchModuleTest,
};
