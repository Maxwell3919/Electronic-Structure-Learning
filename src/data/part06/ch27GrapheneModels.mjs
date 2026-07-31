const TAU = 2 * Math.PI;

function finite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  return value;
}

export function grapheneZigzagEffective(k, hopping = 1, cells = 16) {
  [k, hopping].forEach((value, index) => finite(value, ['k', 'hopping'][index]));
  if (!Number.isInteger(cells) || cells < 1) throw new RangeError('cells must be a positive integer');
  if (hopping === 0) throw new RangeError('hopping must be non-zero');

  const t1 = 2 * hopping * Math.cos(k / 2);
  const t2 = hopping;
  const ratio = -t1 / t2;
  const magnitude = Math.abs(ratio);
  const edgeAllowed = magnitude < 1;
  const projectedBulkGap = 2 * Math.abs(Math.abs(t1) - Math.abs(t2));
  const amplitudes = Array.from({ length: cells }, (_, index) => ratio ** index);
  const norm = Math.sqrt(amplitudes.reduce((sum, value) => sum + value * value, 0));
  const normalized = norm === 0 ? amplitudes : amplitudes.map((value) => value / norm);
  const localizationLength = magnitude === 0
    ? 0
    : magnitude === 1
      ? Infinity
      : 1 / Math.abs(Math.log(magnitude));

  return {
    k,
    t1,
    t2,
    ratio,
    edgeAllowed,
    projectedBulkGap,
    localizationLength,
    amplitudes: normalized,
    transitionDistance: Math.min(Math.abs(k - (2 * Math.PI) / 3), Math.abs(k + (2 * Math.PI) / 3)),
  };
}

export function grapheneProjectedDiracMomenta() {
  return [-2 * Math.PI / 3, 2 * Math.PI / 3];
}

export function grapheneEdgeWindow(k) {
  finite(k, 'k');
  const wrapped = ((k + Math.PI) % TAU + TAU) % TAU - Math.PI;
  return Math.abs(wrapped) > 2 * Math.PI / 3;
}
