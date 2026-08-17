import fs from 'node:fs';

const css = fs.readFileSync('src/styles/global.css', 'utf8');
const home = fs.readFileSync('src/pages/index.astro', 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const cssBlock = css.match(/\/\* cow-cat:start \*\/([\s\S]*?)\/\* cow-cat:end \*\//)?.[1] ?? '';
const inlineSvg = home.match(/<section class="cow-cat-stage"[\s\S]*?<\/section>/)?.[0] ?? '';

assert(Buffer.byteLength(inlineSvg) <= 15_000, 'inline cow-cat markup exceeds 15 KB');
assert(Buffer.byteLength(cssBlock) <= 3_000, 'cow-cat CSS exceeds 3 KB');
assert(!/<(?:script|canvas|img)\b/i.test(inlineSvg), 'cow-cat must not use JS, Canvas, or an image request');
assert(inlineSvg.includes('<svg') && inlineSvg.includes('aria-hidden="true"'), 'cow-cat is not a decorative inline SVG on Home');
assert(!fs.readFileSync('src/layouts/BaseLayout.astro', 'utf8').includes('cow-cat-stage'), 'cow-cat leaked into the shared layout');
assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'cow-cat lacks reduced-motion behavior');

if (failures.length) { failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(`Home cow-cat audit passed: ${Buffer.byteLength(inlineSvg)} B inline markup, ${Buffer.byteLength(cssBlock)} B CSS, 0 B JS, 0 network images.`);
