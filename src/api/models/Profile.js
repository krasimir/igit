export default function createProfile(data, token) {
  return {
    name: data.name,
    login: data.login,
    avatar: data.avatar_url,
    token
  };
}
