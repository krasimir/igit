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

export const QUERY_GET_PRS = (name, owner, perPage, cursor) => `
  query {
    search(query: "${ name } in:name user:${ owner }", type: REPOSITORY, first: 1) {
      edges {
        node {
          ... on Repository {
            pullRequests(states: OPEN, first: ${ perPage }${ cursor ? `, after: ${ cursor }` : ''}) {
              totalCount,
              edges {
                cursor,
                node {
                  id,
                  title,
                  number,
                  url,
                  headRefName,
                  author {
                    login,
                    avatarUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const QUERY_PR = (name, owner, prNumber) => `
  query {
    repository(name: "${ name }", owner: ${ owner }) {
      name,
      owner {
          login
      },
      pullRequest(number: ${ prNumber }) {
        id,
        number,
        title,
        baseRefName,
        headRefName,
        headRepository {
            owner {
                login
            }
        }
        createdAt,
        updatedAt,
        permalink,
        author {
            login,
            avatarUrl,
            url
        },
        changedFiles,
        additions,
        deletions,
        mergeable,
        body,
        timeline(first:100) {
            totalCount,
            edges {
                cursor,
                node {
                    __typename
                    ... on Commit {
                        oid,
                        author {
                            name,
                            avatarUrl
                        },
                        message,
                        additions,
                        deletions,
                        url,
                        committedDate,
                    },
                    ... on RenamedTitleEvent {
                        actor {
                            avatarUrl
                            login
                        },
                        currentTitle,
                        previousTitle
                    },
                    ... on CrossReferencedEvent {
                        actor {
                            avatarUrl
                            login
                        },
                        referencedAt,
                        target {
                            ... on Issue {
                                title,
                                url
                            },
                            ... on PullRequest {
                                title,
                                url
                            }
                        }
                    },
                    ... on PullRequestReview {
                        id,
                        author {
                            avatarUrl,
                            login
                        },
                        body,
                        submittedAt,
                        state
                    },
                    ... on PullRequestReviewComment {
                        pullRequestReview {
                            id
                        }
                        author {
                            avatarUrl,
                            login
                        },
                        body,
                        outdated,
                        publishedAt,
                        diffHunk,
                        replyTo {
                            id
                        }
                    },
                    ... on PullRequestReviewThread {
                        id,
                        isResolved,
                        resolvedBy {
                            avatarUrl,
                            name
                        }
                    },
                    ... on IssueComment {
                        author {
                            avatarUrl,
                            login
                        },
                        body,
                        publishedAt
                    },
                    ... on MergedEvent {
                        actor {
                            avatarUrl,
                            login
                        },
                        commit {
                            oid,
                            commitUrl
                        }
                        mergeRefName,
                        createdAt
                    }
                    ... on ReferencedEvent {
                       actor {
                            avatarUrl,
                            login
                        },
                        subject {
                            ... on Issue {
                                title,
                                url
                            },
                            ... on PullRequest {
                                title,
                                url
                            }
                        }
                    }
                }
            }
        },
        reviewThreads(first: 50) {
            totalCount,
            edges {
                node {
                    isResolved,
                    comments(first:50) {
                        totalCount,
                        edges {
                            node {
                                publishedAt,
                                author {
                                    login,
                                    avatarUrl
                                },
                                body,
                                diffHunk
                            }
                        }
                    }
                }
            }
        }
      }
    }
  }
`;
