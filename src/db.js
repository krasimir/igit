import Dexie from 'dexie';

function createDb() {
  const api = {};

  const db = new Dexie('GitHorn');

  db.version(1).stores({
    profile: '++id, token, name, avatar',
    repos: '++id, repoId, owner, repo, fullName, githubURL'
  });

  api.getProfile = async function () {
    const res = await db.profile.toArray();

    if (res.length === 0) {
      return null;
    }
    return res.shift();
  };
  api.setProfile = async function (profile) {
    db.profile.add(profile);
  };
  api.getRepos = function () {
    return db.repos.toArray();
  };
  api.toggleRepo = async function (repo) {
    const currentRepos = await db.repos.toArray();
    const repoInDB = currentRepos.find(({ repoId }) => repoId === repo.repoId);

    if (repoInDB) {
      await db.repos.where('repoId').equals(repo.repoId).delete();
    } else {
      await db.repos.add(repo);
    }
  };

  return api;
}

const db = createDb();

export default db;
