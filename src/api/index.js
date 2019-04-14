/* eslint-disable camelcase, max-len, no-sequences */
import db from './db';
import { NO_TOKEN, USE_MOCKS } from '../constants';
import {
  QUERY_GET_REPOS_OF_ORG,
  QUERY_GET_ORGANIZATIONS,
  QUERY_GET_PRS,
  QUERY_GET_PR,
  MUTATION_ADD_COMMENT,
  MUTATION_EDIT_COMMENT,
  MUTATION_DELETE_COMMENT,
  MUTATION_PR_THREAD_COMMENT,
  MUTATION_DELETE_PR_THREAD_COMMENT,
  MUTATION_ADD_PR_THREAD_COMMENT,
  MUTATION_CREATE_REVIEW,
  MUTATION_SUBMIT_REVIEW,
  MUTATION_DELETE_REVIEW,
  MUTATION_RESOLVE_THREAD,
  MUTATION_UNRESOLVE_THREAD,
  MUTATION_MERGE_PR,
  MUTATION_CLOSE_PR,
  QUERY_GET_PR_STATUSES
} from './graphql';
import {
  createOrganization,
  createProfile,
  createRepo,
  createPRDetails,
  normalizeTimelineEvent,
  createStatus
} from './models';

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
  const request = async function (endpointPath, absolute = false, additionalHeaders = {}) {
    const res = await fetch(
      (absolute === false ? endpoint : '') + endpointPath,
      {
        headers: {
          ...getHeaders(),
          ...additionalHeaders
        }
      }
    );

    if (!res.ok) {
      throw new Error(res.status + ' ' + res.statusText);
    }
    if (res.headers.get('Content-Type').indexOf('application/json') >= 0) {
      return res.json();
    }
    return res.text();
  };
  const requestGraphQL = async function (query, customHeaders = {}) {
    const res = await fetch(endpointGraphQL, {
      headers: Object.assign({}, getHeaders(), customHeaders),
      method: 'POST',
      body: JSON.stringify({ query })
    });

    if (!res.ok) {
      throw new Error(res.status + ' ' + res.statusText);
    }
    const resultData = await res.json();

    if (resultData.errors) {
      console.error(resultData.errors);
      throw new Error(resultData.errors.map(({ message }) => message));
    }
    return resultData;
  };
  const requestMock = async function (file) {
    const res = await fetch('/mocks/' + file);

    if (!res.ok) {
      throw new Error(res.status + ' ' + res.statusText);
    }
    if (res.headers.get('Content-Type').indexOf('application/json') >= 0) {
      return res.json();
    }
    return res.text();
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
    if (USE_MOCKS) return requestMock(USE_MOCKS + '/prs.json');

    let perPage = 10;
    let cursor;
    let prs = [];
    const get = async () => {

      const q = QUERY_GET_PRS(repo.name, repo.owner, perPage, cursor);
      const { data } = await requestGraphQL(q);
      const repoData = data.search.edges[0].node;

      prs = prs.concat(repoData.pullRequests.edges);

      if (repoData.pullRequests.totalCount > prs.length) {
        cursor = prs[prs.length - 1].cursor.replace('==', '');
        return get();
      }
      return prs.map(({ node }) => createPRDetails(node, repoData.owner.login));
    };

    return get();
  };
  api.fetchRemotePR = async function (repo, prNumber) {
    if (USE_MOCKS) return requestMock(USE_MOCKS + '/prs.json')[0];

    const q = QUERY_GET_PR(repo.name, repo.owner, prNumber);
    const { data } = await requestGraphQL(q);
    const repoData = data.repository;

    return createPRDetails(repoData.pullRequest, repoData.owner.login);
  };
  api.fetchPRFiles = function (repo, prNumber) {
    if (USE_MOCKS) return requestMock(USE_MOCKS + '/diff');

    return request(
      `/repos/${ repo.owner }/${ repo.name }/pulls/${ prNumber }`,
      false,
      { 'Accept': 'application/vnd.github.v3.diff' }
    );
  };
  api.fetchPRFile = function (repo, path, commit) {
    return request(
      `/repos/${ repo.owner }/${ repo.name }/contents/${ path }?ref=${ commit }`,
      true,
      { 'Accept': 'application/vnd.github.v3.raw' }
    );
  };
  api.addComment = async function (subjectId, body) {
    const q = MUTATION_ADD_COMMENT(subjectId, body);
    const { data } = await requestGraphQL(q);

    return normalizeTimelineEvent(data.addComment.commentEdge);
  };
  api.editComment = async function (id, body) {
    // if (USE_MOCKS) return requestMock(USE_MOCKS + '/mutation.json');

    const q = MUTATION_EDIT_COMMENT(id, body);
    const { data } = await requestGraphQL(q, { Accept: 'application/vnd.github.starfire-preview+json' });

    return normalizeTimelineEvent({ node: data.updateIssueComment.issueComment });
  };
  api.deleteComment = async function (id) {
    const q = MUTATION_DELETE_COMMENT(id);

    await requestGraphQL(q, { Accept: 'application/vnd.github.starfire-preview+json' });
  };
  api.newPullRequestReviewComment = async function (pullRequestReviewId, inReplyTo, path, position, body) {
    const q = MUTATION_ADD_PR_THREAD_COMMENT(pullRequestReviewId, inReplyTo, path, position, body);
    const { data } = await requestGraphQL(q);

    return normalizeTimelineEvent({ node: data.addPullRequestReviewComment.comment });
  };
  api.createReview = async function (pullRequestId, event, path, position, body) {
    const q = MUTATION_CREATE_REVIEW(pullRequestId, event, path, position, body);
    const { data } = await requestGraphQL(q);

    return {
      review: normalizeTimelineEvent({ node: data.addPullRequestReview.pullRequestReview }),
      comments: data.addPullRequestReview.pullRequestReview.comments.edges.map(normalizeTimelineEvent)
    };
  };
  api.submitReview = async function (pullRequestReviewId, event, body) {
    const q = MUTATION_SUBMIT_REVIEW(pullRequestReviewId, event, body);
    const { data } = await requestGraphQL(q);

    return normalizeTimelineEvent({ node: data.submitPullRequestReview.pullRequestReview });
  };
  api.deleteReview = async function (pullRequestReviewId) {
    const q = MUTATION_DELETE_REVIEW(pullRequestReviewId);

    await requestGraphQL(q);
  };
  api.editPRThreadComment = async function (id, body) {
    // if (USE_MOCKS) return requestMock(USE_MOCKS + '/mutation.json');

    const q = MUTATION_PR_THREAD_COMMENT(id, body);
    const { data } = await requestGraphQL(q, { Accept: 'application/vnd.github.starfire-preview+json' });

    return normalizeTimelineEvent({ node: data.updatePullRequestReviewComment.pullRequestReviewComment });
  };
  api.deletePRThreadComment = async function (id) {
    const q = MUTATION_DELETE_PR_THREAD_COMMENT(id);

    await requestGraphQL(q, { Accept: 'application/vnd.github.starfire-preview+json' });
  };
  api.resolveThread = async function (id) {
    const q = MUTATION_RESOLVE_THREAD(id);
    const { data } = await requestGraphQL(q);

    return normalizeTimelineEvent({ node: data.resolveReviewThread.thread });
  };
  api.unresolveThread = async function (id) {
    const q = MUTATION_UNRESOLVE_THREAD(id);
    const { data } = await requestGraphQL(q);

    return normalizeTimelineEvent({ node: data.unresolveReviewThread.thread });
  };
  api.markAsRead = function (id) {
    if (Array.isArray(id)) {
      return db.markAsReadBulk(id);
    }
    return db.markAsRead(id);
  };
  api.markAsUnread = function (id) {
    if (Array.isArray(id)) {
      return db.bulkDelete(id);
    }
    return db.delete(id);
  };
  api.getNotifications = async function () {
    return (await db.getNotifications()).map(({ objectId }) => objectId);
  };
  api.mergePR = async function (id, repo) {
    const q = MUTATION_MERGE_PR(id);
    const { data } = await requestGraphQL(q);

    return createPRDetails(data.mergePullRequest.pullRequest, repo.owner.login);
  };
  api.closePR = async function (id, repo) {
    const q = MUTATION_CLOSE_PR(id);
    const { data } = await requestGraphQL(q);

    return createPRDetails(data.closePullRequest.pullRequest, repo.owner.login);
  };
  api.getPRStatuses = async function (prNumber, repo) {
    const q = QUERY_GET_PR_STATUSES(prNumber, repo.name, repo.owner);
    const { data } = await requestGraphQL(q);

    return data.repository.pullRequest.commits.edges.map(createStatus);
  };

  return api;
}

const api = createAPI();

export default api;
