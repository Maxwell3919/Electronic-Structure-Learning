import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import testRegistry from './test-registry.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validators = testRegistry.filter((entry) => entry.status === 'active' && entry.validator);

console.log(`Running ${validators.length} registered deterministic validators`);

for (const [index, entry] of validators.entries()) {
  console.log(`\n[${index + 1}/${validators.length}] ${entry.id}: ${entry.validator}`);
  const result = spawnSync(process.execPath, [entry.validator], {
    cwd: repositoryRoot,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    console.error(`Failed to start ${entry.id}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`Validator failed for ${entry.id} with exit code ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

console.log(`\nAll ${validators.length} registered deterministic validators passed.`);

