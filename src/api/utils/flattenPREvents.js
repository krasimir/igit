const toBeFlatten = {
  PullRequestReviewThread: (thread) => {
    return thread.comments;
  }
};

export default function flattenPREvents(pr) {
  const result = pr.events
    .reduce((result, event) => {
      result.push(event);

      if (toBeFlatten[event.type]) {
        result = result.concat(toBeFlatten[event.type](event));
      }

      return result;
    }, [])
    .map(({ id }) => id);

  // removing duplicates
  return result.filter(function (item, pos) {
    return result.indexOf(item) === pos;
  });
};
