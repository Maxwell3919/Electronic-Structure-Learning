const assertFinite = (value, name) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be finite`);
  }
};

const clamp = (value, lower, upper) => Math.min(upper, Math.max(lower, value));

export function twoSiteGroundState(delta, shift = 0, hopping = 1) {
  assertFinite(delta, 'delta');
  assertFinite(shift, 'shift');
  assertFinite(hopping, 'hopping');
  if (hopping <= 0) throw new RangeError('hopping must be positive');

  const splitting = Math.sqrt(delta ** 2 + 4 * hopping ** 2);
  const nLeft = 0.5 * (1 + delta / splitting);
  const nRight = 1 - nLeft;
  const energy = shift - 0.5 * splitting;

  return { delta, shift, hopping, nLeft, nRight, energy, splitting };
}

export function constrainedFamilyA(q) {
  assertFinite(q, 'q');
  return 0.55 + 0.8 * q ** 2;
}

export function constrainedFamilyB(q) {
  assertFinite(q, 'q');
  return 0.62 + 0.15 * (q - 0.65) ** 2;
}

export function constrainedUniversal(q) {
  const a = constrainedFamilyA(q);
  const b = constrainedFamilyB(q);
  return { value: Math.min(a, b), family: a <= b ? 'A' : 'B', a, b };
}

export function constrainedOuterMinimum(externalSlope) {
  assertFinite(externalSlope, 'externalSlope');

  const qA = clamp(-externalSlope / 1.6, -1, 1);
  const qB = clamp(0.65 - externalSlope / 0.3, -1, 1);
  const energyA = constrainedFamilyA(qA) + externalSlope * qA;
  const energyB = constrainedFamilyB(qB) + externalSlope * qB;

  if (energyA <= energyB) {
    return { q: qA, energy: energyA, family: 'A', qA, qB, energyA, energyB };
  }
  return { q: qB, energy: energyB, family: 'B', qA, qB, energyA, energyB };
}

export function sampleConstrainedCurves(externalSlope, count = 161) {
  assertFinite(externalSlope, 'externalSlope');
  if (!Number.isInteger(count) || count < 2) {
    throw new RangeError('count must be an integer of at least 2');
  }

  return Array.from({ length: count }, (_, index) => {
    const q = -1 + (2 * index) / (count - 1);
    const inner = constrainedUniversal(q);
    return {
      q,
      familyA: inner.a,
      familyB: inner.b,
      universal: inner.value,
      total: inner.value + externalSlope * q,
    };
  });
}
