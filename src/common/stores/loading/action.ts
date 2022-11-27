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
// 액션 타입
const START_LOADING = 'loading/START_LOADING';
const FINISH_LOADING = 'loading/FINISH_LOADING';

export const loadingActionType = {
  START_LOADING,
  FINISH_LOADING,
};

// 액션 생성 함수 - dispatch 로 해당 액션 실행을 위한 구조를 가지고 있음
const startLoading = (payload: any) => {
  //console.log('createAction > startLoading', payload);
  return {
    type: START_LOADING,
    payload, // 사용자 값
  };
};
const finishLoading = (payload: any) => {
  //console.log('createAction > finishLoading', payload);
  return {
    type: FINISH_LOADING,
    payload, // 사용자 값
  };
};

export const loadingActionCreator = {
  startLoading,
  finishLoading,
};
