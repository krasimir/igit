import Dexie from 'dexie';

export default function db() {
  const api = {};

  const db = new Dexie('GitHorn');

  db.version(1).stores({
    profile: `name, avatar, token`
  });

  api.getProfile = async function() {
    const res = await db.profile.toArray();

    if (res.length === 0) {
      return null;
    }
    return res.shift();
  }

  return api;
}