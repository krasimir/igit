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
          pullRequests(states: OPEN, first: ${ perPage }${ cursor ? `, after: ${ cursor }` : ''}) {
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
                        actor {
                          avatarUrl
                          login
                        }
                        currentTitle
                        previousTitle
                        createdAt
                      }
                      ... on CrossReferencedEvent {
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
                        submittedAt
                        state
                        url
                      }
                      ... on PullRequestReviewComment {
                        pullRequestReview {
                          id
                        }
                        author {
                          avatarUrl
                          login
                        }
                        body
                        outdated
                        publishedAt
                        diffHunk
                        replyTo {
                          id
                        }
                        url
                      }
                      ... on IssueComment {
                        author {
                          avatarUrl
                          login
                        }
                        body
                        publishedAt
                        url
                      }
                      ... on MergedEvent {
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
                      isResolved
                      comments(first: 50) {
                        totalCount
                        edges {
                          node {
                            publishedAt
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
      }
    }
  }
}`;
