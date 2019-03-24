import roger from '../jolly-roger';

import api from '../api';

roger.context({
  postman(
    { repo, pr },
    {
      addEventToPR,
      replaceEventInPR,
      deleteEventFromPR,
      replacePRReviewComment,
      deletePRReviewComment }
  ) {
    return {
      newTimelineComment: {
        async add(text) {
          const event = await api.addComment(pr.id, text);

          addEventToPR({ repo, pr, event });
        }
      },
      IssueComment: {
        async edit(id, text) {
          const event = await api.editComment(id, text);

          replaceEventInPR({ repo, pr, event });
        },
        async del(id) {
          await api.deleteComment(id);

          deleteEventFromPR({ repo, pr, id });
        }
      },
      PullRequestReviewThread: {
        async add(text) {
          console.log('not implemented');
        },
        async edit(id, text) {
          const comment = await api.editPRThreadComment(id, text);

          replacePRReviewComment({ repo, pr, comment });
        },
        async del(id) {
          await api.deletePRThreadComment(id);

          deletePRReviewComment({ repo, pr, id });
        }
      }
    };
  }
});
