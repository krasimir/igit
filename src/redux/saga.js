/* eslint-disable camelcase */
import { call, put, takeLatest, fork } from 'redux-saga/effects';

import { noToken, setProfile, setSubscribedRepos } from './actions';
import { TOGGLE_REPO } from './constants';
import db from '../db';
import api from '../api';

function * watchForTogglingRepos() {
  yield takeLatest(TOGGLE_REPO, function * ({ repo }) {
    const newRepos = yield call([db, 'toggleRepo'], repo);

    yield put(setSubscribedRepos(newRepos));
  });
}

export default function * rootSaga() {
  yield fork(watchForTogglingRepos);

  const profile = yield call([db, 'getProfile']);

  if (profile === null) {
    yield put(noToken());
  } else {
    api.setToken(profile.token);
    yield put(setProfile(profile));
  }
}
