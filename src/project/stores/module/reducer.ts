import { AnyAction } from 'redux';
import produce from 'immer';

import { moduleState } from '@src/common/config/index';
import { moduleActionType, moduleActionCreator } from './action';

// 타입
interface IState {
  moduleData: any;
}

// 초기 상태 값
export const initialState = {
  moduleData: [],
};

// 리듀서 함수 - combineReducers 에 등록
export default function reducer(state: IState = initialState, action: AnyAction) {
  const { type, payload, meta } = action;

  switch (type) {
    // 테스트
    case moduleActionType.FETCH_MODULE_TEST_SUCCESS:
      console.log('module > reducer > FETCH_MODULE_TEST_SUCCESS', action);
      return produce(state, (draft: { moduleData: any }) => {
        draft.moduleData = payload?.components?.map((item: any, index: number) => {
          return {
            ...moduleState,
            ...(item || {}),
          };
        });
      });
    case moduleActionType.FETCH_MODULE_TEST_FAILURE:
      console.log('module > reducer > FETCH_MODULE_TEST_FAILURE', action);
      return state;

    // 렌더상태 변경
    case moduleActionType.SET_RENDER_STATE:
      console.log('module > reducer > SET_RENDER_STATE', action);
      return produce(state, (draft: { moduleData: any }) => {
        const { position, code, is } = payload || {};
        const findValue = state.moduleData?.findIndex(
          (item: any, index: number) => index === position && item?.code === code,
        );
        // 상태값 변경
        if (0 <= findValue) {
          const list = [...state.moduleData];
          list[findValue] = {
            ...list[findValue],
            _isRender: is,
          };
          draft.moduleData = list;
        }
      });

    default:
      return state;
  }
}
