export const navigationStatuses = Object.freeze(['available', 'planned', 'mixed']);
export const learningPathStatuses = Object.freeze(['available', 'structured', 'planned']);
export const catalogStatuses = Object.freeze(['planned']);

export const structuralStates = Object.freeze(['outline', 'draft', 'content-complete']);
export const technicalStates = Object.freeze(['not-registered', 'registered', 'validated']);
export const scientificReviewStates = Object.freeze(['not-reviewed', 'review-needed', 'reviewed']);
export const learnerTestStates = Object.freeze(['not-tested', 'planned', 'tested']);

export const referenceRoles = Object.freeze([
  'toy-model',
  'plane-wave-transparency',
  'qe-course',
  'workflow-course',
  'theory-course',
  'interaction-design',
  'phonon-visualization',
  'wannier-practice',
  'crystal-visualization',
  'research-workflow',
]);

export function withBasePath(href, base = '/') {
  if (/^(?:https?:|#)/.test(href)) return href;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedHref = href.replace(/^\//, '');
  return `${normalizedBase}${normalizedHref}`;
}

