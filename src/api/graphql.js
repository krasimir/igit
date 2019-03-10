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
