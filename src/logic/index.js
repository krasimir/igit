import roger from '../jolly-roger';

import api from '../api';

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
  async fetchOrganizations() {
    return api.fetchOrganizations();
  },
  async fetchAllRepos(query) {
    const remoteRepos = await api.fetchRemoteRepos(query);
    const localRepos = await api.getLocalRepos();
    let repos = [];

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
  },
  toggleRepo(repo) {
    api.toggleRepo(repo);
  },
  async getPRs(repo) {
    return await api.fetchRemotePRs(repo);
  },
  async getPR({ repo, prNumber }) {
    return await api.fetchRemotePR(repo, prNumber);
  },
  async getPRFiles({ repo, prNumber }) {
    return await api.fetchPRFiles(repo, prNumber);
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
