/* eslint-disable camelcase, max-len, no-sequences */
import db from '../db';
import { NO_TOKEN, USE_MOCKS } from '../constants';
import { QUERY_GET_REPOS_OF_ORG, QUERY_GET_ORGANIZATIONS, QUERY_GET_PRS, QUERY_PR } from './graphql';
import { createOrganization, createProfile, createRepo, createPR, createPRDetails } from './models';

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

  api.setToken = (t) => (token = t);
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
  api.verify = async function () {
    if (USE_MOCKS) {
      const profile = await requestMock('profile.json');

      db.setProfile(profile);
      return profile;
    }
    const data = await request('/user');

    db.setProfile(profile = createProfile(data, token));
    // console.log(JSON.stringify(profile, null, 2));
    return profile;
  };
  api.fetchOrganizations = async function () {
    if (USE_MOCKS) return requestMock('orgs.json');

    const { data } = await requestGraphQL(QUERY_GET_ORGANIZATIONS());

    return data.viewer.organizations.nodes.map(createOrganization);
  };
  api.fetchRemoteRepos = function (query) {
    if (USE_MOCKS) return requestMock('remote.repos.json');

    let perPage = 50;
    let cursor;
    let repos = [];
    const get = async () => {

      const q = QUERY_GET_REPOS_OF_ORG(query, perPage, cursor);
      const { data } = await requestGraphQL(q);

      repos = repos.concat(data.search.edges);

      if (data.search.repositoryCount > repos.length) {
        cursor = repos[repos.length - 1].cursor.replace('==', '');
        return await get();
      }
      return repos.map(({ node }) => createRepo(node));
    };

    return get();
  };
  api.getLocalRepos = function () {
    return db.getRepos();
  };
  api.toggleRepo = function (repo) {
    return db.toggleRepo(repo);
  };
  api.fetchRemotePRs = async function (repo) {
    if (USE_MOCKS) return requestMock('prs.json');

    let perPage = 10;
    let cursor;
    let prs = [];
    const get = async () => {

      const q = QUERY_GET_PRS(repo.name, repo.owner, perPage, cursor);
      const { data } = await requestGraphQL(q);
      const pullRequests = data.search.edges[0].node.pullRequests;

      prs = prs.concat(pullRequests.edges);

      if (pullRequests.totalCount > prs.length) {
        cursor = prs[prs.length - 1].cursor.replace('==', '');
        return get();
      }
      return prs.map(({ node }) => createPR(node));
    };

    return get();
  };
  api.fetchRemotePR = async function (repo, pr) {
    // if (USE_MOCKS) return requestMock('pr_rejected.json');
    // if (USE_MOCKS) return requestMock('pr.json');

    const q = QUERY_PR(repo.name, repo.owner, pr.number);
    const { data } = await requestGraphQL(q);

    return createPRDetails(data);
  };

  return api;
}

const api = createAPI();

export default api;
