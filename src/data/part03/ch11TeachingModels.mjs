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

export const normCorrectionCoefficient = (rc) => {
  const target = normInside(reducedAllElectron, rc);
  const baseNorm = normInside((r) => hermiteBase(r, rc), rc);
  const cross = 2 * integrate((r) => hermiteBase(r, rc) * correctionShape(r, rc), rc);
  const square = normInside((r) => correctionShape(r, rc), rc);
  const discriminant = cross ** 2 - 4 * square * (baseNorm - target);
  if (discriminant < 0 || square < 1e-14) return 0;
  const rootA = (-cross + Math.sqrt(discriminant)) / (2 * square);
  const rootB = (-cross - Math.sqrt(discriminant)) / (2 * square);
  return Math.abs(rootA) <= Math.abs(rootB) ? rootA : rootB;
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
  const strongQ = Math.sqrt(2 * (energy + strongDepth));
  let best = null;
  let previousQ = 0.05;
  let previousF = previousQ * rc / Math.tan(previousQ * rc) - 1 - target;
  const maxQ = Math.max(0.1, strongQ - Math.PI / rc * 0.6);
  const samples = 30000;

  for (let index = 1; index <= samples; index += 1) {
    const q = 0.05 + (maxQ - 0.05) * index / samples;
    if (Math.abs(Math.sin(q * rc)) < 1e-4) {
      previousQ = q;
      previousF = Number.NaN;
      continue;
    }
    const value = q * rc / Math.tan(q * rc) - 1 - target;
    if (Number.isFinite(previousF) && value * previousF < 0) {
      let lower = previousQ;
      let upper = q;
      for (let iteration = 0; iteration < 80; iteration += 1) {
        const middle = 0.5 * (lower + upper);
        const middleValue = middle * rc / Math.tan(middle * rc) - 1 - target;
        const lowerValue = lower * rc / Math.tan(lower * rc) - 1 - target;
        if (middleValue * lowerValue <= 0) upper = middle;
        else lower = middle;
      }
      const root = 0.5 * (lower + upper);
      if (Math.abs(root - strongQ) > 0.2) best = root;
    }
    previousQ = q;
    previousF = value;
  }

  if (best === null) return strongDepth;
  return best ** 2 / 2 - energy;
};

export const residualFourierTail = (coreRadius, cutoffQ) => Math.exp(-((coreRadius * cutoffQ) ** 2));

export const cutoffForTail = (coreRadius, tolerance = 1e-6) => Math.sqrt(-Math.log(tolerance)) / coreRadius;

export const augmentationNorm = (smoothNorm, augmentationContribution) => smoothNorm + augmentationContribution;
