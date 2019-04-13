import roger from '../jolly-roger';

import api from '../api';

roger.context({
  postman(
    { repo, pr },
    {
      addEventToPR,
      replaceEventInPR,
      deleteEventFromPR,
      addPRReviewComment,
      replacePRReviewComment,
      deletePRReviewComment,
      markAsRead
    }
  ) {
    return {
      newTimelineComment: {
        async add(text) {
          const event = await api.addComment(pr.id, text);

          markAsRead(event.id);
          addEventToPR({ repo, pr, event });
        }
      },
      IssueComment: {
        async edit(id, text) {
          const event = await api.editComment(id, text);

          markAsRead(event.id);
          replaceEventInPR({ repo, pr, event });
        },
        async del(id) {
          await api.deleteComment(id);

          deleteEventFromPR({ repo, pr, id });
        }
      },
      PullRequestReviewThread: {
        async edit(id, text) {
          const comment = await api.editPRThreadComment(id, text);

          markAsRead(comment.id);
          replacePRReviewComment({ repo, pr, comment });
        },
        async del(id) {
          await api.deletePRThreadComment(id);

          deletePRReviewComment({ repo, pr, id });
        }
      },
      newPullRequestReviewThread(topComment) {
        const pendingReview = pr.events.filter(({ type, state }) => {
          return type === 'PullRequestReview' && state === 'PENDING';
        }).shift();

        if (pendingReview) {
          return {
            async addToReview(text) {
              const comment = await api.newPullRequestReviewComment(
                pendingReview.id,
                topComment.id,
                topComment.path,
                topComment.position,
                text
              );

              markAsRead(comment.id);
              addPRReviewComment({ repo, pr, topComment, comment });
            }
          };
        }
        return {
          async startReview(text) {
            const { review } = await api.createReview(pr.id);
            const comment = await api.newPullRequestReviewComment(
              review.id,
              topComment.id,
              topComment.path,
              topComment.position,
              text
            );

            markAsRead([ review.id, comment.id ]);
            addEventToPR({ repo, pr, event: review });
            addPRReviewComment({ repo, pr, topComment, comment });
          },
          async addSingleComment(text) {
            const { review } = await api.createReview(pr.id);
            const comment = await api.newPullRequestReviewComment(
              review.id,
              topComment.id,
              topComment.path,
              topComment.position,
              text
            );

            markAsRead([ review.id, comment.id ]);
            await api.submitReview(review.id, 'COMMENT');
            addPRReviewComment({ repo, pr, topComment, comment });
          }
        };
      }
    };
  }
});
