import roger from '../jolly-roger';

import api from '../api';
import { PRINT_PRS } from '../constants';
import './postman';

roger.context({
  async initialize(action, { setProfile, setRepos, setNotifications }) {
    setProfile(await api.getProfile());
    setRepos(await api.getLocalRepos());
    setNotifications(await api.getNotifications());
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
  getPRFiles({ repo, prNumber }) {
    return api.fetchPRFiles(repo, prNumber);
  },
  getPRFile({ repo, path, commit }) {
    return api.fetchPRFile(repo, path, commit);
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
  },
  async submitReview({ reviewId, event, body }, { replaceEvent }) {
    const review = await api.submitReview(reviewId, event, body);

    replaceEvent({ event: review });
  },
  async deleteReview({ reviewId }, { deleteEvent }) {
    await api.deleteReview(reviewId);

    deleteEvent({ id: reviewId });
  },
  async createReview({ repo, pr, event, path, position, body }, { addEventToPR }) {
    const { review } = await api.createReview(pr.id, event, path, position, body);

    addEventToPR({ repo, pr, event: review });
  },
  async resolveThread({ threadId }, { replaceEvent }) {
    const thread = await api.resolveThread(threadId);

    replaceEvent({ event: thread });
  },
  async unresolveThread({ threadId }, { replaceEvent }) {
    const thread = await api.unresolveThread(threadId);

    replaceEvent({ event: thread });
  },
  async markAsRead(id, { setNotifications }) {
    await api.markAsRead(id);
    setNotifications(await api.getNotifications());
  },
  async markAsUnread(id, { setNotifications }) {
    await api.markAsUnread(id);
    setNotifications(await api.getNotifications());
  },
  setTotalUnread(number) {
    if (number === 0) {
      document.title = '✔ GitHorn';
    } else {
      document.title = `(${ number }) GitHorn`;
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
  replaceEvent(repos, { event }) {
    return repos.map(r => {
      r.prs.forEach(p => {
        p.events = p.events.map(e => {
          if (e.id === event.id) {
            return event;
          }
          return e;
        });
      });
      return r;
    });
  },
  deleteEvent(repos, { id }) {
    return repos.map(r => {
      r.prs.forEach(p => {
        p.events = p.events.filter(e => e.id !== id);
      });
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
  addPRReviewComment(repos, { repo, pr, topComment, comment }) {
    return repos.map(r => {
      if (r.repoId === repo.repoId) {
        const p = r.prs.find(({ id }) => id === pr.id);

        if (p) {
          // add it to already existing review thread
          if (topComment.id) {
            p.events = p.events.map(e => {
              if (e.comments && e.comments.length > 0 && e.comments[0].id === topComment.id) {
                e.comments.push(comment);
              }
              return e;
            });
          // create a new thread
          } else {
            p.events.push({
              type: 'PullRequestReviewThread',
              isResolved: false,
              date: comment.date,
              comments: [ comment ]
            });
          }
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
