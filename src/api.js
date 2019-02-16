export default function createAPI() {
  const endpoint = 'https://api.github.com';
  const api = {};
  let token = null;

  api.setToken = (t) => (token = t);
  api.verify = async function () {
    const res = await fetch(
      endpoint + '/user',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token ' + token
        }
      }
    );

    if (!res.ok) {
      throw new Error(res.status + ' ' + res.statusText);
    }

    return res.json();
  };

  return api;
}
