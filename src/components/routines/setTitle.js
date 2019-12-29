import { sread, stake } from 'riew';

import flattenPRsEvents from '../utils/flattenRPsEvens';
import isItANewEvent from '../utils/isItANewEvent';
import { SUBSCRIBED_REPOS } from '../../constants';

export default function* setTitle({ notifications }) {
  const updateTitle = () => {
    stake(SUBSCRIBED_REPOS, (repos) => {
      if (!repos) return;
      let totalUnread = 0;

      repos.forEach((repo) => {
        const repoEvents = flattenPRsEvents(repo.prs);

        totalUnread += repoEvents.filter((event) => isItANewEvent(event, notifications.get())).length;
      });
      if (totalUnread === 0) {
        document.title = '✔ Well done ';
      } else {
        document.title = `${totalUnread} unread`;
      }
    });
  };

  sread(SUBSCRIBED_REPOS, updateTitle).listen();
  sread(notifications, updateTitle).listen();
  updateTitle();
}
