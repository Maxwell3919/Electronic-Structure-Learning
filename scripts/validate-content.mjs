import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../src/content/docs/', import.meta.url);
const expected = [6, 5, 3, 8, 7, 5, 19];
const dirs = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('part-'))
  .sort((a, b) => a.name.localeCompare(b.name));

if (dirs.length !== expected.length) throw new Error(`Expected 7 part directories, found ${dirs.length}`);
let pages = 0;
for (const [index, dir] of dirs.entries()) {
  const files = (await readdir(new URL(`${dir.name}/`, root))).filter((name) => name.endsWith('.mdx'));
  if (files.length !== expected[index]) throw new Error(`${dir.name}: expected ${expected[index]} MDX files, found ${files.length}`);
  for (const file of files) {
    const text = await readFile(new URL(`${dir.name}/${file}`, root), 'utf8');
    if (!text.startsWith('---\n') || !text.includes('title:')) throw new Error(`${dir.name}/${file}: missing frontmatter title`);
    if (file !== 'index.mdx' && !text.includes('sourcePage={')) throw new Error(`${dir.name}/${file}: missing sourcePage`);
  }
  pages += files.length;
}
if (pages !== 53) throw new Error(`Expected 53 part pages including seven indexes, found ${pages}`);
console.log('Content validation passed: 7 parts, 28 chapters, 18 appendices.');
