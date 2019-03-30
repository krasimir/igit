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

export function normalizeTimelineEvent({ node }) {
  switch (node.__typename) {
    case 'Commit':
      return {
        oid: node.oid,
        id: node.id,
        url: node.url,
        type: node.__typename,
        author: normalizeUser(node.author),
        message: node.message,
        additions: node.additions,
        deletions: node.deletions,
        date: new Date(node.committedDate)
      };
    case 'RenamedTitleEvent':
      return {
        id: node.id,
        type: node.__typename,
        author: normalizeUser(node.actor),
        date: new Date(node.createdAt),
        currentTitle: node.currentTitle,
        previousTitle: node.previousTitle
      };
    case 'CrossReferencedEvent':
      return {
        id: node.id,
        type: node.__typename,
        author: normalizeUser(node.actor),
        date: new Date(node.referencedAt),
        target: node.target,
        url: node.url
      };
    case 'PullRequestReview':
      return {
        id: node.id,
        type: node.__typename,
        author: normalizeUser(node.author),
        body: node.body,
        state: node.state,
        url: node.url,
        date: new Date(node.submittedAt || node.createdAt)
      };
    case 'PullRequestReviewComment':
      return {
        id: node.id,
        type: node.__typename,
        author: normalizeUser(node.author),
        body: node.body,
        outdated: node.outdated,
        diffHunk: node.diffHunk,
        replyTo: node.replyTo ? node.replyTo.id : null,
        url: node.url,
        date: new Date(node.publishedAt || node.createdAt),
        path: node.path,
        position: node.position === null ? node.originalPosition : node.position,
        commit: node.commit,
        pullRequestReviewId: node.pullRequestReview.id,
        pullRequestId: node.pullRequest ? node.pullRequest.id : null
      };
    case 'IssueComment':
      return {
        id: node.id,
        type: node.__typename,
        author: normalizeUser(node.author),
        body: node.body,
        date: new Date(node.publishedAt || node.createdAt),
        url: node.url
      };
    case 'MergedEvent':
      return {
        id: node.id,
        type: node.__typename,
        author: normalizeUser(node.actor),
        commit: node.commit,
        ref: node.mergeRefName,
        date: new Date(node.createdAt),
        url: node.url
      };
    case 'ReferencedEvent':
      return {
        id: node.id,
        type: node.__typename,
        author: normalizeUser(node.actor),
        date: new Date(node.createdAt),
        target: node.subject
      };
  }

  return false;
}

function normalizeReviewThread({ node }) {
  const comments = node.comments.edges.map(({ node: commentNode }) => ({
    id: commentNode.id,
    author: normalizeUser(commentNode.author),
    body: commentNode.body,
    date: new Date(commentNode.publishedAt || commentNode.createdAt),
    diffHunk: commentNode.diffHunk,
    path: commentNode.path,
    position: commentNode.position === null ? commentNode.originalPosition : commentNode.position,
    url: commentNode.url,
    outdated: commentNode.outdated,
    commit: commentNode.commit,
    replyTo: commentNode.replyTo ? commentNode.replyTo.id : null,
    pullRequestReviewId: commentNode.pullRequestReview ? commentNode.pullRequestReview.id : null,
    pullRequestId: commentNode.pullRequest ? commentNode.pullRequest.id : null,
    isResolved: node.isResolved
  }));

  return {
    type: 'PullRequestReviewThread',
    isResolved: node.isResolved,
    date: new Date(comments[comments.length - 1].date),
    comments: comments
  };
}

export default function createPRDetails(pr, baseRepoOwner) {
  const o = {};

  o.id = pr.id;
  o.number = pr.number;
  o.title = pr.title;
  o.url = pr.url;
  o.base = {
    ref: pr.baseRefName,
    owner: baseRepoOwner
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
  o.closed = pr.closed;
  o.closedAt = new Date(pr.closedAt);
  o.merged = pr.merged;
  o.mergedAt = new Date(pr.mergedAt);
  o.body = pr.body;
  o.events = [];

  o.events = o.events.concat(
    pr.timeline.edges
      .map(normalizeTimelineEvent)
      .filter(event => event),
    pr.reviewThreads.edges.map(normalizeReviewThread)
  );

  o.events.sort((a, b) => {
    return a.date - b.date;
  });

  return o;
}
