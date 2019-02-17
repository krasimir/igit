const USE_MOCKS = true;

function createAPI() {
  const endpoint = 'https://api.github.com';
  const api = {};
  let token = null;

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

  api.setToken = (t) => (token = t);
  api.verify = async function () {
    if (USE_MOCKS) return requestMock('user.json');
    return request('/user');
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
