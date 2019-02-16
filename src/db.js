import Dexie from 'dexie';

export default function db() {
  const api = {};

  const db = new Dexie('GitHorn');

  db.version(1).stores({
    profile: '++id, token, name, avatar'
  });

  api.getProfile = async function () {
    const res = await db.profile.toArray();

    if (res.length === 0) {
      return null;
    }
    return res.shift();
  };
  api.setProfile = async function (token, name, avatar) {
    db.profile.add({ token, name, avatar });
  };

  return api;
}
