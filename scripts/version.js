const fs = require('fs');

const filePath = __dirname + '/../package.json';
const siteHTMLPath = __dirname + '/../site/index.html';

const pkg = require(filePath);

const version = pkg.version;
const tmp = version.split('.');

tmp[tmp.length - 1] = parseInt(tmp[tmp.length - 1], 10) + 1;
pkg.version = tmp.join('.');

fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2).toString('utf8'));

const siteHTML = fs.readFileSync(siteHTMLPath).toString('utf8');
const newSiteHTML = siteHTML.replace(
  /<span id="version">(.*)<\/span>/gm,
  `<span id="version">v.${ pkg.version }</span>`
).toString('utf8');

fs.writeFileSync(
  siteHTMLPath,
  newSiteHTML
);

console.log('-> Version bumped to: ' + pkg.version + ' in ' + siteHTMLPath);
