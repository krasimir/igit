import roger from '../jolly-roger';

import api from '../api';

roger.context({
  async getPRs(repo) {
    return await api.fetchRemotePRs(repo);
  }
});
