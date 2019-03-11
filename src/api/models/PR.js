export default function createPR(node) {
  return {
    id: node.id,
    title: node.title,
    authorLogin: node.author.login,
    authorAvatar: node.author.avatarUrl,
    number: node.number,
    url: node.url,
    headRefName: node.headRefName
  };
}
