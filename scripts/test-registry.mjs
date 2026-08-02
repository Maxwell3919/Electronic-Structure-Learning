import { contentStatus } from '../src/data/site/contentStatus.mjs';

const contentTests = contentStatus
  .filter((item) => item.validator || item.smokeTest)
  .map((item) => ({
    id: item.id,
    route: item.route,
    validator: item.validator,
    smokeScript: item.smokeTest,
    status: 'active',
    category: item.track === 'martin-part-07' ? 'appendix' : 'theory-unit',
  }));

export const testRegistry = [
  {
    id: 'atlas-v3-model',
    route: '/theory/learning-map/',
    validator: 'scripts/validate-atlas-v3-model.mjs',
    smokeScript: null,
    status: 'active',
    category: 'site-architecture',
  },
  {
    id: 'atlas-v3-inventory',
    route: '/',
    validator: 'scripts/validate-atlas-v3-inventory.mjs',
    smokeScript: null,
    status: 'active',
    category: 'site-architecture',
  },
  {
    id: 'site-information-architecture',
    route: '/',
    validator: 'scripts/validate-site-architecture.mjs',
    smokeScript: 'scripts/smoke-site-architecture.py',
    status: 'active',
    category: 'site-architecture',
  },
  {
    id: 'editorial-quantum-atlas',
    route: '/reference/design-system/',
    validator: 'scripts/validate-design-system.mjs',
    smokeScript: 'scripts/smoke-site-visual-system.py',
    status: 'active',
    category: 'visual-system',
  },
  {
    id: 'site-build-budget',
    route: '/',
    validator: 'scripts/validate-build-budget.mjs',
    smokeScript: null,
    status: 'active',
    category: 'performance',
  },
  {
    id: 'runtime-lifecycle',
    route: '/part-01-overview-and-background/chapter-03-theoretical-background/',
    validator: 'scripts/validate-runtime-lifecycle.mjs',
    smokeScript: 'scripts/smoke-runtime-soak.py',
    status: 'active',
    category: 'performance',
  },
  {
    id: 'unit-reading-frame',
    route: '/theory/atlas/',
    validator: 'scripts/validate-unit-reading-frame.mjs',
    smokeScript: 'scripts/smoke-full-width-reading.py',
    status: 'active',
    category: 'reading-system',
  },
  {
    id: 'source-semantics',
    route: '/theory/atlas/',
    validator: 'scripts/validate-source-semantics.mjs',
    smokeScript: null,
    status: 'active',
    category: 'source-semantics',
  },
  {
    id: 'terminology-registry',
    route: '/reference/terminology-and-symbols/',
    validator: 'scripts/validate-terminology.mjs',
    smokeScript: null,
    status: 'active',
    category: 'terminology',
  },
  {
    id: 'literature-layer',
    route: '/literature/',
    validator: 'scripts/validate-literature-layer.mjs',
    smokeScript: null,
    status: 'active',
    category: 'literature',
  },
  ...contentTests,
  {
    id: 'part-01-index',
    route: '/part-01-overview-and-background/',
    validator: null,
    smokeScript: 'scripts/smoke-part01-index.py',
    status: 'active',
    category: 'part-index',
  },
  {
    id: 'part-02-index',
    route: '/part-02-density-functional-theory/',
    validator: null,
    smokeScript: 'scripts/smoke-part02-index.py',
    status: 'active',
    category: 'part-index',
  },
];

export default testRegistry;
