import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const workflowDir = path.join(root, '.github', 'workflows');
for (const name of fs.readdirSync(workflowDir)) {
  const relativePath = path.join('.github', 'workflows', name);
  const source = read(relativePath);
  const forbidden = [
    /pages\s*:\s*write/i,
    /id-token\s*:\s*write/i,
    /actions\/(?:configure-pages|upload-pages-artifact|deploy-pages)@/i,
    /withastro\/action@/i,
    /repos\/.+\/pages\/deployments/i,
    /environment:\s*\n\s*name:\s*github-pages/i,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(source)) failures.push(`${relativePath} contains retired Pages deployment capability: ${pattern}`);
  }
}

const retiredOrigin = 'maxwell3919.github.io/Electronic-Structure-Learning';
const scanRoots = ['.github', 'docs', 'src', 'scripts'];
const visit = (relativePath) => {
  const absolutePath = path.join(root, relativePath);
  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    const child = path.join(relativePath, entry.name);
    if (entry.isDirectory()) visit(child);
    else if (child !== 'scripts/audit-deployment-authority.mjs' && read(child).includes(retiredOrigin)) {
      failures.push(`${child} names the retired Atlas GitHub Pages origin`);
    }
  }
};
for (const scanRoot of scanRoots) visit(scanRoot);

const astroConfig = read('astro.config.mjs');
if (!astroConfig.includes("site: 'http://188.255.156.20'")) {
  failures.push('astro.config.mjs must identify the Newt/Talos public origin');
}
if (/maxwell3919\.github\.io\/Electronic-Structure-Learning/i.test(astroConfig)) {
  failures.push('astro.config.mjs must not identify GitHub Pages as an Atlas origin');
}

const smoke = read('scripts/smoke-clean-slate.py');
if (smoke.includes('PAGES_URL')) failures.push('browser smoke must use ATLAS_PUBLIC_URL, not the retired PAGES_URL name');

for (const relativePath of ['README.md', 'AGENTS.md']) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    failures.push(`${relativePath} is required to record deployment authority`);
    continue;
  }
  const source = read(relativePath);
  if (!source.includes('http://188.255.156.20/Electronic-Structure-Learning/')) {
    failures.push(`${relativePath} must name the Newt/Talos production endpoint`);
  }
  if (!/GitHub Pages.{0,80}(?:retired|forbidden|退役|禁止)/is.test(source)) {
    failures.push(`${relativePath} must mark GitHub Pages as retired or forbidden`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Deployment authority audit passed: Newt/Talos production, GitHub Pages retired.');
