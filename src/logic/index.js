import { state, serial, register } from 'riew';

import api from '../api';
import './postman';

const profile = state(null);
const repos = state(null);
const [ notifications, setNotifications ] = state([]);

register('profile', profile);
register('repos', repos);
register('notifications', notifications);

export const initialize = serial(
  profile.mutate(async () => await api.getProfile()),
  repos.mutate(async () => await api.getLocalRepos()),
  notifications.mutate(async () => await api.getNotifications())
);

register('toggleRepo', repos.mutate((list, { repoId }) => {
  return list.map(r => ({
    ...r,
    selected: r.repoId === repoId ? !r.selected : r.selected
  }));
}).pipe((list, { repoId }) => {
  api.toggleRepo(list.find(r => r.repoId === repoId));
}));
register('subscribedRepos', repos.filter(repo => repo.selected));
register('registerPRs', repos.mutate((list, { repo, prs }) => {
  return list.map(r => {
    if (r.repoId === repo.repoId) {
      return {
        ...r,
        prs
      };
    }
    return r;
  });
}));
const addEventToPR = register('addEventToPR', repos.mutate((repos, { repo, pr, event }) => {
  return repos.map(r => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id }) => id === pr.id);

      if (p) {
        p.events.push(event);
      }
    }
    return r;
  });
}));
register('replaceEventInPR', repos.mutate((repos, { repo, pr, event }) => {
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
}));
register('deleteEventFromPR', repos.mutate((repos, { repo, pr, id }) => {
  return repos.map(r => {
    if (r.repoId === repo.repoId) {
      const p = r.prs.find(({ id }) => id === pr.id);

      if (p) {
        p.events = p.events.filter(e => e.id !== id);
      }
    }
    return r;
  });
}));
register('addPRReviewComment', repos.mutate((repos, { repo, pr, topComment, comment }) => {
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
}));
register('replacePRReviewComment', repos.mutate((repos, { repo, pr, comment }) => {
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
}));
register('deletePRReviewComment', repos.mutate((repos, { repo, pr, id }) => {
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
}));
const replacePR = register('replacePR', repos.mutate((repos, { pr }) => {
  return repos.map(r => {
    r.prs = r.prs.map(p => {
      if (p.id === pr.id) {
        return pr;
      }
      return p;
    });
    return r;
  });
}));
const addPR = register('addPR', repos.mutate((repos, { repo, pr }) => {
  return repos.map(r => {
    if (r.repoId === repo.repoId) {
      r.prs.push(pr);
    }
    return r;
  });
}));
const replaceEvent = register('replaceEvent', repos.mutate((repos, { event }) => {
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
}));
const deleteEvent = register('deleteEvent', repos.mutate((repos, { id }) => {
  return repos.map(r => {
    r.prs.forEach(p => {
      p.events = p.events.filter(e => e.id !== id);
    });
    return r;
  });
}));

// functions
const markAsRead = register('markAsRead', async (id) => {
  await api.markAsRead(id);
  setNotifications(await api.getNotifications());
});

register('createPR', async ({ repo, title, body, base, head }) => {
  const pr = await api.createPR(repo, title, body, base, head);

  addPR({ repo, pr });
  return pr;
});
register('submitReview', async ({ reviewId, event, body }) => {
  const review = await api.submitReview(reviewId, event, body);

  markAsRead(review.id);
  replaceEvent({ event: review });
});
register('deleteReview', async ({ reviewId }) => {
  await api.deleteReview(reviewId);

  deleteEvent({ id: reviewId });
});
register('createReview', async ({ repo, pr, event, path, position, body }) => {
  const { review } = await api.createReview(pr.id, event, path, position, body);

  markAsRead(review.id);
  addEventToPR({ repo, pr, event: review });
});
register('resolveThread', async ({ threadId }) => {
  const thread = await api.resolveThread(threadId);

  replaceEvent({ event: thread });
});
register('unresolveThread', async ({ threadId }) => {
  const thread = await api.unresolveThread(threadId);

  replaceEvent({ event: thread });
});
register('markAsUnread', async (id) => {
  await api.markAsUnread(id);
  setNotifications(await api.getNotifications());
});
register('mergePR', async ({ id, repo }) => {
  const pr = await api.mergePR(id, repo);

  replacePR({ pr });
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
