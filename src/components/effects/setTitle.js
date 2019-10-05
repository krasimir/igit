import flattenPRsEvents from '../utils/flattenRPsEvens';
import isItANewEvent from '../utils/isItANewEvent';

export default function setTitle({ subscribedRepos, notifications }) {
  let totalUnread = 0;
  const [ getRepos ] = subscribedRepos;

  getRepos().map(repo => {
    const repoEvents = flattenPRsEvents(repo.prs);

    totalUnread += repoEvents.filter(event => isItANewEvent(event, notifications())).length;
  });

  if (totalUnread === 0) {
    document.title = '✔ Well done ';
  } else {
    document.title = `${ totalUnread } unread`;
  }
};
