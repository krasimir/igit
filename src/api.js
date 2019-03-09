/* eslint-disable camelcase, max-len */
import db from './db';
import { NO_TOKEN, USE_MOCKS } from './constants';

function createAPI() {
  const endpoint = 'https://api.github.com';
  const endpointGraphQL = 'https://api.github.com/graphql';
  const api = {};

  let token = null;
  let profile = null;

  /* ---------------- helpers ---------------- */

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'token ' + token
  });
  const request = async function (endpointPath, absolute = false) {
    const res = await fetch((absolute === false ? endpoint : '') + endpointPath, { headers: getHeaders() });

    if (!res.ok) {
      throw new Error(res.status + ' ' + res.statusText);
    }
    return res.json();
  };
  const requestGraphQL = async function (query) {
    const res = await fetch(endpointGraphQL, {
      headers: getHeaders(),
      method: 'POST',
      body: JSON.stringify({ query })
    });

    if (!res.ok) {
      throw new Error(res.status + ' ' + res.statusText);
    }
    return res.json();
  };
  const requestMock = async function (file) {
    const res = await fetch('/mocks/' + file);

    if (!res.ok) {
      throw new Error(res.status + ' ' + res.statusText);
    }
    return res.json();
  };

  /* ---------------- methods ---------------- */

  api.getProfile = async () => {
    if (profile === null) {
      const fromDB = await db.getProfile();

      if (fromDB === null) {
        return NO_TOKEN;
      }
      profile = fromDB;
      token = profile.token;
    }
    return profile;
  };
  api.setToken = (t) => (token = t);
  api.verify = async function () {
    if (USE_MOCKS) {
      const { name, avatar_url } = await requestMock('user.json');

      db.setProfile(profile = {
        name,
        avatar: avatar_url,
        token
      });
      return profile;
    }
    const { name, avatar_url } = await request('/user');

    db.setProfile(profile = {
      name,
      avatar: avatar_url,
      token
    });
    return profile;
  };
  // api.fetchRemoteRepos = async function () {
  //   if (USE_MOCKS) return requestMock('user.repos.json');

  //   let page = 1;
  //   let repos = [];
  //   const get = async () => {
  //     const data = await request('/user/repos?per_page=50&page=' + page);

  //     if (data.length > 0) {
  //       repos = repos.concat(data);
  //       page += 1;
  //       return await get();
  //     }
  //     return repos;
  //   };

  //   return get();
  // };
  api.fetchRemoteRepos = async function () {
    if (USE_MOCKS) return requestMock('user.repos.json');

    let perPage = 50;
    let cursor;
    let repos = [];
    const get = async () => {

      const { data } = await requestGraphQL(`
      query {
        search(query: "org:trialreach", type: REPOSITORY, first: ${ perPage }${ cursor ? `, after: ${ cursor }` : ''}) {
          repositoryCount,
          edges {
            cursor,
            node {
              ... on Repository {
                name,
                id,
                nameWithOwner,
                homepageUrl,
                isPrivate
              }
            }
          }
        }
      }
      `);

      repos = repos.concat(data.search.edges);

      if (data.search.repositoryCount > repos.length) {
        cursor = repos[repos.length - 1].cursor.replace('==', '');
        return await get();
      }
      return repos.map(({ node }) => node);
    };

    return get();
  };
  api.getLocalRepos = function () {
    return db.getRepos();
  };
  api.toggleRepo = function (repo) {
    return db.toggleRepo(repo);
  };
  api.fetchRemotePR = async function (repo, pr) {
    // if (USE_MOCKS) return requestMock('pr_rejected.json');
    if (USE_MOCKS) return requestMock('pr.json');

    pr.githorn_commits = await request(pr.commits_url, true);
    pr.githorn_reviews_comments = await request(pr.review_comments_url, true);
    pr.githorn_reviews = await request(`/repos/${ repo.owner }/${ repo.repo }/pulls/${ pr.number }/reviews`);

    // console.log(JSON.stringify(pr, null, 2));

    return pr;
  };
  api.fetchRemotePRs = async function (repo) {
    if (USE_MOCKS) return requestMock('pulls.json');

    return await request(`/repos/${ repo.fullName }/pulls`);
  };

  return api;
}

const api = createAPI();

export default api;
