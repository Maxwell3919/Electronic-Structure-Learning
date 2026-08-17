#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const recordsRoot = path.resolve(process.env.RESEARCH_RECORDS_ROOT ?? '/home/talos/work/Research-Workflow-Records');
const recordsAvailable = fs.existsSync(path.join(recordsRoot, 'manifests/literature-annotation-coverage.json'));
const map = JSON.parse(fs.readFileSync(path.join(root, 'src/reading/literature-concept-map.json'), 'utf8'));
const library = JSON.parse(fs.readFileSync(path.join(root, 'src/reading/literature-library.json'), 'utf8'));
const coverage = recordsAvailable
  ? JSON.parse(fs.readFileSync(path.join(recordsRoot, 'manifests/literature-annotation-coverage.json'), 'utf8'))
  : null;
const fixtures = recordsAvailable
  ? JSON.parse(fs.readFileSync(path.join(recordsRoot, 'manifests/literature-annotation-fixtures.json'), 'utf8'))
  : { papers: [] };
const synthesesSource = fs.readFileSync(path.join(root, 'src/reading/literature-syntheses.ts'), 'utf8');
const fixtureIds = new Set(fixtures.papers.flatMap((paper) => paper.annotation_ids));

assert.equal(map.schema_version, 1);
assert.match(map.records_main_sha, /^[0-9a-f]{40}$/, 'Records identity missing from concept map');
assert.match(map.coverage_manifest_sha256, /^[0-9a-f]{64}$/, 'coverage manifest identity missing from concept map');
assert.equal(map.paper_count, 95);
assert.equal(map.coverage_annotation_count, 1379);
assert(map.concept_count >= 30 && map.concept_count <= 60, 'concept vocabulary must remain normalized');
assert.equal(map.concepts.length, map.concept_count);
assert.equal(new Set(map.concepts.map((concept) => concept.id)).size, map.concept_count, 'duplicate concept ID');
assert(map.concepts.every((concept) => concept.paper_count === concept.papers.length && concept.paper_count > 0), 'empty or miscounted concept');
assert.equal(map.papers.length, 95);
assert(map.papers.every((paper) => paper.concept_ids.length >= 2), 'paper lacks a useful concept connection');
assert.equal(new Set(map.papers.map((paper) => paper.paper_id)).size, 95, 'duplicate concept-map paper');

const publishedIds = library.papers.filter((paper) => paper.status === 'published').map((paper) => paper.paper_id).sort();
assert.deepEqual(map.papers.map((paper) => paper.paper_id).sort(), publishedIds, 'concept map does not cover the published inventory');
if (coverage) {
  assert.equal(coverage.papers.filter((paper) => paper.status === 'completed').length, 95, 'Literature v1 is not frozen at 95 completed');
  assert.equal(coverage.papers.reduce((sum, paper) => sum + paper.annotation_count, 0), 1379, 'scientific annotation freeze drift');
}
assert.equal((synthesesSource.match(/id: '[^']+',/g) ?? []).length, 12, 'expected 12 bounded synthesis pages');
const conceptIds = new Set(map.concepts.map((concept) => concept.id));
const synthesisConceptRefs = [...synthesesSource.matchAll(/conceptIds:\s*\[([^\]]+)\]/gs)]
  .flatMap((match) => [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]));
const synthesisPaperRefs = [...synthesesSource.matchAll(/paperIds:\s*\[([^\]]+)\]/gs)]
  .flatMap((match) => [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]));
assert(synthesisConceptRefs.every((id) => conceptIds.has(id)), 'synthesis references an unknown concept');
assert(synthesisPaperRefs.every((id) => publishedIds.includes(id)), 'synthesis references an unpublished paper');

const sampleExpectations = new Map([
  ['electron-phonon-interactions-first-principles', { figure: true, equation: true }],
  ['dfpt-phonons-crystal-properties', { figure: false, equation: true }],
  ['allen-dynes-transition-temperature', { figure: true, equation: true }],
  ['records-theory-of-superconductivity', { figure: false, equation: true }],
  ['bilayer-cote2-superconductivity', { figure: true, equation: false }],
  ['hbn-sin-superconductivity-cdw', { figure: false, equation: true }],
  ['records-highly-crystalline-2d-superconductors', { figure: true, equation: false }],
  ['records-effect-of-hubbard-u-corrections-on-the-electronic-and-magnetic-properties-of-2d-materials', { figure: true, equation: false }],
  ['records-first-principles-theory-of-ferroelectric-phase-transitions-for-perovskites-the-case-of-batio-3', { figure: true, equation: false }],
  ['records-reversible-and-selective-ion-intercalation-through-the-top-surface-of-few-layer-mos2', { figure: true, equation: false, variant: true }],
  ['records-versatile-method-for-preparing-two-dimensional-metal-dihalides', { figure: false, equation: false, variant: true }],
  ['gated-2d-dfpt', { figure: true, equation: true }],
  ['records-unconventional-bright-ground-state-excitons-in-monolayer-tii2-from-first-principles-calculations', { figure: true, equation: false }],
  ['records-quantum-geometry-and-critical-temperature-enhancement-in-mgb2-superconductivity', { figure: true, equation: true }],
  ['records-observation-of-interface-superconductivity-in-a-snse-2-epitaxial-graphene-van-der-waals-heterostructure', { figure: true, equation: false }],
]);

const coverageById = new Map((coverage?.papers ?? []).map((entry) => [entry.paper.paper_id, entry]));
const libraryById = new Map(library.papers.map((paper) => [paper.paper_id, paper]));
const evidenceLabels = ['来源主张', '阅读注解', '推断连接', '限制'];

for (const [paperId, expectation] of recordsAvailable ? sampleExpectations : []) {
  const entry = coverageById.get(paperId);
  const paper = libraryById.get(paperId);
  assert(entry && paper, `missing QA sample: ${paperId}`);
  const directory = path.join(recordsRoot, paper.source_record_path, 'annotations');
  const annotations = fs.readdirSync(directory).filter((name) => name.endsWith('.json')).sort()
    .map((name) => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')))
    .filter((item) => !fixtureIds.has(item.annotation_id));
  assert.equal(annotations.length, entry.annotation_count, `fixture isolation/count drift: ${paperId}`);
  assert.equal(new Set(annotations.map((item) => item.annotation_payload.contents)).size, annotations.length, `duplicate content: ${paperId}`);
  const contents = annotations.map((item) => item.annotation_payload.contents);
  for (const label of evidenceLabels) assert(contents.some((text) => text.startsWith(`【${label}`)), `missing ${label}: ${paperId}`);
  if (expectation.figure) assert(contents.some((text) => /(?:Fig\.?|Figure|图\s*\d)/iu.test(text)), `critical figure coverage absent: ${paperId}`);
  if (expectation.equation) assert(contents.some((text) => /(?:Eq\.?|Equation|方程|公式|式\s*\(?\d)/iu.test(text)), `critical equation coverage absent: ${paperId}`);
  assert(contents.some((text) => text.startsWith('【限制')), `claim boundary absent: ${paperId}`);
  if (expectation.variant) {
    const variants = path.join(recordsRoot, paper.source_record_path, 'variants');
    assert(fs.existsSync(variants) && fs.readdirSync(variants).length > 0, `variant provenance absent: ${paperId}`);
  }
}

const qaStatus = recordsAvailable ? `${sampleExpectations.size} source-bounded QA samples` : 'source-bounded QA skipped (Records mirror unavailable)';
console.log(`Literature knowledge closure audit passed: ${map.concept_count} concepts, 12 syntheses, 95 papers, 1379 frozen annotations, ${qaStatus}.`);
