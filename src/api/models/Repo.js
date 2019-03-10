export default function createRepo(node) {
  return {
    name: node.name,
    repoId: node.id,
    nameWithOwner: node.nameWithOwner,
    isPrivate: node.isPrivate,
    url: `https://github.com/${ node.nameWithOwner }`,
    selected: false,
    owner: node.owner.login
  };
}
