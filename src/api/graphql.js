const REVIEW_COMMENT = `
__typename
id
publishedAt
createdAt
path
position
originalPosition
outdated
url
author {
  login
  avatarUrl
}
body
diffHunk
commit {
  oid
  url
}
replyTo {
  id
}
pullRequest {
  id
}
pullRequestReview {
  id
}
`;

const REVIEW_THREAD = `
__typename
id
isResolved
comments(first: 50) {
  totalCount
  edges {
    node {
      ${ REVIEW_COMMENT }
    }
  }
}`;

export const QUERY_GET_REPOS_OF_ORG = (query, perPage, cursor) => `
  query {
    search(query: "${ query }", type: REPOSITORY, first: ${ perPage }${ cursor ? `, after: ${ cursor }` : ''}) {
      repositoryCount,
      edges {
        cursor,
        node {
          ... on Repository {
            name,
            id,
            nameWithOwner,
            isPrivate,
            owner {
              login
            }
          }
        }
      }
    }
  }
`;

export const QUERY_GET_ORGANIZATIONS = () => `
  query {
    viewer {
      name,
      organizations(first: 100) {
        nodes {
          name,
          login
        }
      }
    }
  }
`;

export const QUERY_GET_PRS = (name, owner, perPage, cursor) => `{
  search(query: "${ name } in:name user:${ owner }", type: REPOSITORY, first: 1) {
    edges {
      node {
        ... on Repository {
          name,
          owner {
              login
          },
          pullRequests(states: OPEN, first: ${ perPage }${ cursor ? `, after: "${ cursor }"` : ''}) {
            totalCount
            edges {
              cursor
              node {
                id
                number
                title
                url
                baseRefName
                headRefName
                headRepository {
                  owner {
                    login
                  }
                }
                createdAt
                updatedAt
                permalink
                author {
                  login
                  avatarUrl
                  url
                }
                changedFiles
                additions
                deletions
                mergeable
                merged
                mergedAt
                closed
                closedAt
                body
                timeline(first: 100) {
                  totalCount
                  edges {
                    cursor
                    node {
                      __typename
                      ... on Commit {
                        oid
                        id
                        author {
                          name
                          avatarUrl
                          user {
                            login
                          }
                        }
                        message
                        additions
                        deletions
                        url
                        committedDate
                      }
                      ... on RenamedTitleEvent {
                        id
                        actor {
                          avatarUrl
                          login
                        }
                        currentTitle
                        previousTitle
                        createdAt
                      }
                      ... on CrossReferencedEvent {
                        id,
                        actor {
                          avatarUrl
                          login
                        }
                        referencedAt
                        target {
                          ... on Issue {
                            title
                            url
                          }
                          ... on PullRequest {
                            title
                            url
                          }
                        }
                        url
                      }
                      ... on PullRequestReview {
                        id
                        author {
                          avatarUrl
                          login
                        }
                        body
                        createdAt
                        submittedAt
                        state
                        url
                      }
                      ... on PullRequestReviewComment {
                        id
                        pullRequestReview {
                          id
                        }
                        author {
                          avatarUrl
                          login
                        }
                        path
                        body
                        outdated
                        publishedAt
                        createdAt
                        diffHunk
                        replyTo {
                          id
                        }
                        url
                        position
                        originalPosition
                      }
                      ... on IssueComment {
                        id
                        author {
                          avatarUrl
                          login
                        }
                        body
                        publishedAt
                        createdAt
                        url
                      }
                      ... on MergedEvent {
                        id
                        actor {
                          avatarUrl
                          login
                        }
                        commit {
                          oid
                          commitUrl
                        }
                        mergeRefName
                        createdAt
                        url
                      }
                      ... on ReferencedEvent {
                        id
                        actor {
                          avatarUrl
                          login
                        }
                        createdAt
                        subject {
                          ... on Issue {
                            title
                            url
                          }
                          ... on PullRequest {
                            title
                            url
                          }
                        }
                      }
                    }
                  }
                }
                reviewThreads(first: 50) {
                  totalCount
                  edges {
                    node {
                      ${ REVIEW_THREAD }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

export const MUTATION_ADD_COMMENT = (subjectId, body) => `
  mutation {
    addComment(input: {
      subjectId: "${ subjectId }",
      body: ${ JSON.stringify(body) }
    }) {
      commentEdge {
        node {
          __typename
          id
          author {
            avatarUrl
            login
          }
          body
          publishedAt
          createdAt
          url
        }
      }
    }
  }
`;

export const MUTATION_EDIT_COMMENT = (id, body) => `
  mutation {
    updateIssueComment(input: {
      id: "${ id }",
      body: ${ JSON.stringify(body) }
    }) {
      issueComment {
        __typename
        id
        author {
          avatarUrl
          login
        }
        body
        publishedAt
        createdAt
        url
      }
    }
  }
`;

export const MUTATION_DELETE_COMMENT = (id) => `
  mutation {
    deleteIssueComment(input: {
      id: "${ id }"
    }) {
      clientMutationId
    }
  }
`;

export const MUTATION_PR_THREAD_COMMENT = (id, body) => `
  mutation {
    updatePullRequestReviewComment(input: {
      pullRequestReviewCommentId: "${ id }",
      body: ${ JSON.stringify(body) }
    }) {
      pullRequestReviewComment {
        __typename
        id
        pullRequestReview {
          id
        }
        author {
          avatarUrl
          login
        }
        path
        body
        outdated
        publishedAt
        createdAt
        diffHunk
        replyTo {
          id
        }
        url
        position
        originalPosition
      }
    }
  }
`;

export const MUTATION_DELETE_PR_THREAD_COMMENT = (id) => `
  mutation {
    deletePullRequestReviewComment(input: {
      id: "${ id }"
    }) {
      clientMutationId
    }
  }
`;

export const MUTATION_ADD_PR_THREAD_COMMENT = (pullRequestReviewId, inReplyTo, path, position, body) => `
  mutation {
    addPullRequestReviewComment(input: {
      pullRequestReviewId: "${ pullRequestReviewId }",
      ${ inReplyTo ? `inReplyTo: "${ inReplyTo }"` : '' },
      path: "${ path }",
      position: ${ position },
      body: ${ JSON.stringify(body) }
    }) {
      comment {
        ${ REVIEW_COMMENT }
      }
    }
  }
`;

export const MUTATION_CREATE_REVIEW = (pullRequestId, event, path, position, body) => `
mutation {
  addPullRequestReview(input: {
    pullRequestId: "${ pullRequestId }"
    ${ event ? `event: ${ event }` : ''}
    ${ body ? `body: ${ JSON.stringify(body) }` : ''}
    ${ (path && position && body) ? `comments: [
      {
        path: "${ path }",
        position: ${ position },
        body: ${ JSON.stringify(body) }
      }
    ]` : '' }
  }) {
    pullRequestReview {
      __typename
      id
      author {
        avatarUrl
        login
      }
      body
      createdAt
      submittedAt
      state
      url,
      comments(first: 1) {
        edges {
          node {
            __typename
            ... on PullRequestReviewComment {
              id
              pullRequestReview {
                id
              }
              author {
                avatarUrl
                login
              }
              path
              body
              outdated
              publishedAt
              createdAt
              diffHunk
              replyTo {
                id
              }
              url
              position
              originalPosition
            }
          }
        }
      }
    }
  }
}
`;

export const MUTATION_SUBMIT_REVIEW = (pullRequestReviewId, event, body) => `
mutation {
  submitPullRequestReview(input: {
    pullRequestReviewId: "${ pullRequestReviewId }"
    event: ${ event }
    ${ body ? `body: ${ JSON.stringify(body) }` : '' }
  }) {
    pullRequestReview {
      __typename
      id
      author {
        avatarUrl
        login
      }
      body
      createdAt
      submittedAt
      state
      url
    }
  }
}
`;

export const MUTATION_DELETE_REVIEW = (pullRequestReviewId) => `
mutation {
  deletePullRequestReview(input: {
    pullRequestReviewId: "${ pullRequestReviewId }"
  }) {
    pullRequestReview {
      __typename
      id
      author {
        avatarUrl
        login
      }
      body
      createdAt
      submittedAt
      state
      url
    }
  }
}
`;

export const MUTATION_RESOLVE_THREAD = (threadId) => `
mutation {
  resolveReviewThread(input: {
    threadId: "${ threadId }"
  }) {
    thread {
      ${ REVIEW_THREAD }
    }
  }
}
`;

export const MUTATION_UNRESOLVE_THREAD = (threadId) => `
mutation {
  unresolveReviewThread(input: {
    threadId: "${ threadId }"
  }) {
    thread {
      ${ REVIEW_THREAD }
    }
  }
}
`;
