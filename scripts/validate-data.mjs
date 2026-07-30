import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const dataRoot = path.join(process.cwd(), 'public', 'data');
const errors = [];
let jsonCount = 0;

async function walk(directory) {
  for (const entry of await readdir(directory)) {
    const fullPath = path.join(directory, entry);
    const info = await stat(fullPath);
    if (info.isDirectory()) {
      await walk(fullPath);
      continue;
    }
    if (!entry.endsWith('.json')) continue;

    jsonCount += 1;
    let data;
    try {
      data = JSON.parse(await readFile(fullPath, 'utf8'));
    } catch {
      errors.push(`${path.relative(dataRoot, fullPath)}: invalid JSON`);
      continue;
    }

    if (entry === 'metadata.json') {
      for (const field of ['schemaVersion', 'topic', 'kind', 'source', 'generator', 'units', 'parameters', 'boundaries']) {
        if (!(field in data)) errors.push(`${path.relative(dataRoot, fullPath)}: missing ${field}`);
      }
      if (!Array.isArray(data.boundaries) || data.boundaries.length === 0) {
        errors.push(`${path.relative(dataRoot, fullPath)}: boundaries must be a non-empty array`);
      }
    }
  }
}

await walk(dataRoot);

if (errors.length > 0) {
  console.error('Data validation failed:\n' + errors.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log(`Data validation passed for ${jsonCount} JSON file(s).`);
