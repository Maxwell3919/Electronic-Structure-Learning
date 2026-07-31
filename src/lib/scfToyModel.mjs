const DEFAULT_LIMIT = 1_000_000;
const EPSILON = 1e-12;

/**
 * Classify the linearized mixed fixed-point iteration.
 *
 * The toy map is F(x) = x* + s(x - x*) and the mixed update is
 * x_(k+1) = x_k + alpha [F(x_k) - x_k].
 * Therefore e_(k+1) = q e_k with q = 1 - alpha(1 - s).
 *
 * @param {number} responseSlope
 * @param {number} mixing
 */
export function classifyScfIteration(responseSlope, mixing) {
  const q = 1 - mixing * (1 - responseSlope);

  if (Math.abs(1 - responseSlope) <= EPSILON) {
    return {
      q,
      kind: 'degenerate',
      label: '退化映射',
      explanation: 's = 1 时 F(x) = x，每个输入都满足零残差，模型没有唯一固定点。',
    };
  }

  const magnitude = Math.abs(q);

  if (magnitude < 1 - EPSILON) {
    if (Math.abs(q) <= EPSILON) {
      return {
        q,
        kind: 'one-step',
        label: '一步到达',
        explanation: '线性模型中的误差传播因子为零。',
      };
    }

    if (q < 0) {
      return {
        q,
        kind: 'oscillatory',
        label: '振荡收敛',
        explanation: '误差符号逐步交替，但绝对值按 |q| 衰减。',
      };
    }

    return {
      q,
      kind: 'monotone',
      label: '单调收敛',
      explanation: '误差符号保持不变，绝对值按 q 衰减。',
    };
  }

  if (Math.abs(magnitude - 1) <= EPSILON) {
    return {
      q,
      kind: 'marginal',
      label: '临界/不衰减',
      explanation: '线性误差幅度不衰减，不能满足更严格的残差阈值。',
    };
  }

  return {
    q,
    kind: 'divergent',
    label: '发散',
    explanation: '误差绝对值按 |q| 放大。',
  };
}

function requireFinite(name, value) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be finite.`);
  }
}

/**
 * Run the scalar SCF fixed-point teaching model.
 *
 * @param {{
 *   responseSlope: number,
 *   mixing: number,
 *   initialValue: number,
 *   fixedPoint?: number,
 *   tolerance?: number,
 *   maxIterations?: number,
 *   absoluteLimit?: number,
 * }} options
 */
export function iterateScf(options) {
  const {
    responseSlope,
    mixing,
    initialValue,
    fixedPoint = 1,
    tolerance = 1e-6,
    maxIterations = 24,
    absoluteLimit = DEFAULT_LIMIT,
  } = options;

  requireFinite('responseSlope', responseSlope);
  requireFinite('mixing', mixing);
  requireFinite('initialValue', initialValue);
  requireFinite('fixedPoint', fixedPoint);
  requireFinite('tolerance', tolerance);
  requireFinite('absoluteLimit', absoluteLimit);

  if (mixing <= 0 || mixing > 2) {
    throw new RangeError('mixing must be in (0, 2].');
  }
  if (tolerance <= 0) {
    throw new RangeError('tolerance must be positive.');
  }
  if (!Number.isInteger(maxIterations) || maxIterations < 1 || maxIterations > 200) {
    throw new RangeError('maxIterations must be an integer in [1, 200].');
  }
  if (absoluteLimit <= 0) {
    throw new RangeError('absoluteLimit must be positive.');
  }

  const classification = classifyScfIteration(responseSlope, mixing);
  const rows = [];

  if (classification.kind === 'degenerate') {
    const output = initialValue;
    rows.push({
      iteration: 0,
      input: initialValue,
      output,
      residual: 0,
      error: initialValue - fixedPoint,
    });

    return {
      ...classification,
      fixedPoint,
      tolerance,
      converged: false,
      convergenceIteration: null,
      stoppedReason: 'degenerate-map',
      rows,
    };
  }

  let input = initialValue;
  let converged = false;
  let convergenceIteration = null;
  let stoppedReason = 'max-iterations';

  for (let iteration = 0; iteration <= maxIterations; iteration += 1) {
    const output = fixedPoint + responseSlope * (input - fixedPoint);
    const residual = output - input;
    const error = input - fixedPoint;

    rows.push({ iteration, input, output, residual, error });

    if (Math.abs(residual) <= tolerance) {
      converged = true;
      convergenceIteration = iteration;
      stoppedReason = 'residual-tolerance';
      break;
    }

    if (iteration === maxIterations) {
      break;
    }

    const nextInput = input + mixing * residual;
    if (!Number.isFinite(nextInput) || Math.abs(nextInput) > absoluteLimit) {
      stoppedReason = 'absolute-limit';
      break;
    }

    input = nextInput;
  }

  return {
    ...classification,
    fixedPoint,
    tolerance,
    converged,
    convergenceIteration,
    stoppedReason,
    rows,
  };
}
