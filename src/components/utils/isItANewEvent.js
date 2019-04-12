export default function isItANewEvent(event, notifications) {
  if (notifications.find(i => i === event.id)) {
    return false;
  } else if (event.type === 'PullRequestReviewThread') {
    return !event.comments.every(comment => notifications.find(i => i === comment.id));
  }

  return true;
}
