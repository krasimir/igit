export default function flattenToPRReviewComments(pr, pullRequestReviewId) {
  const comments = [
    ...pr.events.filter(event => event.type === 'PullRequestReviewComment'),
    ...pr.events
      .filter(event => event.type === 'PullRequestReviewThread')
      .reduce((allComments, event) => allComments.concat(event.comments), [])
  ].filter(comment => comment.pullRequestReviewId === pullRequestReviewId);

  return comments;
}
