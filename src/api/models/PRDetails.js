function normalizeUser(data) {
  let avatar = data.avatarUrl;
  let name = data.name;
  let login = data.login;

  if (!login && data.user) {
    login = data.user.login;
  }

  const user = Object.assign(
    {},
    avatar && { avatar },
    name && { name },
    login && { login }
  );

  if (user.login) {
    user.url = 'https://github.com/' + user.login;
  }

  return user;
}

function normalizeTimelineEvent({ node }) {
  switch (node.__typename) {
    case 'Commit':
      return {
        type: node.__typename,
        author: normalizeUser(node.author),
        message: node.message,
        additions: node.additions,
        deletions: node.deletions,
        date: new Date(node.committedDate)
      };
    case 'RenamedTitleEvent':
      return {
        type: node.__typename,
        author: normalizeUser(node.actor),
        date: new Date(node.createdAt)
      };
    case 'CrossReferencedEvent':
      return {
        type: node.__typename,
        author: normalizeUser(node.actor),
        date: new Date(node.referencedAt),
        target: node.target
      };
    case 'PullRequestReview':
      return {
        type: node.__typename,
        author: normalizeUser(node.author),
        body: node.body,
        state: node.state,
        date: new Date(node.submittedAt)
      };
    case 'PullRequestReviewComment':
      return {
        type: node.__typename,
        author: normalizeUser(node.author),
        pullRequestReviewId: node.pullRequestReview.id,
        body: node.body,
        outdated: node.outdated,
        diffHunk: node.diffHunk,
        replyTo: node.replyTo.id,
        date: new Date(node.publishedAt)
      };
    case 'IssueComment':
      return {
        type: node.__typename,
        author: normalizeUser(node.author),
        body: node.body,
        date: new Date(node.publishedAt)
      };
    case 'MergedEvent':
      return {
        type: node.__typename,
        author: normalizeUser(node.actor),
        commit: node.commit,
        ref: node.mergeRefName,
        date: new Date(node.createdAt)
      };
    case 'ReferencedEvent':
      return {
        type: node.__typename,
        author: normalizeUser(node.actor),
        date: new Date(node.createdAt),
        subject: node.subject
      };
  }

  return false;
}

function normalizeReviewThread({ node }) {
  const comments = node.comments.edges.map(({ node: commentNode }) => ({
    author: normalizeUser(commentNode.author),
    body: commentNode.body,
    date: new Date(commentNode.publishedAt),
    diffHunk: commentNode.diffHunk
  }));

  return {
    type: 'PullRequestReviewThread',
    isResolved: node.isResolved,
    date: new Date(comments[comments.length - 1].date),
    comments: comments
  };
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
  o.author = normalizeUser(pr.author);
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

  o.events = o.events.concat(
    pr.reviewThreads.edges.map(normalizeReviewThread)
  );

  o.events.sort((a, b) => (a.date - b.date));

  return o;
}
