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
