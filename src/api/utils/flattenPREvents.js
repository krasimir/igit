const toBeFlatten = {
  PullRequestReviewThread: (thread) => {
    return thread.comments;
  }
};

export default function flattenPREvents(pr, returnRawEvents = false) {
  return pr.events
    .reduce((result, event) => {
      result.push(event);

      if (toBeFlatten[event.type]) {
        result = result.concat(toBeFlatten[event.type](event));
      }

      return result;
    }, [])
    .map(event => (returnRawEvents ? event : event.id));
};
