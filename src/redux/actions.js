import {
  NO_TOKEN,
  SET_PROFILE,
  TOGGLE_REPO,
  SET_SUBSCRIBED_REPOS
} from './constants';

export const noToken = () => ({ type: NO_TOKEN });
export const setProfile = (profile) => ({ type: SET_PROFILE, profile });
export const toggleRepo = (repo, value) => ({ type: TOGGLE_REPO, repo, value });
export const setSubscribedRepos = (repos) => ({ type: SET_SUBSCRIBED_REPOS, repos });
