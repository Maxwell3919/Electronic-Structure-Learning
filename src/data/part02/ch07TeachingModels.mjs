const requireFinite = (value, name) => {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
};

const requireInteger = (value, name, lower, upper) => {
  if (!Number.isInteger(value) || value < lower || value > upper) {
    throw new RangeError(`${name} must be an integer in [${lower}, ${upper}]`);
  }
};

export function kohnShamEnergyFromEigenvalueSum({
  eigenvalueSum,
  hartreeEnergy,
  exchangeCorrelationEnergy,
  exchangeCorrelationPotentialIntegral,
  ionIonEnergy = 0,
}) {
  requireFinite(eigenvalueSum, 'eigenvalueSum');
  requireFinite(hartreeEnergy, 'hartreeEnergy');
  requireFinite(exchangeCorrelationEnergy, 'exchangeCorrelationEnergy');
  requireFinite(exchangeCorrelationPotentialIntegral, 'exchangeCorrelationPotentialIntegral');
  requireFinite(ionIonEnergy, 'ionIonEnergy');

  const hartreeCorrection = -hartreeEnergy;
  const exchangeCorrelationCorrection =
    exchangeCorrelationEnergy - exchangeCorrelationPotentialIntegral;
  const totalEnergy =
    eigenvalueSum +
    hartreeCorrection +
    exchangeCorrelationCorrection +
    ionIonEnergy;

  return {
    eigenvalueSum,
    hartreeEnergy,
    exchangeCorrelationEnergy,
    exchangeCorrelationPotentialIntegral,
    ionIonEnergy,
    hartreeCorrection,
    exchangeCorrelationCorrection,
    totalEnergy,
  };
}

export function boxOrbitalValue(index, x, length = 1) {
  requireInteger(index, 'index', 1, 32);
  requireFinite(x, 'x');
  requireFinite(length, 'length');
  if (length <= 0) throw new RangeError('length must be positive');
  if (x < 0 || x > length) throw new RangeError('x must lie inside the box');
  return Math.sqrt(2 / length) * Math.sin((index * Math.PI * x) / length);
}

export function spinDegenerateOccupations(electronCount, orbitalCount = 4) {
  requireInteger(electronCount, 'electronCount', 1, 2 * orbitalCount);
  requireInteger(orbitalCount, 'orbitalCount', 1, 16);

  let remaining = electronCount;
  return Array.from({ length: orbitalCount }, () => {
    const occupation = Math.min(2, remaining);
    remaining -= occupation;
    return occupation;
  });
}

export function boxDensityAt(x, electronCount, orbitalCount = 4, length = 1) {
  const occupations = spinDegenerateOccupations(electronCount, orbitalCount);
  return occupations.reduce((density, occupation, offset) => {
    const orbital = boxOrbitalValue(offset + 1, x, length);
    return density + occupation * orbital ** 2;
  }, 0);
}

export function boxKineticEnergy(electronCount, orbitalCount = 4, length = 1) {
  requireFinite(length, 'length');
  if (length <= 0) throw new RangeError('length must be positive');
  const occupations = spinDegenerateOccupations(electronCount, orbitalCount);
  return occupations.reduce((energy, occupation, offset) => {
    const index = offset + 1;
    return energy + occupation * (index ** 2 * Math.PI ** 2) / (2 * length ** 2);
  }, 0);
}

export function sampleBoxDensity({
  electronCount,
  orbitalCount = 4,
  length = 1,
  sampleCount = 241,
}) {
  requireInteger(sampleCount, 'sampleCount', 3, 4001);
  const occupations = spinDegenerateOccupations(electronCount, orbitalCount);
  const samples = Array.from({ length: sampleCount }, (_, index) => {
    const x = (length * index) / (sampleCount - 1);
    const orbitalDensities = occupations.map((occupation, offset) => {
      const orbital = boxOrbitalValue(offset + 1, x, length);
      return occupation * orbital ** 2;
    });
    return {
      x,
      density: orbitalDensities.reduce((sum, value) => sum + value, 0),
      orbitalDensities,
    };
  });

  return {
    electronCount,
    orbitalCount,
    length,
    occupations,
    kineticEnergy: boxKineticEnergy(electronCount, orbitalCount, length),
    samples,
  };
}

export function trapezoidIntegral(samples, xKey = 'x', yKey = 'density') {
  if (!Array.isArray(samples) || samples.length < 2) {
    throw new RangeError('samples must contain at least two points');
  }
  let integral = 0;
  for (let index = 1; index < samples.length; index += 1) {
    const left = samples[index - 1];
    const right = samples[index];
    const dx = right[xKey] - left[xKey];
    integral += 0.5 * dx * (left[yKey] + right[yKey]);
  }
  return integral;
}
