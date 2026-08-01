import martin from '../martin/index.mjs';
import practice from '../shollSteckelStructure.mjs';

export const acceptedMainBaseline = '7d4f6e7fd95dfb01c36f9629e2ccd6a863c0315b';

const registrations = new Map([
  ['1', ['scripts/validate-part01-closure.mjs', 'scripts/smoke-pages.py']],
  ['2', ['scripts/validate-chapter02-models.mjs', 'scripts/smoke-chapter02-pages.py']],
  ['3', ['scripts/validate-chapter03-models.mjs', 'scripts/smoke-chapter03-pages.py']],
  ['4', ['scripts/validate-chapter04-models.mjs', 'scripts/smoke-chapter04-pages.py']],
  ['5', ['scripts/validate-chapter05-models.mjs', 'scripts/smoke-chapter05-pages.py']],
  ['6', ['scripts/validate-part02-ch06.mjs', 'scripts/smoke-part02-ch06.py']],
  ['7', ['scripts/validate-part02-ch07.mjs', 'scripts/smoke-part02-ch07.py']],
  ['8', ['scripts/validate-part02-ch08.mjs', 'scripts/smoke-part02-ch08.py']],
  ['9', ['scripts/validate-part02-ch09.mjs', 'scripts/smoke-part02-ch09.py']],
  ['10', ['scripts/validate-part03-ch10.mjs', 'scripts/smoke-part03-ch10.py']],
  ['11', ['scripts/validate-part03-ch11.mjs', 'scripts/smoke-part03-ch11.py']],
  ['12', ['scripts/validate-part04-ch12.mjs', 'scripts/smoke-part04-ch12.py']],
  ['13', ['scripts/validate-part04-ch13.mjs', 'scripts/smoke-part04-ch13.py']],
  ['14', ['scripts/validate-part04-ch14.mjs', 'scripts/smoke-part04-ch14.py']],
  ['15', ['scripts/validate-part04-ch15.mjs', 'scripts/smoke-part04-ch15.py']],
  ['16', ['scripts/validate-part04-ch16.mjs', 'scripts/smoke-part04-ch16.py']],
  ['17', ['scripts/validate-part04-ch17.mjs', 'scripts/smoke-part04-ch17.py']],
  ['19', ['scripts/validate-part05-ch19.mjs', 'scripts/smoke-pages-ch19.py']],
  ['20', ['scripts/validate-part05-ch20.mjs', 'scripts/smoke-part05-ch20.py']],
  ['21', ['scripts/validate-part05-ch21.mjs', 'scripts/smoke-part05-ch21.py']],
  ['22', ['scripts/validate-part05-ch22.mjs', 'scripts/smoke-part05-ch22.py']],
  ['23', ['scripts/validate-part05-ch23.mjs', 'scripts/smoke-part05-ch23.py']],
  ['25', ['scripts/validate-part06-ch25.mjs', 'scripts/smoke-part06-ch25.py']],
  ['26', ['scripts/validate-part06-ch26.mjs', 'scripts/smoke-part06-ch26.py']],
  ['27', ['scripts/validate-part06-ch27.mjs', 'scripts/smoke-part06-ch27.py']],
  ['28', ['scripts/validate-part06-ch28.mjs', 'scripts/smoke-part06-ch28.py']],
  ['A', ['scripts/validate-part07-app-a.mjs', 'scripts/smoke-part07-app-a.py']],
  ['B', ['scripts/validate-part07-app-b.mjs', 'scripts/smoke-part07-app-b.py']],
  ['C', ['scripts/validate-part07-app-c.mjs', 'scripts/smoke-part07-app-c.py']],
  ['D', ['scripts/validate-part07-app-d.mjs', 'scripts/smoke-part07-app-d.py']],
  ['E', ['scripts/validate-part07-app-e.mjs', 'scripts/smoke-part07-app-e.py']],
  ['F', ['scripts/validate-part07-app-f.mjs', 'scripts/smoke-part07-app-f.py']],
  ['G', ['scripts/validate-part07-app-g.mjs', 'scripts/smoke-part07-app-g.py']],
  ['H', ['scripts/validate-part07-app-h.mjs', 'scripts/smoke-part07-app-h.py']],
  ['I', ['scripts/validate-part07-app-i.mjs', 'scripts/smoke-part07-app-i.py']],
  ['J', ['scripts/validate-part07-app-j.mjs', 'scripts/smoke-part07-app-j.py']],
  ['K', ['scripts/validate-part07-app-k.mjs', 'scripts/smoke-part07-app-k.py']],
]);

const martinStatuses = martin.parts.flatMap((part) =>
  part.units.map((unit) => {
    const registration = registrations.get(unit.id);
    const isAppendix = part.number === 7;
    const normalizedId = isAppendix ? unit.id.toLowerCase() : unit.id.padStart(2, '0');
    return {
      id: `martin-${isAppendix ? 'appendix' : 'chapter'}-${normalizedId}`,
      route: `/${part.slug}/${unit.slug}/`,
      track: `martin-part-${String(part.number).padStart(2, '0')}`,
      structuralState: registration ? 'content-complete' : 'outline',
      technicalState: registration ? 'validated' : 'not-registered',
      scientificReviewState: registration ? 'review-needed' : 'not-reviewed',
      learnerTestState: 'not-tested',
      validator: registration?.[0] ?? null,
      smokeTest: registration?.[1] ?? null,
      lastAcceptedSha: registration ? acceptedMainBaseline : null,
      notes: registration
        ? 'A deterministic validator is registered on the accepted baseline; scientific review and learner testing remain separate.'
        : 'The accepted baseline contains the catalog-backed route skeleton only.',
    };
  }),
);

const practiceStatuses = practice.chapters.map((chapter) => ({
  id: `sholl-steckel-chapter-${chapter.id.padStart(2, '0')}`,
  route: `/${practice.slug}/${chapter.slug}/`,
  track: 'sholl-steckel',
  structuralState: 'outline',
  technicalState: 'not-registered',
  scientificReviewState: 'not-reviewed',
  learnerTestState: 'not-tested',
  validator: null,
  smokeTest: null,
  lastAcceptedSha: null,
  notes: 'The accepted baseline contains the catalog-backed practical-reference skeleton only.',
}));

export const contentStatus = [...martinStatuses, ...practiceStatuses];

export const contentStatusSummary = contentStatus.reduce(
  (summary, item) => {
    summary.total += 1;
    summary.structural[item.structuralState] += 1;
    summary.technical[item.technicalState] += 1;
    summary.scientificReview[item.scientificReviewState] += 1;
    summary.learnerTest[item.learnerTestState] += 1;
    return summary;
  },
  {
    total: 0,
    structural: { outline: 0, draft: 0, 'content-complete': 0 },
    technical: { 'not-registered': 0, registered: 0, validated: 0 },
    scientificReview: { 'not-reviewed': 0, 'review-needed': 0, reviewed: 0 },
    learnerTest: { 'not-tested': 0, planned: 0, tested: 0 },
  },
);

export default contentStatus;
