export default function flattenUsers(pr) {
  // const users = [
  //   ...pr.events.filter(event => event.type === 'PullRequestReviewComment'),
  //   ...pr.events
  //     .filter(event => event.type === 'PullRequestReviewThread')
  //     .reduce((allComments, event) => allComments.concat(event.comments), [])
  // ].filter(comment => comment.pullRequestReviewId === pullRequestReviewId);

  const users = pr.events.reduce((result, event) => {
    if (event.author) {
      result[event.author.login] = event.author;
    }
    if (event.comments) {
      event.comments.forEach(comment => {
        if (comment.author) {
          result[comment.author.login] = comment.author;
        }
      });
    }
    return result;
  }, {});

  return Object.keys(users).map(login => users[login]);
};
