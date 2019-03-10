export default function createOrganization(node) {
  return {
    name: node.name, // human readable
    login: node.login
  };
}
