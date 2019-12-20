import { put, sput, take } from 'riew';

const initEffect = function*({ render, state, api, profile, repos }) {
  const UPDATE_SEARCH_QUERY = 'UPDATE_SEARCH_QUERY';
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
    setError: (e) => sput(error, e),
    setRepos: (r) => sput(repos, r),
    initializationDone: false,
    searchIn: (payload) => sput(UPDATE_SEARCH_QUERY, payload)
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
};

export default initEffect;
