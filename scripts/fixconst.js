const fs = require('fs');
const bundlePath = __dirname + '/../dist/bundle.js';
const bundleContent = fs.readFileSync(bundlePath).toString('utf8');
const match = bundleContent.match(/const /gm);

console.log('Found "const" declarations: ' + (match ? match.length : 0));

fs.writeFileSync(bundlePath, bundleContent.replace(/const /gm, 'var ').toString('utf8'));
