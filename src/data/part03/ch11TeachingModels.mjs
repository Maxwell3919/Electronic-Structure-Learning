export const reducedAllElectron = (r) => r * (1 - 0.65 * r) * Math.exp(-0.55 * r);

export const reducedAllElectronDerivative = (r) => {
  const f = 1 - 0.65 * r;
  return Math.exp(-0.55 * r) * (f - 0.65 * r - 0.55 * r * f);
};

const hermiteBase = (r, rc) => {
  if (r >= rc) return reducedAllElectron(r);
  const x = r / rc;
  const uc = reducedAllElectron(rc);
  const duc = reducedAllElectronDerivative(rc);
  const d0 = 1;
  const h10 = x ** 3 - 2 * x ** 2 + x;
  const h01 = -2 * x ** 3 + 3 * x ** 2;
  const h11 = x ** 3 - x ** 2;
  return h10 * rc * d0 + h01 * uc + h11 * rc * duc;
};

const correctionShape = (r, rc) => {
  if (r >= rc) return 0;
  const x = r / rc;
  return x ** 2 * (1 - x) ** 2;
};

export const integrate = (fn, upper, steps = 4000) => {
  const h = upper / steps;
  let sum = 0.5 * (fn(0) + fn(upper));
  for (let index = 1; index < steps; index += 1) sum += fn(index * h);
  return sum * h;
};

export const normInside = (fn, rc) => integrate((r) => fn(r) ** 2, rc);

const normCorrectionCache = new Map();

export const normCorrectionCoefficient = (rc) => {
  if (normCorrectionCache.has(rc)) return normCorrectionCache.get(rc);

  const target = normInside(reducedAllElectron, rc);
  const baseNorm = normInside((r) => hermiteBase(r, rc), rc);
  const cross = 2 * integrate((r) => hermiteBase(r, rc) * correctionShape(r, rc), rc);
  const square = normInside((r) => correctionShape(r, rc), rc);
  const discriminant = cross ** 2 - 4 * square * (baseNorm - target);

  let coefficient = 0;
  if (discriminant >= 0 && square >= 1e-14) {
    const rootA = (-cross + Math.sqrt(discriminant)) / (2 * square);
    const rootB = (-cross - Math.sqrt(discriminant)) / (2 * square);
    coefficient = Math.abs(rootA) <= Math.abs(rootB) ? rootA : rootB;
  }

  normCorrectionCache.set(rc, coefficient);
  return coefficient;
};

export const reducedPseudo = (r, rc, conserveNorm = true) => {
  if (r >= rc) return reducedAllElectron(r);
  const coefficient = conserveNorm ? normCorrectionCoefficient(rc) : 0;
  return hermiteBase(r, rc) + coefficient * correctionShape(r, rc);
};

export const logDerivativeS = (energy, depth, rc = 1) => {
  const argument = 2 * (energy + depth);
  if (argument <= 0) return Number.NaN;
  const q = Math.sqrt(argument);
  const qr = q * rc;
  const sine = Math.sin(qr);
  if (Math.abs(sine) < 1e-10) return Number.NaN;
  return qr * Math.cos(qr) / sine - 1;
};

export const matchedWeakWellDepth = (energy, strongDepth, rc = 1) => {
  const target = logDerivativeS(energy, strongDepth, rc);
  if (!Number.isFinite(target) || target >= 0) return Number.NaN;

  const equation = (q) => q * rc / Math.tan(q * rc) - 1 - target;
  let lower = 1e-8 / rc;
  let upper = (Math.PI - 1e-8) / rc;
  let lowerValue = equation(lower);
  const upperValue = equation(upper);
  if (!Number.isFinite(lowerValue) || !Number.isFinite(upperValue) || lowerValue * upperValue > 0) {
    return Number.NaN;
  }

  for (let iteration = 0; iteration < 100; iteration += 1) {
    const middle = 0.5 * (lower + upper);
    const middleValue = equation(middle);
    if (lowerValue * middleValue <= 0) {
      upper = middle;
    } else {
      lower = middle;
      lowerValue = middleValue;
    }
  }

  const root = 0.5 * (lower + upper);
  const matchedDepth = root ** 2 / 2 - energy;
  if (!(matchedDepth > 0 && matchedDepth < strongDepth)) return Number.NaN;
  return matchedDepth;
};

export const residualFourierTail = (coreRadius, cutoffQ) => Math.exp(-((coreRadius * cutoffQ) ** 2));

export const cutoffForTail = (coreRadius, tolerance = 1e-6) => Math.sqrt(-Math.log(tolerance)) / coreRadius;

export const augmentationNorm = (smoothNorm, augmentationContribution) => smoothNorm + augmentationContribution;
