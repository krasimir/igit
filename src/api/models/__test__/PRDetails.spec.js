const rawData = require('./rawPRData.json');
const filesTree = require('./filesTree.json');
const createPRDetails = require('../PRDetails').default;

describe('Given the PRDetails normalization function', () => {
  describe('when passing a raw data object', () => {
    it('should normalize the `files` properly', () => {
      const result = createPRDetails(rawData, { login: 'krasimir' });

      expect(result.files.tree).toStrictEqual(filesTree);
    });
  });
});
