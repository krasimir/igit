const fetchAllReposEffect = ({ render, api, state }) => {
  const [ isFetchingRepos, fetching ] = state(false);

  render({
    isFetchingRepos,
    fetchAllRepos: async (query) => {
      fetching(true);
      const remoteRepos = await api.fetchRemoteRepos(query);
      const localRepos = await api.getLocalRepos();

      let repos = [];

      fetching(false);
      repos = repos.concat(localRepos);
      remoteRepos.forEach(remoteRepo => {
        const found = repos.find(r => r.repoId === remoteRepo.repoId);

        if (found) {
          found.selected = true;
        } else {
          repos.push(remoteRepo);
        }
      });

      return repos;
    }
  });
};

export default fetchAllReposEffect;
