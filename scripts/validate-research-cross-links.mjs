import fs from 'node:fs';
import path from 'node:path';

const atlasRoot = process.cwd();
const built = process.argv.includes('--built');
const paths = JSON.parse(fs.readFileSync(path.join(atlasRoot, 'src/research/research-paths.json'), 'utf8')).paths;
const contract = JSON.parse(fs.readFileSync(path.join(atlasRoot, 'src/research/drw-operation-contract.json'), 'utf8'));
const operationSlugs = new Set(contract.operation_slugs);
const fail = (message) => { throw new Error(`Research cross-link audit failed: ${message}`); };

if (contract.schema_version !== 1 || contract.production_base !== 'http://188.255.156.20/DFT-Research-Workflow/operations/') {
  fail('invalid versioned external operation contract');
}

let atlasToExternal = 0;
for (const researchPath of paths) {
  const uniqueOperations = new Set(researchPath.gates.map((gate) => gate.drw_slug));
  for (const slug of uniqueOperations) {
    if (!operationSlugs.has(slug)) fail(`versioned contract lacks operation ${slug}`);
    atlasToExternal += 1;
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

console.log(`Research cross-link audit passed: ${paths.length} paths and ${atlasToExternal} Atlas→external-operation links (versioned contract only; no external worktree inspection).`);
