export default function isItANewEvent(event, notifications, profile) {
  if (notifications.find(i => i === event.id)) {
    return false;
  } else if (event.type === 'PullRequestReviewThread') {
    return !event.comments.every(comment => {
      return notifications.find(i => i === comment.id) ||
        (comment.author && comment.author.login === profile.login);
    });
  } else if (event.author && event.author.login === profile.login) {
    return false;
  }

  return true;
}
