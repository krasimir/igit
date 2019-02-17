export const getProfile = function (state) {
  return state.profile;
};
export const getErrorByType = function (t) {
  return state => {
    return state.errors.find(({ type }) => type === t);
  };
};
export const getRepos = function (state) {
  return state.repos;
};
