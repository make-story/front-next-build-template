import { all } from 'redux-saga/effects';

// project
import { watchModuleSaga } from '@src/project/sagas/module/saga';
import { watchTestSaga } from '@src/project/sagas/test/saga';

function* rootSaga() {
  yield all([
    // project
    watchModuleSaga(),
    watchTestSaga(),
  ]);
}

export default rootSaga;
