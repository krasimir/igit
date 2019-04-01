const toBeFlatten = {
  PullRequestReviewThread: (thread) => {
    return thread.comments;
  }
};

export default function flattenPREvents(pr) {
  return pr.events
    .reduce((result, event) => {
      if (toBeFlatten[event.type]) {
        result = result.concat(toBeFlatten[event.type](event));
      } else {
        result.push(event);
      }
      return result;
    }, []);
};
