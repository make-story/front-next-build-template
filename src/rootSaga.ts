import { all } from 'redux-saga/effects';

// test
import { watchTestSaga } from './project/sagas/test/saga';

function* rootSaga() {
  yield all([
    // test
    watchTestSaga(),
  ]);
}

export default rootSaga;
