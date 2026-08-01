import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import martin from '../src/data/martin/index.mjs';
import sourceSemanticStatus, { sourceSemanticAuditStatuses } from '../src/data/site/sourceSemanticStatus.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const catalog = martin.parts.flatMap((part) => part.units.map((unit) => ({ part, unit })));

assert(sourceSemanticStatus.length === 46, `expected 46 Martin semantic records, found ${sourceSemanticStatus.length}`);
assert(new Set(sourceSemanticStatus.map((item) => item.unitId)).size === 46, 'semantic unit IDs must be unique');
assert(new Set(sourceSemanticStatus.map((item) => item.route)).size === 46, 'semantic routes must be unique');

for (const { part, unit } of catalog) {
  const route = `/${part.slug}/${unit.slug}/`;
  const record = sourceSemanticStatus.find((item) => item.route === route);
  assert(Boolean(record), `missing semantic record: ${route}`);
  if (!record) continue;
  assert(record.sourceTitle === unit.title, `source title drift: ${record.unitId}`);
  assert(Boolean(record.sourceTitleZh), `Chinese source title missing: ${record.unitId}`);
  assert(record.sourcePageRange.startsWith('printed p'), `source page range missing: ${record.unitId}`);
  assert(JSON.stringify(record.catalogSections) === JSON.stringify(unit.sections), `catalog section drift: ${record.unitId}`);
  assert(JSON.stringify(record.renderedSourceSections) === JSON.stringify(unit.sections.map((section) => section.id)), `rendered section registry drift: ${record.unitId}`);
  assert(sourceSemanticAuditStatuses.includes(record.auditStatus), `invalid audit status: ${record.unitId}`);
  assert(record.auditStatus !== 'not-audited', `unit remains unaudited: ${record.unitId}`);
  assert(record.headingHierarchyState === 'catalog-source-sections-separated', `heading hierarchy not separated: ${record.unitId}`);
  assert(record.sourceLayerState === 'textbook-baseline-separated-from-exposition', `source layer not separated: ${record.unitId}`);
}

const bodyReview = sourceSemanticStatus.filter((item) => item.auditStatus === 'body-review-needed');
assert(bodyReview.length === 4, `expected four bounded body-review records, found ${bodyReview.length}`);

const headingCorrections = [
  ['src/components/chapter03/Chapter03BasicEquations.mdx', '电子—核体系的非相对论 Coulomb Hamiltonian', '完整非相对论 Coulomb Hamiltonian'],
  ['src/components/chapter05/Chapter05Lindhard.mdx', '从均匀体系响应到材料计算语境', '到真实材料'],
  ['src/components/part04/ch13/Chapter13Contents.astro', '从有限表示到自洽计算', '到完整自洽计算'],
  ['src/components/part04/ch13/Chapter13EnergyAndOperators.mdx', '所选离散表示中的 Hamiltonian', '到完整 Hamiltonian'],
  ['src/components/part04/ch14/Chapter14Review.mdx', '从模型到材料计算的最低证据链', '从模型到真实计算'],
  ['src/components/part07/appC/AppendixCCoupledEquations.mdx', '电子—核非相对论 Coulomb Hamiltonian', '从完整 Hamiltonian'],
  ['src/components/part07/appG/AppendixGOrientation.mdx', '依赖变分驻定性与表示一致性', '依赖完整的驻定性'],
  ['src/components/part07/appG/AppendixGPairFourier.mdx', '所选 total-energy representation 的全导数', 'representation 的完整导数'],
];
for (const [file, accepted, rejected] of headingCorrections) {
  const source = read(file);
  assert(source.includes(accepted), `accepted heading is missing: ${file}`);
  assert(!source.includes(rejected), `overstrong heading remains: ${file}`);
}

if (failures.length) {
  console.error(`Source-semantics validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Source-semantics validation passed: 46 structure audits, ${headingCorrections.length} heading corrections, ${bodyReview.length} body-review records.`);
