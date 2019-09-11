import flattenPREvents from '../../api/utils/flattenPREvents';

const flattenPRsEvents = allPRs => {
  if (allPRs && allPRs.length > 0) {
    return allPRs.reduce((events, pr) => {
      return events.concat(flattenPREvents(pr));
    }, []);
  }
  return [];
};

export default flattenPRsEvents;
