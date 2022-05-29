import { AnyAction } from 'redux';
import produce from 'immer';

import { loadingActionType, loadingActionCreator } from './action';

// 타입
interface IState {
  [key: string]: boolean;
}

// 초기 상태 값
const initialState = {};

// 리듀서 함수 - combineReducers 에 등록
export default function reducer(state: IState = initialState, action: AnyAction) {
  switch (action.type) {
    case loadingActionType.START_LOADING:
      //console.log('reducer > START_LOADING', action);
      return {
        ...state,
        [action.payload]: true,
      };

    case loadingActionType.FINISH_LOADING:
      //console.log('reducer > FINISH_LOADING', action);
      return {
        ...state,
        [action.payload]: false,
      };

    default:
      return state;
  }
}
