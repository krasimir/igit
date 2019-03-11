function normalizeTimelineEvent({ node }) {
  switch (node.__typename) {
    case 'Commit':
      return {
        type: node.__typename,
        author: node.author,
        message: node.message,
        additions: node.additions,
        deletions: node.deletions,
        date: new Date(node.committedDate)
      };
    case 'PullRequestReview':
      return {
        type: node.__typename,
        author: node.author,
        body: node.body,
        state: node.state,
        date: new Date(node.submittedAt)
      };
    case 'IssueComment':
      return {
        type: node.__typename,
        author: node.author,
        body: node.body,
        date: new Date(node.publishedAt)
      };
  }

  return false;
}

export default function createPRDetails(data) {
  const o = {};
  const pr = data.repository.pullRequest;

  o.number = pr.number;
  o.title = pr.title;
  o.base = {
    ref: pr.baseRefName,
    owner: data.repository.owner.login
  };
  o.head = {
    ref: pr.headRefName,
    owner: pr.headRepository.owner.login
  };
  o.createdAt = pr.createdAt;
  o.updatedAt = pr.updatedAt;
  o.url = pr.permalink;
  o.author = pr.author;
  o.changedFiles = pr.changedFiles;
  o.additions = pr.additions;
  o.deletions = pr.deletions;
  o.mergeable = pr.mergeable;
  o.body = pr.body;
  o.events = [];

  o.events = o.events.concat(
    pr.timeline.edges
      .map(normalizeTimelineEvent)
      .filter(event => event)
  );

  return o;
}
