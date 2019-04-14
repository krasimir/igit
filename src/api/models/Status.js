import { normalizeUser } from './PRDetails';

export default function createStatus({ node: { commit } }) {

  return {
    commit: {
      id: commit.id,
      message: commit.message
    },
    status: commit.status === null ? null : commit.status.contexts.map(context => {
      return {
        id: context.id,
        context: context.context,
        createdAt: new Date(context.createdAt),
        creator: normalizeUser(context.creator),
        targetUrl: context.targetUrl,
        description: context.description,
        state: context.state
      };
    })
  };
}
