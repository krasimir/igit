import { useEffect, useReducer } from '../react-process';

import api from '../api';

useEffect('profile', {
  async initialize(action, { setProfile }) {
    setProfile(await api.getProfile());
  }
});

useEffect('verification', {
  async verify(token, { setVerification, setProfile }) {
    setVerification({ verifying: true, error: null });

    api.setToken(token);
    try {
      setProfile(await api.verify());
    } catch (error) {
      setVerification({ verifying: false, error });
    }
  }
});

useEffect('repos', {
  async fetchAllRepos(action, { setRepos }) {
    const remoteRepos = await api.fetchRemoteRepos();
    const localRepos = await api.getLocalRepos();

    setRepos(remoteRepos.map(repo => {
      const selected = !!localRepos.find(localRepo => localRepo.repoId === repo.id);
      const normalizedRepo = {
        repoId: repo.id,
        fullName: repo.full_name,
        owner: repo.owner.login,
        repo: repo.name,
        githubURL: repo.html_url,
        selected
      };

      return normalizedRepo;
    }));
  },
  toggleRepo(repo) {
    api.toggleRepo(repo);
  }
});
useReducer('repos', {
  toggleRepo(repos, toggledRepo) {
    return repos.map(repo => {
      if (repo.repoId === toggledRepo.repoId) {
        repo.selected = !repo.selected;
      }
      return repo;
    });
  }
});
