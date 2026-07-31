const TWO_PI = 2 * Math.PI;

const ensureFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite.`);
  return value;
};

const ensurePositive = (value, label) => {
  ensureFinite(value, label);
  if (value <= 0) throw new RangeError(`${label} must be positive.`);
  return value;
};

const ensureIntegerRange = (value, label, minimum, maximum) => {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${label} must be an integer between ${minimum} and ${maximum}.`);
  }
  return value;
};

const periodicGrid = (points) => Array.from({ length: points }, (_, index) => TWO_PI * index / points);

const periodicIntegral = (values) => TWO_PI * values.reduce((sum, value) => sum + value, 0) / values.length;

const wrappedIntervalContains = (x, start, end) => {
  const wrap = (value) => ((value % TWO_PI) + TWO_PI) % TWO_PI;
  const xw = wrap(x);
  const sw = wrap(start);
  const ew = wrap(end);
  return sw <= ew ? xw >= sw && xw < ew : xw >= sw || xw < ew;
};

export const densityModelDefaults = Object.freeze({
  points: 240,
  energyGauge: Object.freeze({
    baseOffset: 1.2,
    firstHarmonic: 0.25,
    secondHarmonic: -0.12,
    gaugeAmplitude: 0.45,
    regionStart: 0.3 * Math.PI,
    regionEnd: 1.35 * Math.PI,
  }),
  kineticGauge: Object.freeze({ amplitude: 0.55 }),
  stressGauge: Object.freeze({ baseAmplitude: 0.7, gaugeAmplitude: 0.55, surfaceX: 0.38 * Math.PI }),
  elf: Object.freeze({ baselineRatio: 1, shellContrast: 2.2, shellWidth: 0.16 }),
});

export function periodicEnergyGauge({
  baseOffset = densityModelDefaults.energyGauge.baseOffset,
  firstHarmonic = densityModelDefaults.energyGauge.firstHarmonic,
  secondHarmonic = densityModelDefaults.energyGauge.secondHarmonic,
  gaugeAmplitude = densityModelDefaults.energyGauge.gaugeAmplitude,
  regionStart = densityModelDefaults.energyGauge.regionStart,
  regionEnd = densityModelDefaults.energyGauge.regionEnd,
  points = densityModelDefaults.points,
} = {}) {
  [baseOffset, firstHarmonic, secondHarmonic, gaugeAmplitude, regionStart, regionEnd]
    .forEach((value, index) => ensureFinite(value, ['baseOffset', 'firstHarmonic', 'secondHarmonic', 'gaugeAmplitude', 'regionStart', 'regionEnd'][index]));
  ensureIntegerRange(points, 'points', 32, 4096);
  const grid = periodicGrid(points);
  const base = grid.map((x) => baseOffset + firstHarmonic * Math.cos(x) + secondHarmonic * Math.cos(2 * x));
  // Gauge term is d[gaugeAmplitude sin(x)]/dx.
  const gaugeTerm = grid.map((x) => gaugeAmplitude * Math.cos(x));
  const transformed = base.map((value, index) => value + gaugeTerm[index]);
  const selection = grid.map((x) => wrappedIntervalContains(x, regionStart, regionEnd));
  const dx = TWO_PI / points;
  const regionBase = base.reduce((sum, value, index) => sum + (selection[index] ? value * dx : 0), 0);
  const regionTransformed = transformed.reduce((sum, value, index) => sum + (selection[index] ? value * dx : 0), 0);
  const analyticBoundaryShift = gaugeAmplitude * (Math.sin(regionEnd) - Math.sin(regionStart));
  return Object.freeze({
    grid: Object.freeze(grid),
    base: Object.freeze(base),
    gaugeTerm: Object.freeze(gaugeTerm),
    transformed: Object.freeze(transformed),
    totalBase: periodicIntegral(base),
    totalTransformed: periodicIntegral(transformed),
    regionBase,
    regionTransformed,
    regionShift: regionTransformed - regionBase,
    analyticBoundaryShift,
    boundary: 'one-dimensional periodic cell; full-cell divergence integral vanishes, subregion integral retains endpoint flux',
  });
}

export function periodicKineticGauge({
  amplitude = densityModelDefaults.kineticGauge.amplitude,
  points = densityModelDefaults.points,
} = {}) {
  ensureFinite(amplitude, 'amplitude');
  if (Math.abs(amplitude) >= 0.95) throw new RangeError('absolute amplitude must be below 0.95.');
  ensureIntegerRange(points, 'points', 32, 4096);
  const normalization = 1 / Math.sqrt(TWO_PI * (1 + amplitude ** 2 / 2));
  const grid = periodicGrid(points);
  const psi = grid.map((x) => normalization * (1 + amplitude * Math.cos(x)));
  const derivative = grid.map((x) => -normalization * amplitude * Math.sin(x));
  const laplacian = grid.map((x) => -normalization * amplitude * Math.cos(x));
  const density = psi.map((value) => value ** 2);
  const densityLaplacian = psi.map((value, index) => 2 * (derivative[index] ** 2 + value * laplacian[index]));
  const tLaplacian = psi.map((value, index) => -0.5 * value * laplacian[index]);
  const tGradient = derivative.map((value) => 0.5 * value ** 2);
  const gaugeDifference = tGradient.map((value, index) => value - tLaplacian[index]);
  return Object.freeze({
    grid: Object.freeze(grid),
    psi: Object.freeze(psi),
    density: Object.freeze(density),
    densityLaplacian: Object.freeze(densityLaplacian),
    tLaplacian: Object.freeze(tLaplacian),
    tGradient: Object.freeze(tGradient),
    gaugeDifference: Object.freeze(gaugeDifference),
    normalization,
    orbitalNorm: periodicIntegral(density),
    integralLaplacianGauge: periodicIntegral(tLaplacian),
    integralGradientGauge: periodicIntegral(tGradient),
    integralDensityLaplacian: periodicIntegral(densityLaplacian),
    boundary: 'real periodic one-orbital profile; t-gradient minus t-laplacian equals one quarter of the density Laplacian',
  });
}

export function stressGaugeAt({
  x,
  y,
  baseAmplitude = densityModelDefaults.stressGauge.baseAmplitude,
  gaugeAmplitude = densityModelDefaults.stressGauge.gaugeAmplitude,
} = {}) {
  [x, y, baseAmplitude, gaugeAmplitude]
    .forEach((value, index) => ensureFinite(value, ['x', 'y', 'baseAmplitude', 'gaugeAmplitude'][index]));
  // Base sigma_xx = B sin(x), so f_x = d_x sigma_xx = B cos(x).
  // Gauge comes from Airy function chi=A sin(x)sin(y):
  // delta sigma_xx=d_yy chi, delta sigma_yy=d_xx chi, delta sigma_xy=-d_xy chi.
  const deltaXX = -gaugeAmplitude * Math.sin(x) * Math.sin(y);
  const deltaYY = -gaugeAmplitude * Math.sin(x) * Math.sin(y);
  const deltaXY = -gaugeAmplitude * Math.cos(x) * Math.cos(y);
  const tensor = [
    [baseAmplitude * Math.sin(x) + deltaXX, deltaXY],
    [deltaXY, deltaYY],
  ];
  return Object.freeze({
    tensor: Object.freeze(tensor.map((row) => Object.freeze(row))),
    baseTensor: Object.freeze([[baseAmplitude * Math.sin(x), 0], [0, 0]].map((row) => Object.freeze(row))),
    gaugeTensor: Object.freeze([[deltaXX, deltaXY], [deltaXY, deltaYY]].map((row) => Object.freeze(row))),
    forceDensity: Object.freeze([baseAmplitude * Math.cos(x), 0]),
    gaugeDivergence: Object.freeze([0, 0]),
  });
}

export function stressGaugeSurfaceFlux({
  surfaceX = densityModelDefaults.stressGauge.surfaceX,
  baseAmplitude = densityModelDefaults.stressGauge.baseAmplitude,
  gaugeAmplitude = densityModelDefaults.stressGauge.gaugeAmplitude,
  points = densityModelDefaults.points,
} = {}) {
  [surfaceX, baseAmplitude, gaugeAmplitude]
    .forEach((value, index) => ensureFinite(value, ['surfaceX', 'baseAmplitude', 'gaugeAmplitude'][index]));
  ensureIntegerRange(points, 'points', 32, 4096);
  const yGrid = periodicGrid(points);
  const samples = yGrid.map((y) => stressGaugeAt({ x: surfaceX, y, baseAmplitude, gaugeAmplitude }));
  const dy = TWO_PI / points;
  const baseFlux = [
    yGrid.reduce((sum) => sum + baseAmplitude * Math.sin(surfaceX) * dy, 0),
    0,
  ];
  const transformedFlux = [
    samples.reduce((sum, sample) => sum + sample.tensor[0][0] * dy, 0),
    samples.reduce((sum, sample) => sum + sample.tensor[1][0] * dy, 0),
  ];
  return Object.freeze({
    yGrid: Object.freeze(yGrid),
    samples: Object.freeze(samples),
    baseFlux: Object.freeze(baseFlux),
    transformedFlux: Object.freeze(transformedFlux),
    analyticFlux: Object.freeze([TWO_PI * baseAmplitude * Math.sin(surfaceX), 0]),
    fluxDifference: Object.freeze(transformedFlux.map((value, index) => value - baseFlux[index])),
    boundary: 'periodic y direction and a full vertical cut; the Airy-gauge traction integrates to zero over the complete period',
  });
}

export function spinThomasFermiKineticDensity({ density }) {
  ensurePositive(density, 'density');
  const coefficient = (3 / 10) * (6 * Math.PI ** 2) ** (2 / 3);
  return coefficient * density ** (5 / 3);
}

export function elfFromKinetic({ density, densityGradient, positiveKineticDensity }) {
  ensurePositive(density, 'density');
  ensureFinite(densityGradient, 'densityGradient');
  ensureFinite(positiveKineticDensity, 'positiveKineticDensity');
  if (positiveKineticDensity < 0) throw new RangeError('positiveKineticDensity must be non-negative.');
  const weizsacker = densityGradient ** 2 / (8 * density);
  const excess = positiveKineticDensity - weizsacker;
  if (excess < -1e-12) throw new RangeError('excess fermionic kinetic density is negative beyond tolerance.');
  const clippedExcess = Math.max(0, excess);
  const thomasFermi = spinThomasFermiKineticDensity({ density });
  const ratio = clippedExcess / thomasFermi;
  return Object.freeze({
    weizsacker,
    excess: clippedExcess,
    thomasFermi,
    ratio,
    elf: 1 / (1 + ratio ** 2),
  });
}

export function elfFromRatio(ratio) {
  ensureFinite(ratio, 'ratio');
  if (ratio < 0) throw new RangeError('ratio must be non-negative.');
  return 1 / (1 + ratio ** 2);
}

export function elfShellProfile({
  baselineRatio = densityModelDefaults.elf.baselineRatio,
  shellContrast = densityModelDefaults.elf.shellContrast,
  shellWidth = densityModelDefaults.elf.shellWidth,
  points = densityModelDefaults.points,
} = {}) {
  ensureFinite(baselineRatio, 'baselineRatio');
  ensureFinite(shellContrast, 'shellContrast');
  ensurePositive(shellWidth, 'shellWidth');
  if (baselineRatio < 0 || shellContrast < 0) throw new RangeError('ELF ratios must be non-negative.');
  ensureIntegerRange(points, 'points', 32, 4096);
  const xMin = -1.5;
  const xMax = 1.0;
  const grid = Array.from({ length: points }, (_, index) => xMin + (xMax - xMin) * index / (points - 1));
  const centers = [-0.72, 0.12];
  const ratio = grid.map((x) => baselineRatio + shellContrast * centers.reduce(
    (sum, center) => sum + Math.exp(-0.5 * ((x - center) / shellWidth) ** 2),
    0,
  ));
  const elf = ratio.map(elfFromRatio);
  return Object.freeze({
    grid: Object.freeze(grid),
    ratio: Object.freeze(ratio),
    elf: Object.freeze(elf),
    minimumElf: Math.min(...elf),
    maximumElf: Math.max(...elf),
    centers: Object.freeze(centers),
    boundary: 'analytic ratio profile for demonstrating the bounded mapping in Martin H.21; it is not an atomic or molecular orbital calculation',
  });
}
