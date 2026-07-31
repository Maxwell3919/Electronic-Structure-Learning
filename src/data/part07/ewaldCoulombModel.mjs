const ensureFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite.`);
  return value;
};

const ensurePositive = (value, label) => {
  ensureFinite(value, label);
  if (value <= 0) throw new RangeError(`${label} must be positive.`);
  return value;
};

const norm3 = (vector) => Math.hypot(vector[0], vector[1], vector[2]);

// Numerical Recipes approximation; absolute error is adequate for the deterministic teaching model.
export function complementaryErrorFunction(value) {
  ensureFinite(value, 'value');
  const z = Math.abs(value);
  const t = 1 / (1 + 0.5 * z);
  const tau = t * Math.exp(
    -z * z
    - 1.26551223
    + t * (
      1.00002368
      + t * (
        0.37409196
        + t * (
          0.09678418
          + t * (
            -0.18628806
            + t * (
              0.27886807
              + t * (
                -1.13520398
                + t * (
                  1.48851587
                  + t * (-0.82215223 + t * 0.17087277)
                )
              )
            )
          )
        )
      )
    ),
  );
  return value >= 0 ? tau : 2 - tau;
}

export function errorFunction(value) {
  return 1 - complementaryErrorFunction(value);
}

export const ewaldModelDefaults = Object.freeze({
  cellLength: 1,
  alpha: 4,
  realCutoff: 4,
  reciprocalCutoff: 5,
  positions: Object.freeze([
    Object.freeze([0, 0, 0]),
    Object.freeze([0.5, 0.5, 0.5]),
  ]),
  charges: Object.freeze([1, -1]),
});

export function ewaldPotentialSplit({ distance, alpha }) {
  ensurePositive(distance, 'distance');
  ensurePositive(alpha, 'alpha');
  const shortRange = complementaryErrorFunction(alpha * distance) / distance;
  const smoothLongRange = errorFunction(alpha * distance) / distance;
  return Object.freeze({
    distance,
    shortRange,
    smoothLongRange,
    total: shortRange + smoothLongRange,
  });
}

function validateChargesAndPositions(charges, positions) {
  if (!Array.isArray(charges) || !Array.isArray(positions) || charges.length !== positions.length || charges.length === 0) {
    throw new TypeError('charges and positions must be non-empty arrays of equal length.');
  }
  charges.forEach((charge, index) => ensureFinite(charge, `charges[${index}]`));
  positions.forEach((position, index) => {
    if (!Array.isArray(position) || position.length !== 3) {
      throw new TypeError(`positions[${index}] must be a three-component vector.`);
    }
    position.forEach((value, component) => ensureFinite(value, `positions[${index}][${component}]`));
  });
}

export function ewaldEnergy({
  charges = ewaldModelDefaults.charges,
  positions = ewaldModelDefaults.positions,
  cellLength = ewaldModelDefaults.cellLength,
  alpha = ewaldModelDefaults.alpha,
  realCutoff = ewaldModelDefaults.realCutoff,
  reciprocalCutoff = ewaldModelDefaults.reciprocalCutoff,
  includeBackground = true,
} = {}) {
  validateChargesAndPositions(charges, positions);
  ensurePositive(cellLength, 'cellLength');
  ensurePositive(alpha, 'alpha');
  if (!Number.isInteger(realCutoff) || realCutoff < 0 || realCutoff > 12) {
    throw new RangeError('realCutoff must be an integer between 0 and 12.');
  }
  if (!Number.isInteger(reciprocalCutoff) || reciprocalCutoff < 0 || reciprocalCutoff > 12) {
    throw new RangeError('reciprocalCutoff must be an integer between 0 and 12.');
  }

  const volume = cellLength ** 3;
  let realSpace = 0;
  for (let i = 0; i < charges.length; i += 1) {
    for (let j = 0; j < charges.length; j += 1) {
      for (let nx = -realCutoff; nx <= realCutoff; nx += 1) {
        for (let ny = -realCutoff; ny <= realCutoff; ny += 1) {
          for (let nz = -realCutoff; nz <= realCutoff; nz += 1) {
            if (i === j && nx === 0 && ny === 0 && nz === 0) continue;
            const displacement = [
              positions[i][0] - positions[j][0] + nx * cellLength,
              positions[i][1] - positions[j][1] + ny * cellLength,
              positions[i][2] - positions[j][2] + nz * cellLength,
            ];
            const distance = norm3(displacement);
            realSpace += 0.5 * charges[i] * charges[j]
              * complementaryErrorFunction(alpha * distance) / distance;
          }
        }
      }
    }
  }

  let reciprocalSpace = 0;
  for (let hx = -reciprocalCutoff; hx <= reciprocalCutoff; hx += 1) {
    for (let hy = -reciprocalCutoff; hy <= reciprocalCutoff; hy += 1) {
      for (let hz = -reciprocalCutoff; hz <= reciprocalCutoff; hz += 1) {
        if (hx === 0 && hy === 0 && hz === 0) continue;
        const reciprocalVector = [
          2 * Math.PI * hx / cellLength,
          2 * Math.PI * hy / cellLength,
          2 * Math.PI * hz / cellLength,
        ];
        const gSquared = reciprocalVector.reduce((sum, value) => sum + value ** 2, 0);
        let realStructure = 0;
        let imaginaryStructure = 0;
        for (let index = 0; index < charges.length; index += 1) {
          const phase = reciprocalVector.reduce(
            (sum, value, component) => sum + value * positions[index][component],
            0,
          );
          realStructure += charges[index] * Math.cos(phase);
          imaginaryStructure += charges[index] * Math.sin(phase);
        }
        const structureNorm = realStructure ** 2 + imaginaryStructure ** 2;
        reciprocalSpace += (2 * Math.PI / volume)
          * Math.exp(-gSquared / (4 * alpha ** 2))
          * structureNorm / gSquared;
      }
    }
  }

  const selfEnergy = -alpha / Math.sqrt(Math.PI)
    * charges.reduce((sum, charge) => sum + charge ** 2, 0);
  const netCharge = charges.reduce((sum, charge) => sum + charge, 0);
  const backgroundEnergy = includeBackground
    ? -Math.PI * netCharge ** 2 / (2 * alpha ** 2 * volume)
    : 0;
  const total = realSpace + reciprocalSpace + selfEnergy + backgroundEnergy;

  return Object.freeze({
    realSpace,
    reciprocalSpace,
    selfEnergy,
    backgroundEnergy,
    total,
    netCharge,
    alpha,
    realCutoff,
    reciprocalCutoff,
    boundary: 'three-dimensional periodic tin-foil boundary; no finite-dielectric surface term',
  });
}

export function reciprocalSmallGTerm({ netCharge, volume, gMagnitude }) {
  ensureFinite(netCharge, 'netCharge');
  ensurePositive(volume, 'volume');
  ensurePositive(gMagnitude, 'gMagnitude');
  return 2 * Math.PI * netCharge ** 2 / (volume * gMagnitude ** 2);
}

export function gaussianPairPotential({ distance, charge1, charge2, width }) {
  ensureFinite(distance, 'distance');
  ensureFinite(charge1, 'charge1');
  ensureFinite(charge2, 'charge2');
  ensurePositive(width, 'width');
  if (distance < 0) throw new RangeError('distance must be non-negative.');
  if (distance === 0) return charge1 * charge2 / (Math.sqrt(Math.PI) * width);
  return charge1 * charge2 * errorFunction(distance / (2 * width)) / distance;
}

export function gaussianSelfEnergy({ charge, width }) {
  ensureFinite(charge, 'charge');
  ensurePositive(width, 'width');
  return charge ** 2 / (2 * Math.sqrt(Math.PI) * width);
}

export function planarDipolePotentialStep({ surfaceChargeDensity, separation }) {
  ensureFinite(surfaceChargeDensity, 'surfaceChargeDensity');
  ensureFinite(separation, 'separation');
  return 4 * Math.PI * surfaceChargeDensity * separation;
}

export function slabDipoleImageEnergy({ dipoleMoment, area, cellLength }) {
  ensureFinite(dipoleMoment, 'dipoleMoment');
  ensurePositive(area, 'area');
  ensurePositive(cellLength, 'cellLength');
  return 2 * Math.PI * dipoleMoment ** 2 / (area * cellLength);
}

export function leadingChargedImageEnergy({ charge, madelungMagnitude, dielectricConstant, length }) {
  ensureFinite(charge, 'charge');
  ensurePositive(madelungMagnitude, 'madelungMagnitude');
  ensurePositive(dielectricConstant, 'dielectricConstant');
  ensurePositive(length, 'length');
  return charge ** 2 * madelungMagnitude / (2 * dielectricConstant * length);
}
