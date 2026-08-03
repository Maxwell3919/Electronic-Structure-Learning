import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const limits = {
  totalBytes: 3_500_000,
  htmlBytes: 3_100_000,
  jsBytes: 0,
  cssBytes: 30_000,
  fontBytes: 0,
  assetCount: 65,
  largestAssetBytes: 190_000,
  htmlPages: 44,
};
const minimumReductions = { pages: 0.53, bytes: 0.70, assets: 0.60 };
const baseline = {
  sha: '7cbf789720e152cb76acdc406016a788bc0a8de2',
  htmlPages: 94,
  totalBytes: 37_158_277,
  htmlBytes: 32_177_853,
  jsBytes: 822_195,
  cssBytes: 361_817,
  fontBytes: 1_072_948,
  assetCount: 472,
  largestAssetBytes: 1_399_938,
  buildSeconds: 27.88,
};

if (!fs.existsSync(dist)) throw new Error('dist does not exist; run the production build first');
const files = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    entry.isDirectory() ? walk(absolute) : files.push(absolute);
  }
};
walk(dist);

const size = (file) => fs.statSync(file).size;
const bytesFor = (extensions) => files
  .filter((file) => extensions.includes(path.extname(file).toLowerCase()))
  .reduce((sum, file) => sum + size(file), 0);
const largest = files
  .map((file) => ({ file: path.relative(dist, file), bytes: size(file) }))
  .sort((a, b) => b.bytes - a.bytes)[0];
const measured = {
  htmlPages: files.filter((file) => file.endsWith('.html')).length,
  totalBytes: files.reduce((sum, file) => sum + size(file), 0),
  htmlBytes: bytesFor(['.html']),
  jsBytes: bytesFor(['.js']),
  cssBytes: bytesFor(['.css']),
  fontBytes: bytesFor(['.woff', '.woff2', '.ttf', '.otf']),
  assetCount: files.length,
  largestAsset: largest,
};
console.log(JSON.stringify({ baseline, limits, minimumReductions, measured }, null, 2));

const failures = [];
for (const key of ['htmlPages', 'totalBytes', 'htmlBytes', 'jsBytes', 'cssBytes', 'fontBytes', 'assetCount']) {
  if (measured[key] > limits[key]) failures.push(`${key} ${measured[key]} > ${limits[key]}`);
}
if (largest.bytes > limits.largestAssetBytes) failures.push(`largest asset ${largest.bytes} > ${limits.largestAssetBytes}: ${largest.file}`);
const reductions = {
  pages: 1 - measured.htmlPages / baseline.htmlPages,
  bytes: 1 - measured.totalBytes / baseline.totalBytes,
  assets: 1 - measured.assetCount / baseline.assetCount,
};
for (const [key, minimum] of Object.entries(minimumReductions)) {
  if (reductions[key] < minimum) failures.push(`${key} reduction ${(reductions[key] * 100).toFixed(1)}% < ${(minimum * 100).toFixed(0)}%`);
}
if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Build budget passed; reductions: pages ${(reductions.pages * 100).toFixed(1)}%, bytes ${(reductions.bytes * 100).toFixed(1)}%, assets ${(reductions.assets * 100).toFixed(1)}%.`);
