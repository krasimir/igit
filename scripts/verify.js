const fs = require('fs');

const constantsContent = fs.readFileSync(__dirname + '/../src/constants.js').toString('utf8');

if (constantsContent.indexOf('const LOCAL = true;') >= 0) {
  throw new Error('In src/constants.js LOCAL is `true`. MUST BE `false`!');
}
