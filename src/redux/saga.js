/* eslint-disable camelcase */
import { call, put, takeLatest, fork } from 'redux-saga/effects';

import createDatabase from '../db';
import { noToken, logError, setProfile, clearError } from './actions';
import { VERIFY_ACCESS_TOKEN, ERROR_VERIFICATION_FAILED } from './constants';
import api from '../api';

export const db = createDatabase();

function * watchForVerificationOfAccessToken() {
  yield takeLatest(VERIFY_ACCESS_TOKEN, function * ({ token }) {
    api.setToken(token);
    yield put(clearError(ERROR_VERIFICATION_FAILED));

    try {
      const { name, avatar_url } = yield call([ api, 'verify' ]);

      db.setProfile(token, name, avatar_url);
      yield put(setProfile({ token, name, avatar: avatar_url }));
    } catch (err) {
      yield put(logError(ERROR_VERIFICATION_FAILED));
    }
  });
}

export default function * rootSaga() {
  yield fork(watchForVerificationOfAccessToken);

  const profile = yield call([db, 'getProfile']);

  if (profile === null) {
    yield put(noToken());
  } else {
    api.setToken(profile.token);
    yield put(setProfile(profile));
  }
}
