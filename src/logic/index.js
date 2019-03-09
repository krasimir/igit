import roger from '../jolly-roger';

import api from '../api';
import './PRs';

roger.context({
  async initialize(action, { setProfile, setRepos }) {
    setProfile(await api.getProfile());
    setRepos(await api.getLocalRepos());
  },
  async verify(token, { setVerification, setProfile }) {
    setVerification({ verifying: true, error: null });

    api.setToken(token);
    try {
      setProfile(await api.verify());
    } catch (error) {
      setVerification({ verifying: false, error });
    }
  },
  async fetchAllRepos() {
    const remoteRepos = await api.fetchRemoteRepos();
    const localRepos = await api.getLocalRepos();
    const repos = remoteRepos.map(repo => {
      const selected = !!localRepos.find(localRepo => localRepo.repoId === repo.id);
      const normalizedRepo = {
        repoId: repo.id,
        nameWithOwner: repo.nameWithOwner,
        name: repo.name,
        homepageUrl: repo.homepageUrl,
        selected
      };

      return normalizedRepo;
    });

    return repos;
  },
  toggleRepo(repo) {
    api.toggleRepo(repo);
  }
});

roger.useReducer('repos', {
  toggleRepo(repos, toggledRepo) {
    return repos.map(repo => {
      if (repo.repoId === toggledRepo.repoId) {
        repo.selected = !repo.selected;
      }
      return repo;
    });
  }
});
