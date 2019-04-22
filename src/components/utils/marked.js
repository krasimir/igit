import MarkdownIt from 'markdown-it';
import mentions from 'markdown-it-mentions';

import emojis from '../../emoji.json';

const shaRe = new RegExp(/ \b[0-9a-f]{5,40}\b/, 'gm');
const prOrIssueNumber = new RegExp(/#[0-9]+\b/gm);
const emojiRe = new RegExp(':[a-zA-Z]+:', 'gm');

const md = new MarkdownIt({
  linkify: true
});

function parseURL(username) {
  return `https://github.com/${ username }`;
}

export default function (str, repo, pr) {
  str = str
    .replace(emojiRe, function (str) {
      const s = str.substr(1, str.length - 2);

      if (emojis[s]) return emojis[s];
      return str;
    })
    .replace(shaRe, function (str) {
      return `[${ str }](https://github.com/${ repo.owner }/${ repo.name }/commit/${ str.trim() })`;
    });

  let markdown = md
    .use(mentions, { parseURL, external: true })
    .render(str);

  if (repo) {
    markdown = markdown
      .replace(prOrIssueNumber, function (str) {
        return `
          <a href="https://github.com/${ repo.owner }/${ repo.name }/pull/${ str.trim().substr(1) }" target="_blank">
            ${ str }
          </a>
        `;
      });
  }

  return markdown;
}
