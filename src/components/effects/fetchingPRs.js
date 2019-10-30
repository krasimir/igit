import { getPullingInterval } from '../Settings/PullingInterval';
import { PRINT_PRS, PULLING } from '../../constants';

export default function fetchingPRs({ api, data, state, subscribedRepos, props, registerPRs }) {
  const numberOfFetches = state(0);
  const [ fetchingPRs, setFetchingPRs ] = state(false);
  const [ error, setError ] = state(null);
  const [ fetchDataInterval, setFetchDataInterval ] = state(null);
  const [ getRepos ] = subscribedRepos;
  const { match } = props();
  const { name, prNumber, op } = match.params;
  const newFetch = numberOfFetches.mutate(value => value + 1);

  async function fetchData({ repos, repoName, prNumber }) {
    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i];
      const prs = await api.fetchRemotePRs(repo);

      if (PRINT_PRS) {
        console.log(repo.name, JSON.stringify(prs, null, 2));
      }

      if (
        prNumber &&
        repo.name === repoName &&
        prs.find(pr => pr.number === parseInt(prNumber, 10)) === undefined
      ) {
        const otherPR = await api.fetchRemotePR(repo, prNumber);

        if (otherPR) {
          prs.push(otherPR);
        }
      }
      registerPRs({ repo, prs });
    }
  }

  const f = () => {
    newFetch();
    setFetchingPRs(true);
    clearTimeout(fetchDataInterval);
    fetchData({
      repos: getRepos(),
      repoName: name,
      prNumber: prNumber !== 'new' && op !== 'edit' ? prNumber : undefined
    }).then(
      () => {
        setFetchingPRs(false);
        if (PULLING) {
          setFetchDataInterval(setTimeout(f, getPullingInterval()));
        }
      },
      error => {
        setFetchingPRs(false);
        console.error(error);
        setError(error);
      }
    );
  };

  f();

  data({
    fetchingPRs,
    numberOfFetches,
    triggerUpdate: f,
    error
  });

  return () => {
    clearTimeout(fetchDataInterval);
  };
};
