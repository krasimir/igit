import { take, sput, go, put } from 'riew';

import { getPullingInterval } from '../Settings/PullingInterval';
import { PRINT_PRS, PULLING, REGISTER_PRS, SUBSCRIBED_REPOS } from '../../constants';

export default function* fetchingPRs({ api, render, state, props }) {
  const numberOfFetches = state(0).mutate('NEW_FETCH', (v) => v + 1);
  const isFetchingPRs = state(false);
  const error = state(null);
  const { match } = yield take(props);
  const { name, prNumber, op } = match.params;
  let fetchDataInterval = null;

  async function fetchData({ repos, repoName, prNumber }) {
    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i];
      const prs = await api.fetchRemotePRs(repo);

      if (PRINT_PRS) {
        console.log(repo.name, JSON.stringify(prs, null, 2));
      }

      if (prNumber && repo.name === repoName && prs.find((pr) => pr.number === parseInt(prNumber, 10)) === undefined) {
        const otherPR = await api.fetchRemotePR(repo, prNumber);

        if (otherPR) {
          prs.push(otherPR);
        }
      }
      sput(REGISTER_PRS, { repo, prs });
    }
  }

  const R = function*() {
    yield put(isFetchingPRs, true);
    clearTimeout(fetchDataInterval);
    try {
      const repos = yield take(SUBSCRIBED_REPOS);
      yield fetchData({
        repos,
        repoName: name,
        prNumber: prNumber !== 'new' && op !== 'edit' ? prNumber : undefined
      });
      yield put(isFetchingPRs, false);
      yield put('NEW_FETCH');
      if (PULLING) {
        fetchDataInterval = setTimeout(() => go(R), getPullingInterval());
      }
    } catch (e) {
      sput(isFetchingPRs, false);
      console.error(e);
      sput(error, e);
    }
  };

  go(R);

  render({
    isFetchingPRs,
    numberOfFetches,
    triggerUpdate: () => go(R),
    error
  });

  return () => {
    clearTimeout(fetchDataInterval);
  };
}
