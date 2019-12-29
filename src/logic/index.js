import { state, register, sread, sput } from 'riew';

import api from '../api';
import './postman';
import {
  SUBSCRIBED_REPOS,
  TOGGLE_REPO,
  REGISTER_PRS,
  ADD_EVENT_TO_PR,
  REPLACE_EVENT_IN_PR,
  DELETE_EVENT_FROM_PR,
  ADD_PR_REVIEW_COMMENT,
  REPLACE_PR_REVIEW_COMMENT,
  DELETE_PR_REVIEW_COMMENT,
  REPLACE_PR,
  ADD_PR,
  REPLACE_EVENT,
  DELETE_EVENT
} from '../constants';

const clone = (data) => JSON.parse(JSON.stringify(data));

const profile = state(null);
const repos = state(null);
const notifications = state([]);

export const initialize = function*() {
  yield Promise.all([
    api.getProfile().then((profileData) => profile.set(profileData)),
    api.getLocalRepos().then((localRepos) => repos.set(localRepos)),
    api.getNotifications().then((notificationsData) => notifications.set(notificationsData))
  ]);
};

repos.select(SUBSCRIBED_REPOS, (list) => {
  if (list) {
    return list.filter((repo) => repo.selected);
  }
  return list;
});
repos.mutate(TOGGLE_REPO, (list, { repoId }) => {
  return list.map((r) => ({
    ...r,
    selected: r.repoId === repoId ? !r.selected : r.selected
  }));
});
repos.mutate(REGISTER_PRS, (list, { repo, prs }) => {
  list = clone(list);
  return list.map((r) => {
    if (r.repoId === repo.repoId) {
      return {
        ...r,
        prs
      };
    }
    return r;
  });
});
repos.mutate(ADD_EVENT_TO_PR, (repos, { repo, pr, event }) => {
  repos = clone(repos);
  return repos.map((r) => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id }) => id === pr.id);

      if (p) {
        p.events.push(event);
      }
    }
    return r;
  });
});
repos.mutate(REPLACE_EVENT_IN_PR, (repos, { repo, pr, event }) => {
  repos = clone(repos);
  return repos.map((r) => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id }) => id === pr.id);

      if (p) {
        p.events = p.events.map((e) => {
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
repos.mutate(DELETE_EVENT_FROM_PR, (repos, { repo, pr, id }) => {
  repos = clone(repos);
  return repos.map((r) => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id }) => id === pr.id);

      if (p) {
        p.events = p.events.filter((e) => e.id !== id);
      }
    }
    return r;
  });
});
repos.mutate(ADD_PR_REVIEW_COMMENT, (repos, { repo, pr, topComment, comment }) => {
  repos = clone(repos);
  return repos.map((r) => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id }) => id === pr.id);

      if (p) {
        // add it to already existing review thread
        if (topComment.id) {
          p.events = p.events.map((e) => {
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
repos.mutate(REPLACE_PR_REVIEW_COMMENT, (repos, { repo, pr, comment }) => {
  repos = clone(repos);
  return repos.map((r) => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id }) => id === pr.id);

      if (p) {
        p.events = p.events.map((e) => {
          if (e.comments && e.comments.length > 0) {
            e.comments = e.comments.map((c) => {
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
repos.mutate(DELETE_PR_REVIEW_COMMENT, (repos, { repo, pr, id }) => {
  repos = clone(repos);
  return repos.map((r) => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id: prId }) => prId === pr.id);

      if (p) {
        p.events = p.events.map((e) => {
          if (e.comments && e.comments.length > 0) {
            const idx = e.comments.findIndex((c) => c.id === id);

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
repos.mutate(REPLACE_PR, (repos, { pr }) => {
  repos = clone(repos);
  return repos.map((r) => {
    r.prs = r.prs.map((p) => {
      if (p.id === pr.id) {
        return pr;
      }
      return p;
    });
    return r;
  });
});
repos.mutate(ADD_PR, (repos, { repo, pr }) => {
  repos = clone(repos);
  return repos.map((r) => {
    if (r.repoId === repo.repoId) {
      r.prs.push(pr);
    }
    return r;
  });
});
repos.mutate(REPLACE_EVENT, (repos, { event }) => {
  repos = clone(repos);
  return repos.map((r) => {
    if (r.prs && r.prs.length > 0) {
      r.prs.forEach((p) => {
        p.events = p.events.map((e) => {
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
repos.mutate(DELETE_EVENT, (repos, { id }) => {
  repos = clone(repos);
  return repos.map((r) => {
    r.prs.forEach((p) => {
      p.events = p.events.filter((e) => e.id !== id);
    });
    return r;
  });
});

sread(TOGGLE_REPO, ({ repoId }) => {
  api.toggleRepo(repos.get().find((r) => r.repoId === repoId));
}).listen();

register('profile', profile);
register('repos', repos);
register('notifications', notifications);

// functions
const markAsRead = register('markAsRead', async (id) => {
  await api.markAsRead(id);
  sput(notifications, await api.getNotifications());
});

register('createPR', async ({ repo, title, body, base, head }) => {
  const pr = await api.createPR(repo, title, body, base, head);

  sput(ADD_PR, { repo, pr });
  return pr;
});
register('submitReview', async ({ reviewId, event, body }) => {
  const review = await api.submitReview(reviewId, event, body);

  markAsRead(review.id);
  sput(REPLACE_EVENT, { event: review });
});
register('deleteReview', async ({ reviewId }) => {
  await api.deleteReview(reviewId);

  sput(DELETE_EVENT, { id: reviewId });
});
register('createReview', async ({ repo, pr, event, path, position, body }) => {
  const { review } = await api.createReview(pr.id, event, path, position, body);

  markAsRead(review.id);
  sput(ADD_EVENT_TO_PR, { repo, pr, event: review });
});
register('resolveThread', async ({ threadId }) => {
  const thread = await api.resolveThread(threadId);

  sput(REPLACE_EVENT, { event: thread });
});
register('unresolveThread', async ({ threadId }) => {
  const thread = await api.unresolveThread(threadId);

  sput(REPLACE_EVENT, { event: thread });
});
register('markAsUnread', async (id) => {
  await api.markAsUnread(id);
  sput(notifications, await api.getNotifications());
});
register('mergePR', async ({ id, repo }) => {
  const pr = await api.mergePR(id, repo);

  sput(REPLACE_PR, { pr });
});
register('closePR', async ({ id, repo }) => {
  const pr = await api.closePR(id, repo);

  sput(REPLACE_PR, { pr });
});
register('editPR', async ({ repo, title, body, prId }) => {
  const pr = await api.editPR(repo, title, body, prId);

  sput(REPLACE_PR, { pr });
  return pr;
});
