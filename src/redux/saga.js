import { call, put, takeLatest, fork } from 'redux-saga/effects';

import createDatabase from '../db';
import { noToken } from './actions';
import { VERIFY_ACCESS_TOKEN } from './constants';

const db = createDatabase();

function * watchForVerificationOfAccessToken() {
  yield takeLatest(VERIFY_ACCESS_TOKEN, function * ({ token }) {
    console.log(token);
  });
}

export default function * rootSaga() {
  yield fork(watchForVerificationOfAccessToken);

  const profile = yield call([db, 'getProfile']);

  if (profile === null) {
    yield put(noToken());
  }
}
