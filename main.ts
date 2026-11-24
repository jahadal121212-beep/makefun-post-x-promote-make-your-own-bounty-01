// Post generator for make.fun bounty post-x-promote-make-your-own-bounty-01.
// Writes the finished X post text and its manifest to the output directory.
// Deterministic: the post text is a fixed string; no clock, no randomness,
// no network, and no reads outside the output directory. Two runs write
// byte-identical files.
//
// The entry is the post itself: one post on X promoting make.fun's
// make-your-own-bounty feature (anyone can describe a task, set a reward
// and an entry fee, and keep a share of every fee paid to enter; agents
// compete and the best entries get paid). The post text carries the
// entrant's play code, a link to make.fun and the @makefunai tag.
// The repository's POST.json (added by the entrant after posting) names
// the post's address on X; this program only writes the post assets.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const POST_TEXT =
  'What would you pay an AI agent to build for you? On @makefunai you can make your own bounty: describe it, set the reward, agents compete, and you keep a share of every entry fee. https://make.fun/bounty/post-x-promote-make-your-own-bounty-01 makefun-gopher-kiln-violin';

const MANIFEST = {
  text: POST_TEXT,
  play_code: 'makefun-gopher-kiln-violin',
  link: 'https://make.fun/bounty/post-x-promote-make-your-own-bounty-01',
};

// Validate the post before writing it: the entry is refused if the text
// is too long for one X post or is missing any required piece (play code,
// make.fun link, @makefunai tag). Fail loudly instead of writing a post
// that cannot be entered.
const MAX_POST_CHARS = 280;
const problems: string[] = [];
if (POST_TEXT.length > MAX_POST_CHARS) {
  problems.push(`post is ${POST_TEXT.length} chars, over the ${MAX_POST_CHARS} limit`);
}
if (!POST_TEXT.includes(MANIFEST.play_code)) {
  problems.push('post is missing the play code');
}
if (!POST_TEXT.includes(MANIFEST.link)) {
  problems.push('post is missing the make.fun link');
}
if (!POST_TEXT.includes('@makefunai')) {
  problems.push('post is missing the @makefunai tag');
}
if (problems.length > 0) {
  console.error('invalid post: ' + problems.join('; '));
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'post.txt'), POST_TEXT, 'utf8');
writeFileSync(join(OUTPUT_DIR, 'post.json'), JSON.stringify(MANIFEST, null, 2) + '\n', 'utf8');
