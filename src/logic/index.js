import { state, register } from 'riew';

import api from '../api';
import './postman';

const clone = data => JSON.parse(JSON.stringify(data));

const profile = state(null);
const repos = state(null);
const [notifications, setNotifications] = state([]);

const toggleRepo = repos.set((list, { repoId }) => {
  return list.map(r => ({
    ...r,
    selected: r.repoId === repoId ? !r.selected : r.selected
  }));
});
const subscribedRepos = repos.map(repos => {
  if (repos) {
    return repos.filter(repo => repo.selected);
  }
  return repos;
});
const registerPRs = repos.set((list, { repo, prs }) => {
  list = clone(list);
  return list.map(r => {
    if (r.repoId === repo.repoId) {
      return {
        ...r,
        prs
      };
    }
    return r;
  });
});
const addEventToPR = repos.set((repos, { repo, pr, event }) => {
  repos = clone(repos);
  return repos.map(r => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id }) => id === pr.id);

      if (p) {
        p.events.push(event);
      }
    }
    return r;
  });
});
const replaceEventInPR = repos.set((repos, { repo, pr, event }) => {
  repos = clone(repos);
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
});
const deleteEventFromPR = repos.set((repos, { repo, pr, id }) => {
  repos = clone(repos);
  return repos.map(r => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id }) => id === pr.id);

      if (p) {
        p.events = p.events.filter(e => e.id !== id);
      }
    }
    return r;
  });
});
const addPRReviewComment = repos.set((repos, { repo, pr, topComment, comment }) => {
  repos = clone(repos);
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
            comments: [comment]
          });
        }
      }
    }
    return r;
  });
});
const replacePRReviewComment = repos.set((repos, { repo, pr, comment }) => {
  repos = clone(repos);
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
});
const deletePRReviewComment = repos.set((repos, { repo, pr, id }) => {
  repos = clone(repos);
  return repos.map(r => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id: prId }) => prId === pr.id);

      if (p) {
        p.events = p.events.map(e => {
          if (e.comments && e.comments.length > 0) {
            const idx = e.comments.findIndex(c => c.id === id);

            if (idx >= 0) {
              e.comments.splice(idx, 1);
            }
          }
          return e;
        });
      }
    }
    return r;
  });
});
const replacePR = repos.set((repos, { pr }) => {
  repos = clone(repos);
  return repos.map(r => {
    r.prs = r.prs.map(p => {
      if (p.id === pr.id) {
        return pr;
      }
      return p;
    });
    return r;
  });
});
const addPR = repos.set((repos, { repo, pr }) => {
  repos = clone(repos);
  return repos.map(r => {
    if (r.repoId === repo.repoId) {
      r.prs.push(pr);
    }
    return r;
  });
});
const replaceEvent = repos.set((repos, { event }) => {
  repos = clone(repos);
  return repos.map(r => {
    if (r.prs && r.prs.length > 0) {
      r.prs.forEach(p => {
        p.events = p.events.map(e => {
          if (e.id === event.id) {
            return event;
          }
          return e;
        });
      });
    }
    return r;
  });
});
const deleteEvent = repos.set((repos, { id }) => {
  repos = clone(repos);
  return repos.map(r => {
    r.prs.forEach(p => {
      p.events = p.events.filter(e => e.id !== id);
    });
    return r;
  });
});

toggleRepo.subscribe(({ repoId }) => {
  api.toggleRepo(repos.getState().find(r => r.repoId === repoId));
});

register('profile', profile);
register('repos', repos);
register('notifications', notifications);

export const initialize = () => {
  return Promise.all(
    api.getProfile().then(profile => profile.set().put(profile)),
    api.getLocalRepos().then(localRepos => repos.set().put(localRepos)),
    api.getNotifications().then(notifications => notifications.put(notifications))
  );
};

register('toggleRepo', toggleRepo);
register('subscribedRepos', subscribedRepos);
register('registerPRs', registerPRs);
register('addEventToPR', addEventToPR);
register('replaceEventInPR', replaceEventInPR);
register('deleteEventFromPR', deleteEventFromPR);
register('addPRReviewComment', addPRReviewComment);
register('replacePRReviewComment', replacePRReviewComment);
register('deletePRReviewComment', deletePRReviewComment);
register('replacePR', replacePR);
register('addPR', addPR);
register('replaceEvent', replaceEvent);
register('deleteEvent', deleteEvent);

// functions
const markAsRead = register('markAsRead', async id => {
  await api.markAsRead(id);
  setNotifications.put(await api.getNotifications());
});

register('createPR', async ({ repo, title, body, base, head }) => {
  const pr = await api.createPR(repo, title, body, base, head);

  addPR.put({ repo, pr });
  return pr;
});
register('submitReview', async ({ reviewId, event, body }) => {
  const review = await api.submitReview(reviewId, event, body);

  markAsRead(review.id);
  replaceEvent.put({ event: review });
});
register('deleteReview', async ({ reviewId }) => {
  await api.deleteReview(reviewId);

  deleteEvent.put({ id: reviewId });
});
register('createReview', async ({ repo, pr, event, path, position, body }) => {
  const { review } = await api.createReview(pr.id, event, path, position, body);

  markAsRead(review.id);
  addEventToPR.put({ repo, pr, event: review });
});
register('resolveThread', async ({ threadId }) => {
  const thread = await api.resolveThread(threadId);

  replaceEvent.put({ event: thread });
});
register('unresolveThread', async ({ threadId }) => {
  const thread = await api.unresolveThread(threadId);

  replaceEvent.put({ event: thread });
});
register('markAsUnread', async id => {
  await api.markAsUnread(id);
  setNotifications.put(await api.getNotifications());
});
register('mergePR', async ({ id, repo }) => {
  const pr = await api.mergePR(id, repo);

  replacePR.put({ pr });
});
register('closePR', async ({ id, repo }, { replacePR }) => {
  const pr = await api.closePR(id, repo);

  replacePR({ pr });
});
register('editPR', async ({ repo, title, body, prId }) => {
  const pr = await api.editPR(repo, title, body, prId);

  replacePR({ pr });
  return pr;
});
