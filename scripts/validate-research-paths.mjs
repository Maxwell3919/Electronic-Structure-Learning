import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const built = process.argv.includes('--built');
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/research/research-paths.json'), 'utf8'));
const concepts = JSON.parse(fs.readFileSync(path.join(root, 'src/reading/literature-concept-map.json'), 'utf8'));
const synthesisSource = fs.readFileSync(path.join(root, 'src/reading/literature-syntheses.ts'), 'utf8');
const drwContract = JSON.parse(fs.readFileSync(path.join(root, 'src/research/drw-operation-contract.json'), 'utf8'));

const fail = (message) => { throw new Error(`Research path audit failed: ${message}`); };
const conceptIds = new Set(concepts.concepts.map((concept) => concept.id));
const conceptRoutes = new Map(concepts.concepts.map((concept) => [concept.id, concept.canonical_route]));
const synthesisIds = new Set([...synthesisSource.matchAll(/\bid:\s*'([^']+)'/g)].map((match) => match[1]));
const drwSlugs = new Set(drwContract.operation_slugs);
if (data.schema_version !== 1) fail(`unsupported schema ${data.schema_version}`);
if (drwContract.schema_version !== 1 || !/^http:\/\/188\.255\.156\.20\/DFT-Research-Workflow\/operations\/$/.test(drwContract.production_base)) {
  fail('invalid versioned external operation contract');
}
if (data.paths.length < 10 || data.paths.length > 15) fail(`expected 10–15 paths, found ${data.paths.length}`);
const ids = new Set();
let gateCount = 0;
let atlasToDrw = 0;
let synthesisLinks = 0;
for (const researchPath of data.paths) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(researchPath.id)) fail(`invalid id ${researchPath.id}`);
  if (ids.has(researchPath.id)) fail(`duplicate id ${researchPath.id}`);
  ids.add(researchPath.id);
  if (!researchPath.question || !researchPath.establishes || researchPath.gates.length < 3) fail(`${researchPath.id} is incomplete`);
  if (!researchPath.claim_boundary?.length) fail(`${researchPath.id} lacks claim boundary`);
  for (const id of researchPath.concept_ids) if (!conceptIds.has(id)) fail(`${researchPath.id} unknown concept ${id}`);
  for (const id of researchPath.synthesis_ids) {
    if (!synthesisIds.has(id)) fail(`${researchPath.id} unknown synthesis ${id}`);
    synthesisLinks += 1;
  }
  for (const gate of researchPath.gates) {
    gateCount += 1;
    atlasToDrw += 1;
    if (!conceptIds.has(gate.concept_id)) fail(`${researchPath.id}/${gate.id} unknown concept ${gate.concept_id}`);
    if (!drwSlugs.has(gate.drw_slug)) fail(`${researchPath.id}/${gate.id} unknown DRW operation ${gate.drw_slug}`);
    for (const field of ['required_evidence', 'pass', 'stop']) if (!gate[field]) fail(`${researchPath.id}/${gate.id} missing ${field}`);
    const route = conceptRoutes.get(gate.concept_id).split('#')[0];
    if (built && route !== '/') {
      const output = path.join(root, 'dist', route.replace(/^\//, ''), 'index.html');
      if (!fs.existsSync(output)) fail(`${researchPath.id}/${gate.id} missing built Atlas route ${route}`);
    }
  }
  if (built) {
    const output = path.join(root, 'dist/research-paths', researchPath.id, 'index.html');
    if (!fs.existsSync(output)) fail(`missing built path ${researchPath.id}`);
    const html = fs.readFileSync(output, 'utf8');
    if (html.includes('github.io') || !html.includes('Claim boundary') || !html.includes('STOP:')) fail(`invalid built contract for ${researchPath.id}`);
  }
}

const productionSources = [
  'src/pages/research-paths/index.astro',
  'src/pages/research-paths/[slug].astro',
  'src/research/research-paths.json',
].map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
if (productionSources.includes('github.io')) fail('GitHub Pages production reference found');

console.log(`Research path audit passed: ${data.paths.length} paths, ${gateCount} gates, ${atlasToDrw} Atlas→DRW links, ${synthesisLinks} path→synthesis links.`);
