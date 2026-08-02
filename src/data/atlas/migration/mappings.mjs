import martin from '../../martin/index.mjs';

export const martinMappings = martin.parts.flatMap((part) => part.units.map((unit) => ({
  legacyId: `martin:${unit.id}`,
  legacyTitle: unit.title,
  legacyRoute: `/${part.slug}/${unit.slug}/`,
  targetNodeIds: [],
  disposition: 'source-location',
  reviewState: 'specialist-review-required',
  rationale: '保留为来源定位；标题或目录位置不足以决定拆分、重写或知识分类。',
})));

export const legacyAreaMappings = [
  ['learning-paths', '/learning-paths/', '/theory/learning-map/', 'MERGE'],
  ['labs', '/labs/', '/methods/', 'MIGRATE'],
  ['cases', '/cases/', '/methods/', 'MIGRATE'],
  ['interactive-labs', '/interactive-labs/', '/computational-tools/', 'MIGRATE'],
  ['literature', '/literature/', '/reference/', 'RETAIN'],
  ['sholl-steckel', '/practice-sholl-steckel/', '/methods/', 'MIGRATE'],
].map(([id, legacyRoute, targetRoute, classification]) => ({
  id, legacyRoute, targetRoute, classification,
  compatibility: 'legacy-route-retained',
  condition: '迁移前需逐页确认概念权威、引用、重定向、验证器与 Pages smoke；批量删除另需用户授权。',
}));

export default { martinMappings, legacyAreaMappings };
