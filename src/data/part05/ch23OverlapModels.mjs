const finite = (name, value) => {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
  return value;
};

const integerInRange = (name, value, min, max) => {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  }
  return value;
};

const multiply = (a, b) => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export const sampleSpinorOverlapLoop = ({
  kPoints = 32,
  polarAngle = 1.1,
  physicalWinding = 1,
  gaugeWinding = 0,
} = {}) => {
  integerInRange('kPoints', kPoints, 8, 512);
  finite('polarAngle', polarAngle);
  integerInRange('physicalWinding', physicalWinding, -4, 4);
  integerInRange('gaugeWinding', gaugeWinding, -4, 4);

  const c = Math.cos(polarAngle / 2);
  const s = Math.sin(polarAngle / 2);
  const state = (k) => {
    const gauge = gaugeWinding * k;
    const orbitalPhase = physicalWinding * k;
    return [
      { re: c * Math.cos(gauge), im: c * Math.sin(gauge) },
      {
        re: s * Math.cos(gauge + orbitalPhase),
        im: s * Math.sin(gauge + orbitalPhase),
      },
    ];
  };
  const inner = (left, right) => {
    let re = 0;
    let im = 0;
    for (let index = 0; index < left.length; index += 1) {
      re += left[index].re * right[index].re + left[index].im * right[index].im;
      im += left[index].re * right[index].im - left[index].im * right[index].re;
    }
    return { re, im };
  };

  let product = { re: 1, im: 0 };
  let phaseSum = 0;
  let invariantMetric = 0;
  let minOverlap = 1;
  const overlaps = [];
  for (let index = 0; index < kPoints; index += 1) {
    const k = 2 * Math.PI * index / kPoints;
    const nextK = 2 * Math.PI * (index + 1) / kPoints;
    const overlap = inner(state(k), state(nextK));
    const magnitude = Math.hypot(overlap.re, overlap.im);
    const phase = Math.atan2(overlap.im, overlap.re);
    product = multiply(product, overlap);
    phaseSum += phase;
    invariantMetric += 1 - magnitude ** 2;
    minOverlap = Math.min(minOverlap, magnitude);
    overlaps.push({ k, magnitude, phase });
  }

  const principalPhase = Math.atan2(product.im, product.re);
  const centerModulo = ((-principalPhase / (2 * Math.PI)) % 1 + 1) % 1;
  const centerUnwrapped = -phaseSum / (2 * Math.PI);
  return {
    overlaps,
    principalPhase,
    centerModulo,
    centerUnwrapped,
    invariantMetric,
    minOverlap,
  };
};
