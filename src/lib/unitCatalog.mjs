import martin from '../data/martin/index.mjs';
import practice from '../data/shollSteckelStructure.mjs';
import contentStatus from '../data/site/contentStatus.mjs';

const statusByRoute = new Map(contentStatus.map((item) => [item.route, item]));

export const martinUnits = martin.parts.flatMap((part) => part.units.map((unit) => {
  const route = `/${part.slug}/${unit.slug}/`;
  return {
    ...unit,
    unitId: part.number === 7
      ? `martin-appendix-${unit.id.toLowerCase()}`
      : `martin-chapter-${unit.id.padStart(2, '0')}`,
    route,
    kind: part.number === 7 ? 'appendix' : 'chapter',
    sourceFamily: 'martin',
    source: martin.source,
    part,
    status: statusByRoute.get(route),
  };
}));

export const practiceUnits = practice.chapters.map((unit) => {
  const route = `/${practice.slug}/${unit.slug}/`;
  return {
    ...unit,
    unitId: `sholl-steckel-chapter-${unit.id.padStart(2, '0')}`,
    route,
    kind: 'practice',
    sourceFamily: 'sholl-steckel',
    source: practice.source,
    status: statusByRoute.get(route),
  };
});

export const allUnits = [...martinUnits, ...practiceUnits];
export const unitByRoute = new Map(allUnits.map((unit) => [unit.route, unit]));

export const normalizeRoute = (value = '/') => {
  const route = `/${String(value).split('?')[0].split('#')[0]}`.replace(/\/+/g, '/');
  return route === '/' ? route : `${route.replace(/^\/+|\/+$/g, '')}/`.replace(/^/, '/');
};

export const resolveUnit = (value) => unitByRoute.get(normalizeRoute(value)) ?? null;

export const unitDisplayTitle = (unit) => {
  if (!unit) return '';
  if (unit.kind === 'appendix') return `Appendix ${unit.id} · ${unit.title}`;
  if (unit.kind === 'practice') return `Practice Chapter ${unit.id} · ${unit.title}`;
  return `Chapter ${unit.id} · ${unit.title}`;
};

export default allUnits;
