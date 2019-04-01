import MarkdownIt from 'markdown-it';
import mentions from 'markdown-it-mentions';

const shaRegExps = [
  ' [a-f0-9]{128}',
  ' [a-f0-9]{96}',
  ' [a-f0-9]{64}',
  ' [a-f0-9]{56}',
  ' [a-f0-9]{40}',
  ' [a-f0-9]{10}',
  ' [a-f0-9]{7}'
];
const re = new RegExp(shaRegExps.join('|'), 'gm');

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
    markdown = markdown.replace(re, function (str) {
      return `
        <a href="https://github.com/${ repo.owner }/${ repo.name }/commit/${ str.trim() }" target="_blank">
          ${ str }
        </a>
      `;
    });
  }

  return markdown;
}
