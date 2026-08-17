import fs from 'node:fs';
import path from 'node:path';

const atlasRoot = process.cwd();
const drwRoot = process.env.DRW_ROOT ?? '/home/talos/work/DFT-Research-Workflow';
const built = process.argv.includes('--built');
const paths = JSON.parse(fs.readFileSync(path.join(atlasRoot, 'src/research/research-paths.json'), 'utf8')).paths;
const drwMapPath = path.join(drwRoot, 'src/lib/atlas-research-paths.ts');
const drwPagePath = path.join(drwRoot, 'src/pages/operations/[slug].astro');
const drwMap = fs.readFileSync(drwMapPath, 'utf8');
const drwPage = fs.readFileSync(drwPagePath, 'utf8');
const fail = (message) => { throw new Error(`Research cross-link audit failed: ${message}`); };

if (!drwPage.includes('atlasResearchPathsForOperation') || !drwPage.includes('From execution to a research decision')) fail('DRW operation template lacks Atlas backlink');
if (drwMap.includes('github.io') || drwPage.includes('github.io')) fail('GitHub Pages production link found in DRW bridge');

let drwToAtlas = 0;
for (const researchPath of paths) {
  if (!drwMap.includes(`id: '${researchPath.id}'`)) fail(`DRW mapping lacks ${researchPath.id}`);
  const uniqueOperations = new Set(researchPath.gates.map((gate) => gate.drw_slug));
  for (const slug of uniqueOperations) {
    if (!drwMap.includes(`'${slug}'`)) fail(`DRW mapping lacks operation ${slug}`);
    drwToAtlas += 1;
    if (built) {
      const output = path.join(drwRoot, 'dist/operations', slug, 'index.html');
      if (!fs.existsSync(output)) fail(`missing built DRW route ${slug}`);
      const html = fs.readFileSync(output, 'utf8');
      if (!html.includes(`/Electronic-Structure-Learning/research-paths/`)) fail(`built DRW route ${slug} lacks Atlas backlink`);
    }
  }
}

if (built) {
  for (const researchPath of paths) {
    const output = path.join(atlasRoot, 'dist/research-paths', researchPath.id, 'index.html');
    const html = fs.readFileSync(output, 'utf8');
    for (const gate of researchPath.gates) {
      const expected = `/DFT-Research-Workflow/operations/${gate.drw_slug}/`;
      if (!html.includes(expected)) fail(`${researchPath.id} lacks ${expected}`);
    }
  }
}

console.log(`Research cross-link audit passed: ${paths.length} paths and ${drwToAtlas} DRW→Atlas operation-path links.`);
