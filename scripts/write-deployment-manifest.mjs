import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const ref = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
const manifest = {
  schema_version: 1,
  repository: 'Maxwell3919/Electronic-Structure-Learning',
  sha,
  ref: ref ? `refs/heads/${ref}` : null,
  workflow: 'talos-local-static-build',
  generated_at: new Date().toISOString(),
};
fs.writeFileSync(path.join(dist, 'deployment-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote dist/deployment-manifest.json for ${sha}.`);
