import { take, put, sput } from 'riew';
import { TOGGLE_REPO } from '../../../constants';

const REPOS_SEARCH = 'REPOS_SEARCH';
const UPDATE_SEARCH_QUERY = 'UPDATE_SEARCH_QUERY';

async function fetchAllRepos(api, query) {
  const remoteRepos = await api.fetchRemoteRepos(query);
  const localRepos = await api.getLocalRepos();

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

export default function* searchRepos({ render, repos, state, profile, api }) {
  const searchQuery = state([]);
  const error = state(null);

  searchQuery.mutate(UPDATE_SEARCH_QUERY, (current, payload) => {
    return current.map((c) => ({
      ...c,
      selected: c === payload ? !c.selected : c.selected
    }));
  });

  render({
    searchQuery,
    isFetchingRepos: false,
    noRepos: false,
    initializationDone: false,
    searchIn: (payload) => sput(UPDATE_SEARCH_QUERY, payload),
    search: (filter) => sput(REPOS_SEARCH, filter),
    toggleRepo: (repo) => sput(TOGGLE_REPO, repo)
  });

  try {
    const orgs = yield api.fetchOrganizations();
    yield put(searchQuery, [
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
    render({ initializationDone: true });
  } catch (error) {
    console.log(error);
    yield put(error, new Error('IGit can not get your organizations. Wait a bit and refresh the page.'));
  }

  const filter = yield take(REPOS_SEARCH);

  try {
    render({ isFetchingRepos: true });
    const allRepos = yield fetchAllRepos(
      api,
      `${filter} in:name ` +
        searchQuery
          .get()
          .filter(({ selected }) => selected)
          .map(({ param }) => param)
          .join(' ')
    );
    if (allRepos.length === 0) {
      render({ noRepos: true });
    }
    yield put(repos, allRepos);
    render({ isFetchingRepos: false });
  } catch (e) {
    console.log(e);
    yield put(error, new Error('IGit can not fetch repositories.'));
  }
}
