const assertFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
  return value;
};

const assertPositive = (value, label) => {
  assertFinite(value, label);
  if (!(value > 0)) throw new RangeError(`${label} must be positive`);
  return value;
};

export const alternativeForceDefaults = Object.freeze({
  stationary: Object.freeze({
    stiffness: 5,
    electronicResponse: 0.8,
    directSlope: -1.2,
    directCurvature: 0.7,
    pathSlope: 0,
    lambda: 0.18,
  }),
  frozenReference: Object.freeze({
    stiffness: 4,
    referenceDensity: 1.4,
    sourceCoupling: 0.8,
    lambda: 0.25,
  }),
  pressure: Object.freeze({
    kineticCoefficient: 5,
    attractionCoefficient: 4,
    volume: 12,
  }),
  surface: Object.freeze({
    xMin: -0.8,
    xMax: 1.2,
    yMin: -0.6,
    yMax: 0.9,
    normalGradient: 0.7,
    crossingShear: 0.35,
    verticalGradient: -0.25,
  }),
});

/**
 * Stationary functional
 * E(x,lambda) = directSlope*lambda + 1/2 directCurvature*lambda^2
 *             + 1/2 stiffness*(x-electronicResponse*lambda)^2.
 * At lambda=0, x=0 is stationary. Along x=pathSlope*lambda every path has
 * the same first derivative, but different second-order error.
 */
export function stationaryPathModel({
  stiffness = alternativeForceDefaults.stationary.stiffness,
  electronicResponse = alternativeForceDefaults.stationary.electronicResponse,
  directSlope = alternativeForceDefaults.stationary.directSlope,
  directCurvature = alternativeForceDefaults.stationary.directCurvature,
  pathSlope = alternativeForceDefaults.stationary.pathSlope,
  lambda = alternativeForceDefaults.stationary.lambda,
} = {}) {
  assertPositive(stiffness, 'stiffness');
  [electronicResponse, directSlope, directCurvature, pathSlope, lambda]
    .forEach((value, index) => assertFinite(value, ['electronicResponse', 'directSlope', 'directCurvature', 'pathSlope', 'lambda'][index]));

  const energy = (parameter, electronicCoordinate = pathSlope * parameter) => (
    directSlope * parameter
    + 0.5 * directCurvature * parameter ** 2
    + 0.5 * stiffness * (electronicCoordinate - electronicResponse * parameter) ** 2
  );
  const optimalCoordinate = (parameter) => electronicResponse * parameter;
  const pathEnergy = energy(lambda);
  const optimizedEnergy = energy(lambda, optimalCoordinate(lambda));
  const fixedEnergy = energy(lambda, 0);
  const firstDerivativeAtOrigin = directSlope;
  const generalizedForce = -firstDerivativeAtOrigin;
  const pathSecondDerivative = directCurvature + stiffness * (pathSlope - electronicResponse) ** 2;
  const optimizedSecondDerivative = directCurvature;
  const pathError = pathEnergy - optimizedEnergy;

  return {
    energy,
    lambda,
    pathSlope,
    electronicResponse,
    pathCoordinate: pathSlope * lambda,
    optimalCoordinate: optimalCoordinate(lambda),
    pathEnergy,
    optimizedEnergy,
    fixedEnergy,
    firstDerivativeAtOrigin,
    generalizedForce,
    pathSecondDerivative,
    optimizedSecondDerivative,
    pathError,
    stationarityResidualAtOrigin: 0,
    boundary: 'First-order path equivalence holds at the stationary reference lambda=0, x=0; second-order errors remain path dependent.',
  };
}

/**
 * Scalar density-response functional.
 * E(n,lambda)=1/2 K(n-n0)^2+lambda*q*n.
 * Frozen-reference and relaxed energies share the same first derivative at lambda=0.
 */
export function frozenReferenceDifference({
  stiffness = alternativeForceDefaults.frozenReference.stiffness,
  referenceDensity = alternativeForceDefaults.frozenReference.referenceDensity,
  sourceCoupling = alternativeForceDefaults.frozenReference.sourceCoupling,
  lambda = alternativeForceDefaults.frozenReference.lambda,
} = {}) {
  assertPositive(stiffness, 'stiffness');
  assertPositive(referenceDensity, 'referenceDensity');
  assertFinite(sourceCoupling, 'sourceCoupling');
  assertFinite(lambda, 'lambda');

  const relaxedDensity = referenceDensity - lambda * sourceCoupling / stiffness;
  if (!(relaxedDensity > 0)) throw new RangeError('relaxedDensity must remain positive in the teaching regime');
  const energy = (density, parameter) => (
    0.5 * stiffness * (density - referenceDensity) ** 2
    + parameter * sourceCoupling * density
  );
  const referenceEnergy = energy(referenceDensity, 0);
  const frozenDifference = energy(referenceDensity, lambda) - referenceEnergy;
  const relaxedDifference = energy(relaxedDensity, lambda) - referenceEnergy;
  const linearDifference = lambda * sourceCoupling * referenceDensity;
  const relaxationCorrection = relaxedDifference - frozenDifference;

  return {
    lambda,
    referenceDensity,
    relaxedDensity,
    frozenDifference,
    relaxedDifference,
    linearDifference,
    relaxationCorrection,
    firstDerivative: sourceCoupling * referenceDensity,
    predictedQuadraticCorrection: -0.5 * (lambda * sourceCoupling) ** 2 / stiffness,
    boundary: 'The frozen-reference eigenvalue-like difference is first-order accurate; relaxation changes the result at second order for a stationary reference.',
  };
}

/** E(V)=A V^(-2/3)-B V^(-1/3), P=-dE/dV. */
export function pressureEquationOfState({
  kineticCoefficient = alternativeForceDefaults.pressure.kineticCoefficient,
  attractionCoefficient = alternativeForceDefaults.pressure.attractionCoefficient,
  volume = alternativeForceDefaults.pressure.volume,
  referenceVolume = null,
} = {}) {
  const a = assertPositive(kineticCoefficient, 'kineticCoefficient');
  const b = assertPositive(attractionCoefficient, 'attractionCoefficient');
  const v = assertPositive(volume, 'volume');
  const vRef = referenceVolume == null ? (2 * a / b) ** 3 : assertPositive(referenceVolume, 'referenceVolume');

  const energyAt = (value) => a * value ** (-2 / 3) - b * value ** (-1 / 3);
  const pressureAt = (value) => (2 * a / 3) * value ** (-5 / 3) - (b / 3) * value ** (-4 / 3);
  const pressureDerivativeAt = (value) => (
    -(10 * a / 9) * value ** (-8 / 3)
    + (4 * b / 9) * value ** (-7 / 3)
  );
  const equilibriumVolume = (2 * a / b) ** 3;
  const pressure = pressureAt(v);
  const bulkModulus = -v * pressureDerivativeAt(v);
  const energyDifference = energyAt(v) - energyAt(vRef);
  const pressureIntegralDifference = energyDifference; // exact identity -int_{vRef}^{v} P dV

  return {
    volume: v,
    referenceVolume: vRef,
    equilibriumVolume,
    energy: energyAt(v),
    referenceEnergy: energyAt(vRef),
    energyDifference,
    pressure,
    bulkModulus,
    pressureIntegralDifference,
    energyAt,
    pressureAt,
    pressureDerivativeAt,
    boundary: 'This spherical power-law EOS is a teaching model for direct pressure and energy reconstruction, not an ASA or material equation of state.',
  };
}

/**
 * Symmetric 2D stress field on a rectangle:
 * sigma_xx=a*x, sigma_xy=sigma_yx=c*y, sigma_yy=b*y.
 * div sigma=(a+c,b), constant. Closed-surface traction equals volume force.
 */
export function rectangularStressFlux({
  xMin = alternativeForceDefaults.surface.xMin,
  xMax = alternativeForceDefaults.surface.xMax,
  yMin = alternativeForceDefaults.surface.yMin,
  yMax = alternativeForceDefaults.surface.yMax,
  normalGradient = alternativeForceDefaults.surface.normalGradient,
  crossingShear = alternativeForceDefaults.surface.crossingShear,
  verticalGradient = alternativeForceDefaults.surface.verticalGradient,
} = {}) {
  [xMin, xMax, yMin, yMax, normalGradient, crossingShear, verticalGradient]
    .forEach((value, index) => assertFinite(value, ['xMin', 'xMax', 'yMin', 'yMax', 'normalGradient', 'crossingShear', 'verticalGradient'][index]));
  if (!(xMax > xMin) || !(yMax > yMin)) throw new RangeError('rectangle bounds must have positive width and height');
  const width = xMax - xMin;
  const height = yMax - yMin;
  const area = width * height;
  const ySquareDifference = yMax ** 2 - yMin ** 2;

  const right = [normalGradient * xMax * height, 0.5 * crossingShear * ySquareDifference];
  const left = [-normalGradient * xMin * height, -0.5 * crossingShear * ySquareDifference];
  const top = [crossingShear * yMax * width, verticalGradient * yMax * width];
  const bottom = [-crossingShear * yMin * width, -verticalGradient * yMin * width];
  const closedSurfaceFlux = [
    right[0] + left[0] + top[0] + bottom[0],
    right[1] + left[1] + top[1] + bottom[1],
  ];
  const forceDensity = [normalGradient + crossingShear, verticalGradient];
  const volumeForce = forceDensity.map((component) => component * area);
  const openSurfaceFlux = [right[0] + left[0] + top[0], right[1] + left[1] + top[1]];
  const omittedBottomFlux = bottom;

  return {
    width,
    height,
    area,
    forceDensity,
    faceFluxes: { right, left, top, bottom },
    closedSurfaceFlux,
    volumeForce,
    openSurfaceFlux,
    omittedBottomFlux,
    closedDifference: closedSurfaceFlux.map((value, index) => value - volumeForce[index]),
    boundary: 'The divergence theorem requires the complete closed boundary and every kinetic, interaction, and exchange-correlation flux contribution of the declared stress field.',
  };
}

export function rigidRegionBookkeeping({
  internalCoreEnergy = -120,
  crossingForce = 0.8,
  displacement = 0.05,
} = {}) {
  assertFinite(internalCoreEnergy, 'internalCoreEnergy');
  assertFinite(crossingForce, 'crossingForce');
  assertFinite(displacement, 'displacement');
  const initialInternal = internalCoreEnergy;
  const finalInternal = internalCoreEnergy;
  const crossingEnergyChange = -crossingForce * displacement;
  return {
    displacement,
    initialInternal,
    finalInternal,
    internalChange: finalInternal - initialInternal,
    crossingEnergyChange,
    totalEnergyChange: crossingEnergyChange,
    force: crossingForce,
    boundary: 'Rigid-region cancellation is bookkeeping at a stationary solution; it is not valid if the region, core state, boundary, or external potential changes inconsistently.',
  };
}
