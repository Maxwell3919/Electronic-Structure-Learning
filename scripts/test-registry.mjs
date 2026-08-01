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
    id: 'site-information-architecture',
    route: '/',
    validator: 'scripts/validate-site-architecture.mjs',
    smokeScript: 'scripts/smoke-site-architecture.py',
    status: 'active',
    category: 'site-architecture',
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

