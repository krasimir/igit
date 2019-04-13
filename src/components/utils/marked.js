import MarkdownIt from 'markdown-it';
import mentions from 'markdown-it-mentions';

const shaRe = new RegExp(/\b[0-9a-f]{5,40}\b/, 'gm');
const prOrIssueNumber = new RegExp(/#[0-9]\b/gm);

const md = new MarkdownIt({
  linkify: true
});

function parseURL(username) {
  return `https://github.com/${ username }`;
}

export default function (str, repo, pr) {
  let markdown = md
    .use(mentions, { parseURL, external: true })
    .render(str);

  if (repo) {
    markdown = markdown
      .replace(shaRe, function (str) {
        return `
          <a href="https://github.com/${ repo.owner }/${ repo.name }/commit/${ str.trim() }" target="_blank">
            ${ str }
          </a>
        `;
      })
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
