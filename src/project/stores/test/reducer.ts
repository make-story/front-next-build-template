import { AnyAction } from 'redux';
import produce from 'immer';

import { testActionType, testActionCreator } from './action';

// 타입
interface IState {
  data: any;
}

// 초기 상태 값
export const initialState = {
  data: [],
};

// 리듀서 함수 - combineReducers 에 등록
export default function reducer(state: IState = initialState, action: AnyAction) {
  const { type, payload, meta } = action;

  switch (type) {
    // 테스트
    case testActionType.FETCH_TEST_SUCCESS:
      console.log('test > reducer > FETCH_TEST_SUCCESS', action);
      return produce(state, (draft: { data: any }) => {
        draft.data = payload;
      });
    case testActionType.FETCH_TEST_FAILURE:
      console.log('test > reducer > FETCH_TEST_SUCCESS', action);
      return state;

    default:
      return state;
  }
}
