const TRIM_ORDER = Object.freeze([
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
]);

function assertParity(value, label) {
  if (value !== 1 && value !== -1) {
    throw new RangeError(`${label} must be +1 or -1`);
  }
}

function parityProduct(values) {
  return values.reduce((product, value) => product * value, 1);
}

function productToBit(product) {
  return product === -1 ? 1 : 0;
}

export function trimOrder3D() {
  return TRIM_ORDER.map((entry) => [...entry]);
}

export function indicesFromTrimParities(parities) {
  if (!Array.isArray(parities) || parities.length !== TRIM_ORDER.length) {
    throw new RangeError('exactly eight TRIM parity products are required');
  }
  parities.forEach((value, index) => assertParity(value, `parities[${index}]`));

  const strongProduct = parityProduct(parities);
  const weakProducts = [0, 1, 2].map((axis) => parityProduct(
    parities.filter((_, index) => TRIM_ORDER[index][axis] === 1),
  ));
  const nu0 = productToBit(strongProduct);
  const weak = weakProducts.map(productToBit);
  const phase = nu0 === 1
    ? 'strong'
    : weak.some((value) => value === 1)
      ? 'weak'
      : 'trivial';

  return {
    nu0,
    nu1: weak[0],
    nu2: weak[1],
    nu3: weak[2],
    strongProduct,
    weakProducts,
    phase,
  };
}

export function formatZ2Indices(result) {
  for (const key of ['nu0', 'nu1', 'nu2', 'nu3']) {
    if (result?.[key] !== 0 && result?.[key] !== 1) {
      throw new TypeError(`result.${key} must be 0 or 1`);
    }
  }
  return `(${result.nu0};${result.nu1}${result.nu2}${result.nu3})`;
}

export function weakReciprocalVector(result) {
  const components = [result.nu1, result.nu2, result.nu3];
  components.forEach((value, index) => {
    if (value !== 0 && value !== 1) throw new TypeError(`weak index ${index + 1} must be 0 or 1`);
  });
  return components.map((value) => value / 2);
}

export function surfaceConeParity(result) {
  const indices = indicesFromTrimParities(result);
  return {
    ...indices,
    oddOnEverySurface: indices.nu0 === 1,
    translationProtectedWeakPhase: indices.nu0 === 0 && indices.phase === 'weak',
  };
}
