import { subscribe } from 'riew';

import flattenPRsEvents from '../utils/flattenRPsEvens';
import isItANewEvent from '../utils/isItANewEvent';

export default function setTitle({ subscribedRepos, notifications }) {
  const updateTitle = () => {
    let totalUnread = 0;
    subscribedRepos().map(repo => {
      const repoEvents = flattenPRsEvents(repo.prs);

      totalUnread += repoEvents.filter(event => isItANewEvent(event, notifications())).length;
    });
    if (totalUnread === 0) {
      document.title = '✔ Well done ';
    } else {
      document.title = `${ totalUnread } unread`;
    }
  };

  subscribe(subscribedRepos.pipe(updateTitle));
  subscribe(notifications.pipe(updateTitle));
  updateTitle();
};
