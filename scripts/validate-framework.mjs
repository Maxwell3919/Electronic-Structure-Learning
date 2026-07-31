import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    assert(!seen.has(value), `Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

function assertIncreasing(values, label) {
  for (let index = 1; index < values.length; index += 1) {
    assert(values[index] >= values[index - 1], `${label} is not monotonic at index ${index}`);
  }
}

const { default: martin } = await import('../src/data/martin/index.mjs');
const { default: practice } = await import('../src/data/shollSteckelStructure.mjs');

const expectedPartCounts = [5, 4, 2, 7, 6, 4, 18];
assert(martin.parts.length === 7, `Expected 7 Martin parts, found ${martin.parts.length}`);

const units = martin.parts.flatMap((part, index) => {
  assert(part.number === index + 1, `Unexpected Martin part number at index ${index}`);
  assert(
    part.units.length === expectedPartCounts[index],
    `Part ${part.roman}: expected ${expectedPartCounts[index]} units, found ${part.units.length}`,
  );
  assert(existsSync(join(root, 'src/content/docs', part.slug, 'index.mdx')), `Missing index for ${part.slug}`);
  return part.units.map((unit) => ({ ...unit, partSlug: part.slug }));
});

assert(units.length === 46, `Expected 46 Martin units, found ${units.length}`);
assert(units.filter((unit) => /^\d+$/.test(unit.id)).length === 28, 'Expected 28 Martin chapters');
assert(units.filter((unit) => /^[A-R]$/.test(unit.id)).length === 18, 'Expected 18 Martin appendices');
assertUnique(units.map((unit) => `${unit.partSlug}/${unit.slug}`), 'Martin unit path');

for (const unit of units) {
  const path = join(root, 'src/content/docs', unit.partSlug, `${unit.slug}.mdx`);
  assert(existsSync(path), `Missing Martin unit page: ${path}`);
  assert(Number.isInteger(unit.page) && unit.page > 0, `Invalid start page for ${unit.label}`);
  assertIncreasing(unit.sections.map((section) => section.page), `${unit.label} section pages`);
  for (const section of unit.sections) {
    assert(section.page >= unit.page, `${unit.label}: section ${section.id} precedes unit start page`);
  }
}

assert(practice.chapters.length === 10, `Expected 10 Sholl–Steckel chapters, found ${practice.chapters.length}`);
assert(existsSync(join(root, 'src/content/docs', practice.slug, 'index.mdx')), 'Missing practice track index');
assertUnique(practice.chapters.map((chapter) => chapter.slug), 'practice chapter slug');

for (const chapter of practice.chapters) {
  const path = join(root, 'src/content/docs', practice.slug, `${chapter.slug}.mdx`);
  assert(existsSync(path), `Missing practice chapter page: ${path}`);
  assertIncreasing(chapter.sections.map((section) => section.page), `${chapter.label} section pages`);
}

const martinSectionCount = units.reduce((sum, unit) => sum + unit.sections.length, 0);
const practiceSectionCount = practice.chapters.reduce((sum, chapter) => sum + chapter.sections.length, 0);

assert(martinSectionCount === 315, `Expected 315 Martin section locators, found ${martinSectionCount}`);
assert(practiceSectionCount === 93, `Expected 93 Sholl–Steckel section locators, found ${practiceSectionCount}`);

console.log(
  `Framework validation passed: 7 Martin parts, 46 Martin units, ${martinSectionCount} Martin section locators, 10 practice chapters, ${practiceSectionCount} practice section locators.`,
);
