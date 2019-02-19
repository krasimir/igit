/* eslint-disable camelcase */
import db from './db';
import { NO_TOKEN } from './constants';

const USE_MOCKS = false;

function createAPI() {
  const endpoint = 'https://api.github.com';
  const api = {};

  let token = null;
  let profile = null;

  /* ---------------- helpers ---------------- */

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'token ' + token
  });
  const request = async function (endpointPath) {
    const res = await fetch(endpoint + endpointPath, { headers: getHeaders() });

    if (!res.ok) {
      throw new Error(res.status + ' ' + res.statusText);
    }
    return res.json();
  };
  const requestMock = async function (file) {
    const res = await fetch('./mocks/' + file);

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
      return fromDB;
    }
    return profile;
  };
  api.setToken = (t) => (token = t);
  api.verify = async function () {
    if (USE_MOCKS) return (profile = await requestMock('user.json'));
    const { name, avatar_url } = await request('/user');

    db.setProfile(profile = {
      name,
      avatar: avatar_url,
      token
    });
    return profile;
  };
  api.getRepos = function () {
    if (USE_MOCKS) return requestMock('user.repos.json');

    let page = 1;
    let repos = [];
    const get = async () => {
      const res = await fetch(endpoint + '/user/repos?per_page=50&page=' + page, { headers: getHeaders() });

      if (!res.ok) {
        throw new Error(res.status + ' ' + res.statusText);
      }

      const data = await res.json();

      if (data.length > 0) {
        repos = repos.concat(data);
        page += 1;
        return await get();
      }
      return repos;
    };

    return get();
  };

  return api;
}

const api = createAPI();

export default api;
