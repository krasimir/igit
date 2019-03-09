import roger from '../jolly-roger';

import api from '../api';

roger.context({
  async getPRs(repo) {
    return await api.fetchRemotePRs(repo);
  },
  async getPR({ repo, pr }) {
    return await api.fetchRemotePR(repo, pr);
  }
});
