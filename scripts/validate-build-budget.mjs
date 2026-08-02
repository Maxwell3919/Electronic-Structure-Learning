import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const limits = {
  totalBytes: 38_000_000,
  homeJsBytes: 12_000,
  theoryJsBytes: 25_000,
  largestAssetBytes: 1_600_000,
  assetCount: 480,
};
const baseline = {
  observedAt: '2026-08-01',
  sha: '6b1dee8e0517e03c99542fc01697ddf3fd9785e6',
  totalBytes: 35_073_983,
  homeJsBytes: 6_168,
  theoryJsBytes: 13_643,
  largestAssetBytes: 1_433_139,
  assetCount: 422,
  note: 'Fresh Editorial Quantum Atlas main build measured before the reading-semantics changes.',
};

if (!fs.existsSync(dist)) {
  console.error('Build budget requires dist/. Run npm run build first.');
  process.exit(1);
}

const files = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolutePath);
    else files.push(absolutePath);
  }
};
walk(dist);

const totalBytes = files.reduce((total, file) => total + fs.statSync(file).size, 0);
const largest = files.map((file) => ({ file: path.relative(dist, file), bytes: fs.statSync(file).size }))
  .sort((a, b) => b.bytes - a.bytes)[0];
const routeJsBytes = (relativeHtml) => {
  const html = fs.readFileSync(path.join(dist, relativeHtml), 'utf8');
  const assets = [...html.matchAll(/src="[^"]*\/_astro\/([^"]+\.js)"/g)]
    .map((match) => path.join(dist, '_astro', match[1]))
    .filter((file, index, all) => fs.existsSync(file) && all.indexOf(file) === index);
  return assets.reduce((total, file) => total + fs.statSync(file).size, 0);
};

const result = {
  baseline,
  limits,
  measured: {
    totalBytes,
    homeJsBytes: routeJsBytes('index.html'),
    theoryJsBytes: routeJsBytes('part-01-overview-and-background/chapter-03-theoretical-background/index.html'),
    largestAsset: largest,
    assetCount: files.length,
  },
};
console.log(JSON.stringify(result, null, 2));

const failures = [];
if (totalBytes > limits.totalBytes) failures.push(`dist total ${totalBytes} > ${limits.totalBytes}`);
if (result.measured.homeJsBytes > limits.homeJsBytes) failures.push(`home JS ${result.measured.homeJsBytes} > ${limits.homeJsBytes}`);
if (result.measured.theoryJsBytes > limits.theoryJsBytes) failures.push(`theory JS ${result.measured.theoryJsBytes} > ${limits.theoryJsBytes}`);
if (largest.bytes > limits.largestAssetBytes) failures.push(`largest asset ${largest.bytes} > ${limits.largestAssetBytes}: ${largest.file}`);
if (files.length > limits.assetCount) failures.push(`asset count ${files.length} > ${limits.assetCount}`);
if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Build budget validation passed.');
