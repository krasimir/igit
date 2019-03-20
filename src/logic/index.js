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
  async getPRFiles({ repo, prNumber }) {
    return await api.fetchPRFiles(repo, prNumber);
  },
  async fetchData(repos) {
    const result = [];

    while (repos.length !== 0) {
      const repo = repos.shift();
      const prs = await api.fetchRemotePRs(repo);
      const resultPRs = [];

      while (prs.length !== 0) {
        const pr = prs.shift();
        const prData = await api.fetchRemotePR(repo, pr.number);

        resultPRs.push({
          ...pr,
          data: prData
        });
      }

      result.push({
        ...repo,
        prs: resultPRs
      });
    }

    return result;
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
