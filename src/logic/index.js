import roger from '../jolly-roger';

import api from '../api';
import { PRINT_PRS } from '../constants';
import './postman';

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
  async fetchData(repos, { registerPRs }) {
    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i];
      const prs = await api.fetchRemotePRs(repo);

      if (PRINT_PRS) {
        console.log(repo.name, JSON.stringify(prs, null, 2));
      }

      registerPRs({ repo, prs });
    }
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
  },
  registerPRs(repos, { repo, prs }) {
    return repos.map(r => {
      if (r.repoId === repo.repoId) {
        r.prs = prs;
      }
      return r;
    });
  },
  addEventToPR(repos, { repo, pr, event }) {
    return repos.map(r => {
      if (r.repoId === repo.repoId) {
        const p = r.prs.find(({ id }) => id === pr.id);

        if (p) {
          p.events.push(event);
        }
      }
      return r;
    });
  },
  replaceEventInPR(repos, { repo, pr, event }) {
    return repos.map(r => {
      if (r.repoId === repo.repoId) {
        const p = r.prs.find(({ id }) => id === pr.id);

        if (p) {
          p.events = p.events.map(e => {
            if (e.id === event.id) {
              return event;
            }
            return e;
          });
        }
      }
      return r;
    });
  },
  deleteEventFromPR(repos, { repo, pr, id }) {
    return repos.map(r => {
      if (r.repoId === repo.repoId) {
        const p = r.prs.find(({ id }) => id === pr.id);

        if (p) {
          p.events = p.events.filter(e => e.id !== id);
        }
      }
      return r;
    });
  },
  replacePRReviewComment(repos, { repo, pr, comment }) {
    return repos.map(r => {
      if (r.repoId === repo.repoId) {
        const p = r.prs.find(({ id }) => id === pr.id);

        if (p) {
          p.events = p.events.map(e => {
            if (e.comments && e.comments.length > 0) {
              e.comments = e.comments.map(c => {
                if (c.id === comment.id) {
                  return comment;
                }
                return c;
              });
            }
            return e;
          });
        }
      }
      return r;
    });
  },
  deletePRReviewComment(repos, { repo, pr, id }) {
    return repos.map(r => {
      if (r.repoId === repo.repoId) {
        const p = r.prs.find(({ id: prId }) => prId === pr.id);

        if (p) {
          p.events = p.events.map(e => {
            if (e.comments && e.comments.length > 0) {
              e.comments = e.comments.filter(c => c.id !== id);
            }
            return e;
          });
        }
      }
      return r;
    });
  }
});
