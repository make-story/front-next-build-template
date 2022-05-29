import _ from 'lodash';
import { combineReducers, AnyAction } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';

// 각 영역 상태 초기값
import { initialState as testInit } from './project/stores/test/reducer';

// test
import loading from './project/stores/loading/reducer';
import test from './project/stores/test/reducer';

const reducers = combineReducers({
  //
  loading,
  test,
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * @description 같은 값이 아닌지 여부 확인
 * @author leeyunsoo
 * @param value1 비교할 타겟 데이터1
 * @param value1 비교할 타겟 데이터2
 * @returns
 */
export const isNotEquals = <T>(value1: T, value2: T) => {
  return _.negate(_.isEqual)(value1, value2);
};
const setNextStateUsingLodashDiff = (state: any, nextState: any) => {
  return (stateTarget: string, init: any) => {
    // next는 page 단위 Render시 client 의 상태를 가지지 않기 때문에
    // page 단위에서 dispatch 한 데이터 이외에는 기본 상태라는 가정하에
    // 서버로 부터 넘어와 hydration 된 nextState가 initail 상태 데이터와 동일하지만
    // client의 상태 데이터가 initail 상태 데이터와 동일하지 않을 시에만 적용하도록 기능 구현
    if (_.isEqual(nextState[stateTarget], init) && isNotEquals(state[stateTarget], init)) {
      nextState[stateTarget] = state[stateTarget];
    }
  };
};
const rootReducer = (state: any, action: AnyAction) => {
  // Attention! This will overwrite client state! Real apps should use proper reconciliation.
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration. 서버에서 생성한 스토어의 상태가 담겨있음
      next: {
        isHydrate: true, // next에서 store에 서버에서 발생된 데이터를 주입 완료 하였는지 판단하기 위해
      },
    };

    // https://github.com/kirill-konshin/next-redux-wrapper#state-reconciliation-during-hydration
    const setClientSide = setNextStateUsingLodashDiff(state, nextState);
    setClientSide('test', testInit);

    return nextState;
  } else {
    return reducers(state, action);
  }
};

export default rootReducer;
