import Dexie from 'dexie';

function createDb() {
  const api = {};

  const db = new Dexie('GitHorn');

  db.version(1).stores({
    profile: '++id, token, name, avatar',
    repos: '++id, repoId, owner, repo, fullName'
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
  api.getRepos = function () {
    return db.repos.toArray();
  };
  api.toggleRepo = async function (repo) {
    const currentRepos = await db.repos.toArray();
    const repoInDB = currentRepos.find(({ repoId }) => repoId === repo.id);

    if (repoInDB) {
      await db.repos.where('repoId').equals(repo.id).delete();
    } else {
      await db.repos.add({
        repoId: repo.id,
        fullName: repo.full_name,
        owner: repo.owner.login,
        repo: repo.name
      });
    }

    return db.repos.toArray();
  };

  return api;
}

const db = createDb();

export default db;
