import { go, take, put, sput, call, fork } from 'riew';
import { TOGGLE_REPO } from '../../../constants';

const REPOS_SEARCH = 'REPOS_SEARCH';
const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
const UPDATE_SEARCH_QUERY = 'UPDATE_SEARCH_QUERY';
const SEARCH_QUERY_COMPILED = 'SEARCH_QUERY_COMPILED';
const SET_ERROR = 'SET_ERROR';

function* init({ api, profile }) {
  try {
    const orgs = yield api.fetchOrganizations();
    yield put(SET_SEARCH_QUERY, [
      {
        label: 'My repositories',
        param: `user:${(yield take(profile)).login}`,
        selected: true
      },
      ...orgs.map((org) => ({
        label: `Repositories in "${org.name}" organization`,
        param: `org:${org.login}`,
        selected: false
      }))
    ]);
  } catch (e) {
    console.log(e);
    yield put(SET_ERROR, new Error('IGit can not get your organizations. Wait a bit and refresh the page.'));
  }
}
function* fetchAllRepos(api, query) {
  const remoteRepos = yield api.fetchRemoteRepos(query + (yield take(SEARCH_QUERY_COMPILED)));
  const localRepos = yield api.getLocalRepos();

  let repos = [];

  repos = repos.concat(localRepos);
  remoteRepos.forEach((remoteRepo) => {
    const found = repos.find((r) => r.repoId === remoteRepo.repoId);

    if (found) {
      found.selected = true;
    } else {
      repos.push(remoteRepo);
    }
  });

  return repos;
}
function* searchTrigger({ render, repos, api }) {
  const filter = yield take(REPOS_SEARCH);

  try {
    render({ isFetchingRepos: true });
    const allRepos = yield call(fetchAllRepos, api, `${filter} in:name `);
    if (allRepos.length === 0) {
      render({ noRepos: true });
    }
    yield put(repos, allRepos);
    render({ isFetchingRepos: false });
    return go;
  } catch (e) {
    console.log(e);
    yield put(SET_ERROR, new Error('IGit can not fetch repositories.'));
  }
}

export default function* searchRepos({ render, state }) {
  const searchQuery = state([]);
  const error = state(null);

  searchQuery.mutate(SET_SEARCH_QUERY);
  searchQuery.mutate(UPDATE_SEARCH_QUERY, (current, payload) => {
    return current.map((c) => ({
      ...c,
      selected: c === payload ? !c.selected : c.selected
    }));
  });
  searchQuery.select(SEARCH_QUERY_COMPILED, (v) =>
    v
      .filter(({ selected }) => selected)
      .map(({ param }) => param)
      .join(' ')
  );
  error.mutate(SET_ERROR);

  render({
    searchQuery,
    isFetchingRepos: false,
    noRepos: false,
    searchIn: (payload) => sput(UPDATE_SEARCH_QUERY, payload),
    search: (filter) => sput(REPOS_SEARCH, filter),
    toggleRepo: (repo) => sput(TOGGLE_REPO, repo)
  });

  yield fork(init);
  yield fork(searchTrigger);
}
