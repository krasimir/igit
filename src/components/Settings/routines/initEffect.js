const initEffect = async function ({ data, state, api, profile, repos }) {
  const [ searchQuery, setSearchQuery ] = state([]);
  const [ , setError ] = state(null);
  const [ getProfile ] = profile;
  const [ , setRepos ] = repos;

  data({
    searchQuery,
    setError,
    setRepos,
    initializationDone: false,
    searchIn: searchQuery.mutate((current, payload) => {
      return current.map(c => ({
        ...c,
        selected: c === payload ? !c.selected : c.selected
      }));
    })
  });

  try {
    const orgs = await api.fetchOrganizations();

    setSearchQuery([
      {
        label: 'My repositories',
        param: `user:${ getProfile().login }`,
        selected: true
      },
      ...orgs.map(org => ({
        label: `Repositories in "${ org.name }" organization`,
        param: `org:${ org.login }`,
        selected: false
      }))
    ]);
    data({ initializationDone: true });
  } catch (error) {
    console.log(error);
    setError(new Error('IGit can not get your organizations. Wait a bit and refresh the page.'));
  }
};

export default initEffect;
