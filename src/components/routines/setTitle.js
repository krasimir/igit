import { subscribe } from 'riew';

import flattenPRsEvents from '../utils/flattenRPsEvens';
import isItANewEvent from '../utils/isItANewEvent';

export default function setTitle({ subscribedRepos, notifications }) {
  const updateTitle = async repos => {
    let totalUnread = 0;
    repos.forEach(repo => {
      const repoEvents = flattenPRsEvents(repo.prs);

      totalUnread += repoEvents.filter(event => isItANewEvent(event, notifications.getState())).length;
    });
    if (totalUnread === 0) {
      document.title = '✔ Well done ';
    } else {
      document.title = `${totalUnread} unread`;
    }
  };

  subscribedRepos.subscribe(updateTitle);
  subscribe(notifications.pipe(updateTitle));
  updateTitle();
}
