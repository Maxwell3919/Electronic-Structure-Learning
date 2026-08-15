import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const limits = {
  totalBytes: 4_500_000,
  htmlBytes: 4_100_000,
  jsBytes: 0,
  cssBytes: 30_000,
  fontBytes: 0,
  // The governed site budget excludes source-linked scientific visuals. Those
  // assets are a separately audited evidence surface, not decorative images;
  // their hashes, provenance, and count are checked by audit-source-visuals.
  // The Literature closure adds thirteen reviewed static guide routes. Keep
  // the route and governed-file budget explicit rather than treating those
  // source-aligned pages as an accidental legacy-site regression.
  // The Records-wide Literature manifest adds 95 source-ready Reader routes
  // (the completed pilot remains its dedicated route). Keep one governed file
  // per route instead of hiding the explicitly requested library expansion.
  assetCount: 264,
  largestAssetBytes: 210_000,
  htmlPages: 255,
};
const pdfReaderLimits = {
  totalBytes: 7_000_000,
  jsBytes: 2_200_000,
  wasmBytes: 4_800_000,
  // Complete and pre-reading Readers use separate small entry modules while
  // sharing the pinned EmbedPDF runtime and annotation implementation.
  assetCount: 7,
  largestAssetBytes: 4_800_000,
};
const minimumReductions = { bytes: 0.70, assets: 0.44 };
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
const bytesFor = (extensions) => files.filter((file) => extensions.includes(path.extname(file).toLowerCase())).reduce((sum, file) => sum + size(file), 0);
const isSourceVisual = (file) => path.relative(dist, file).startsWith('media/source-visuals/');
const isPdfReaderRuntime = (file) => {
  const relative = path.relative(dist, file);
  return relative.startsWith('_astro/') && ['.js', '.wasm'].includes(path.extname(relative));
};
const pdfReaderFiles = files.filter(isPdfReaderRuntime);
const governedFiles = files.filter((file) => !isSourceVisual(file) && !isPdfReaderRuntime(file));
const largest = governedFiles.map((file) => ({ file: path.relative(dist, file), bytes: size(file) })).sort((a, b) => b.bytes - a.bytes)[0];
const measured = {
  htmlPages: files.filter((file) => file.endsWith('.html')).length,
  totalBytes: files.reduce((sum, file) => sum + size(file), 0),
  governedTotalBytes: governedFiles.reduce((sum, file) => sum + size(file), 0),
  htmlBytes: bytesFor(['.html']), jsBytes: bytesFor(['.js']), cssBytes: bytesFor(['.css']),
  fontBytes: bytesFor(['.woff', '.woff2', '.ttf', '.otf']),
  assetCount: files.length,
  sourceVisualAssetCount: files.filter(isSourceVisual).length,
  pdfReaderRuntime: {
    totalBytes: pdfReaderFiles.reduce((sum, file) => sum + size(file), 0),
    jsBytes: pdfReaderFiles.filter((file) => file.endsWith('.js')).reduce((sum, file) => sum + size(file), 0),
    wasmBytes: pdfReaderFiles.filter((file) => file.endsWith('.wasm')).reduce((sum, file) => sum + size(file), 0),
    assetCount: pdfReaderFiles.length,
    largestAsset: pdfReaderFiles.map((file) => ({ file: path.relative(dist, file), bytes: size(file) })).sort((a, b) => b.bytes - a.bytes)[0],
  },
  governedAssetCount: governedFiles.length,
  largestAsset: largest,
};
console.log(JSON.stringify({ baseline, limits, pdfReaderLimits, minimumReductions, measured }, null, 2));
const failures = [];
for (const key of ['htmlPages', 'htmlBytes', 'cssBytes', 'fontBytes']) {
  if (measured[key] > limits[key]) failures.push(`${key} ${measured[key]} > ${limits[key]}`);
}
if (measured.governedTotalBytes > limits.totalBytes) failures.push(`governedTotalBytes ${measured.governedTotalBytes} > ${limits.totalBytes}`);
if (measured.governedAssetCount > limits.assetCount) failures.push(`governedAssetCount ${measured.governedAssetCount} > ${limits.assetCount}`);
if (largest.bytes > limits.largestAssetBytes) failures.push(`largest asset ${largest.bytes} > ${limits.largestAssetBytes}: ${largest.file}`);
for (const key of ['totalBytes', 'jsBytes', 'wasmBytes', 'assetCount']) {
  if (measured.pdfReaderRuntime[key] > pdfReaderLimits[key]) failures.push(`PDF reader ${key} ${measured.pdfReaderRuntime[key]} > ${pdfReaderLimits[key]}`);
}
if (!measured.pdfReaderRuntime.largestAsset || measured.pdfReaderRuntime.largestAsset.bytes > pdfReaderLimits.largestAssetBytes) failures.push(`PDF reader largest asset exceeds ${pdfReaderLimits.largestAssetBytes}`);
const reductions = {
  bytes: 1 - measured.governedTotalBytes / baseline.totalBytes,
  assets: 1 - measured.governedAssetCount / baseline.assetCount,
};
for (const [key, minimum] of Object.entries(minimumReductions)) {
  if (reductions[key] < minimum) failures.push(`${key} reduction ${(reductions[key] * 100).toFixed(1)}% < ${(minimum * 100).toFixed(0)}%`);
}
if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Build budget passed; reductions: bytes ${(reductions.bytes * 100).toFixed(1)}%, assets ${(reductions.assets * 100).toFixed(1)}%.`);
