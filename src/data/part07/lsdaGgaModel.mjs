const requireFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite.`);
  return value;
};

export const appendixBModel = Object.freeze({
  pbeKappa: 0.804,
  pbeMu: 0.21951,
  zetaRange: Object.freeze([-1, 1]),
  reducedGradientRange: Object.freeze([0, 6]),
});

export function spinExchangeFactor(zeta) {
  requireFinite(zeta, 'zeta');
  if (zeta < -1 || zeta > 1) throw new RangeError('zeta must lie in [-1, 1].');
  return ((1 + zeta) ** (4 / 3) + (1 - zeta) ** (4 / 3)) / 2;
}

export function pbeExchangeEnhancement(
  s,
  { kappa = appendixBModel.pbeKappa, mu = appendixBModel.pbeMu } = {},
) {
  requireFinite(s, 's');
  requireFinite(kappa, 'kappa');
  requireFinite(mu, 'mu');
  if (s < 0) throw new RangeError('s must be non-negative.');
  if (kappa <= 0 || mu <= 0) throw new RangeError('kappa and mu must be positive.');
  return 1 + kappa - kappa / (1 + (mu * s ** 2) / kappa);
}

export function reducedExchangeGradient({ density, gradientMagnitude }) {
  requireFinite(density, 'density');
  requireFinite(gradientMagnitude, 'gradientMagnitude');
  if (density <= 0) throw new RangeError('density must be positive.');
  if (gradientMagnitude < 0) throw new RangeError('gradientMagnitude must be non-negative.');
  const kF = (3 * Math.PI ** 2 * density) ** (1 / 3);
  return gradientMagnitude / (2 * kF * density);
}

export function pzCorrelationEnergy(rs) {
  requireFinite(rs, 'rs');
  if (rs <= 0) throw new RangeError('rs must be positive.');
  if (rs < 1) {
    return -0.0480 + 0.0311 * Math.log(rs) - 0.0116 * rs + 0.0020 * rs * Math.log(rs);
  }
  return -0.1423 / (1 + 1.0529 * Math.sqrt(rs) + 0.3334 * rs);
}

export function pzCorrelationDerivative(rs) {
  requireFinite(rs, 'rs');
  if (rs <= 0) throw new RangeError('rs must be positive.');
  if (rs < 1) {
    return 0.0311 / rs - 0.0116 + 0.0020 * (Math.log(rs) + 1);
  }
  const denominator = 1 + 1.0529 * Math.sqrt(rs) + 0.3334 * rs;
  const derivativeDenominator = 1.0529 / (2 * Math.sqrt(rs)) + 0.3334;
  return 0.1423 * derivativeDenominator / denominator ** 2;
}

export function pzCorrelationPotential(rs) {
  return pzCorrelationEnergy(rs) - (rs / 3) * pzCorrelationDerivative(rs);
}

export function samplePbeEnhancement({ maxS = 6, count = 121 } = {}) {
  requireFinite(maxS, 'maxS');
  if (maxS <= 0) throw new RangeError('maxS must be positive.');
  if (!Number.isInteger(count) || count < 2 || count > 5001) {
    throw new RangeError('count must be an integer between 2 and 5001.');
  }
  return Array.from({ length: count }, (_, index) => {
    const s = (maxS * index) / (count - 1);
    return { s, enhancement: pbeExchangeEnhancement(s) };
  });
}
