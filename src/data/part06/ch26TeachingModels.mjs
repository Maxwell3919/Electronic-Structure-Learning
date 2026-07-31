const TAU = 2 * Math.PI;

function finite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  return value;
}

export function wrapAngle(angle) {
  finite(angle, 'angle');
  return ((angle + Math.PI) % TAU + TAU) % TAU - Math.PI;
}

export function twoBandState(theta, phi, radius = 1, d0 = 0) {
  finite(theta, 'theta');
  finite(phi, 'phi');
  finite(radius, 'radius');
  finite(d0, 'd0');
  if (radius < 0) throw new RangeError('radius must be non-negative');

  const s = Math.sin(theta);
  const unit = {
    x: s * Math.cos(phi),
    y: s * Math.sin(phi),
    z: Math.cos(theta),
  };
  const vector = {
    x: radius * unit.x,
    y: radius * unit.y,
    z: radius * unit.z,
  };
  return {
    unit: radius === 0 ? null : unit,
    vector,
    lower: d0 - radius,
    upper: d0 + radius,
    gap: 2 * radius,
    closed: radius === 0,
  };
}

export function twoSiteSpectrum(k, t1, t2, delta = 0, d0 = 0) {
  [k, t1, t2, delta, d0].forEach((value, index) => finite(value, ['k', 't1', 't2', 'delta', 'd0'][index]));
  const dx = t1 + t2 * Math.cos(k);
  const dy = t2 * Math.sin(k);
  const radius = Math.hypot(dx, dy, delta);
  return {
    dx,
    dy,
    dz: delta,
    lower: d0 - radius,
    upper: d0 + radius,
    gap: 2 * radius,
  };
}

export function analyticTwoSiteGap(t1, t2, delta = 0) {
  [t1, t2, delta].forEach((value, index) => finite(value, ['t1', 't2', 'delta'][index]));
  return 2 * Math.hypot(Math.abs(t1) - Math.abs(t2), delta);
}

export function sampledTwoSiteGap(t1, t2, delta = 0, samples = 2001) {
  if (!Number.isInteger(samples) || samples < 3) throw new RangeError('samples must be an integer >= 3');
  let minimum = Infinity;
  let kAtMinimum = 0;
  for (let index = 0; index < samples; index += 1) {
    const k = -Math.PI + (TAU * index) / (samples - 1);
    const gap = twoSiteSpectrum(k, t1, t2, delta).gap;
    if (gap < minimum) {
      minimum = gap;
      kAtMinimum = k;
    }
  }
  return { gap: minimum, k: kAtMinimum };
}

export function sshWinding(t1, t2, tolerance = 1e-12) {
  [t1, t2, tolerance].forEach((value, index) => finite(value, ['t1', 't2', 'tolerance'][index]));
  if (tolerance < 0) throw new RangeError('tolerance must be non-negative');
  const difference = Math.abs(t2) - Math.abs(t1);
  if (Math.abs(difference) <= tolerance) {
    return { winding: null, berryPhase: null, gapClosed: true };
  }
  const winding = difference > 0 ? 1 : 0;
  return {
    winding,
    berryPhase: winding === 1 ? Math.PI : 0,
    gapClosed: false,
  };
}

export function sshEdgeProfile(t1, t2, cells = 12) {
  [t1, t2].forEach((value, index) => finite(value, ['t1', 't2'][index]));
  if (!Number.isInteger(cells) || cells < 1) throw new RangeError('cells must be a positive integer');
  if (t2 === 0) {
    return { normalizable: false, ratio: null, localizationLength: Infinity, amplitudes: [] };
  }

  const ratio = -t1 / t2;
  const magnitude = Math.abs(ratio);
  const normalizable = magnitude < 1;
  const amplitudes = Array.from({ length: cells }, (_, index) => ratio ** index);
  const norm = Math.sqrt(amplitudes.reduce((sum, value) => sum + value * value, 0));
  const normalized = norm === 0 ? amplitudes : amplitudes.map((value) => value / norm);
  const localizationLength = magnitude === 0 ? 0 : magnitude === 1 ? Infinity : 1 / Math.abs(Math.log(magnitude));

  return {
    normalizable,
    ratio,
    localizationLength,
    amplitudes: normalized,
  };
}
