import min from 'lodash/min';
import max from 'lodash/max';
import range from 'lodash/range';

import { createLine, isCodeItem } from './Lines';

const getLineNumbers = ({ line }) => line;
const removeDeletions = ({ type }) => type !== 'delete';

export default function fillMissingLines(items, fullContent, path) {
  const codeItems = items.filter(isCodeItem);

  // filling the gaps inside the items
  codeItems.forEach(item => {
    const allLines = item.rows.map(getLineNumbers);
    const withNoDeletions = item.rows.filter(removeDeletions).map(getLineNumbers);
    const range = [ min(allLines), max(allLines) ];

    for (let i = range[0]; i < range[1]; i++) {
      if (withNoDeletions.indexOf(i) < 0) { // missing line
        for (let j = 0; j < item.rows.length; j++) {
          const row = item.rows[j];

          if (row.type !== 'delete' && row.line === i - 1) {
            item.rows.splice(j + 1, 0, createLine(path, i, fullContent[i - 1]));
            break;
          }
        }
      }
    }
  });

  // filling the missing bit in the beginning and the end of the diff
  const coveredLinesSoFar = codeItems.filter(removeDeletions).reduce((result, item) => {
    result = result.concat(item.rows.map(getLineNumbers));
    return result;
  }, []);
  const rangeCoveredSoFar = [ min(coveredLinesSoFar), max(coveredLinesSoFar) ];

  if (rangeCoveredSoFar[0] > 1) {
    codeItems[0].rows = [
      ...range(rangeCoveredSoFar[0] - 1).map(line => createLine(path, line + 1, fullContent[line])),
      ...codeItems[0].rows
    ];
  }
  if (rangeCoveredSoFar[1] < fullContent.length) {
    let from = rangeCoveredSoFar[1];
    let to = fullContent.length - 1;

    codeItems[codeItems.length - 1].rows = [
      ...codeItems[codeItems.length - 1].rows,
      ...range(to - from).map(line => createLine(path, line + from + 1, fullContent[line + from]))
    ];
  }
}
