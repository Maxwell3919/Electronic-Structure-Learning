const assertFinite = (value, label) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be finite`);
  }
};

export function quadraticPhaseEnergy(volume, phase) {
  const { equilibriumVolume, curvature, offset = 0 } = phase;
  assertFinite(volume, 'volume');
  assertFinite(equilibriumVolume, 'equilibriumVolume');
  assertFinite(curvature, 'curvature');
  assertFinite(offset, 'offset');
  if (volume <= 0 || equilibriumVolume <= 0) {
    throw new RangeError('volumes must be positive');
  }
  if (curvature <= 0) {
    throw new RangeError('curvature must be positive');
  }
  const displacement = volume - equilibriumVolume;
  return offset + 0.5 * curvature * displacement * displacement;
}

export function minimizeQuadraticEnthalpy(pressure, phase) {
  const { equilibriumVolume, curvature, offset = 0 } = phase;
  assertFinite(pressure, 'pressure');
  assertFinite(equilibriumVolume, 'equilibriumVolume');
  assertFinite(curvature, 'curvature');
  assertFinite(offset, 'offset');
  if (equilibriumVolume <= 0 || curvature <= 0) {
    throw new RangeError('equilibriumVolume and curvature must be positive');
  }
  const unconstrainedVolume = equilibriumVolume - pressure / curvature;
  const volume = Math.max(0.05 * equilibriumVolume, unconstrainedVolume);
  const energy = quadraticPhaseEnergy(volume, phase);
  return {
    volume,
    energy,
    enthalpy: energy + pressure * volume,
    constrained: volume !== unconstrainedVolume,
  };
}

export function compareQuadraticPhases(pressure, phaseA, phaseB) {
  const a = minimizeQuadraticEnthalpy(pressure, phaseA);
  const b = minimizeQuadraticEnthalpy(pressure, phaseB);
  const tolerance = 1e-10;
  const difference = b.enthalpy - a.enthalpy;
  return {
    pressure,
    phaseA: a,
    phaseB: b,
    enthalpyDifferenceBMinusA: difference,
    stablePhase: Math.abs(difference) <= tolerance ? 'coexistence' : difference > 0 ? 'A' : 'B',
  };
}

export function gapHierarchy({ ksGap, derivativeCorrection, excitonBinding }) {
  assertFinite(ksGap, 'ksGap');
  assertFinite(derivativeCorrection, 'derivativeCorrection');
  assertFinite(excitonBinding, 'excitonBinding');
  if (ksGap < 0 || derivativeCorrection < 0 || excitonBinding < 0) {
    throw new RangeError('gap contributions must be non-negative');
  }
  const fundamentalGap = ksGap + derivativeCorrection;
  const opticalGap = Math.max(0, fundamentalGap - excitonBinding);
  return {
    ksGap,
    derivativeCorrection,
    excitonBinding,
    fundamentalGap,
    opticalGap,
    bindingClamped: excitonBinding > fundamentalGap,
  };
}

export const propertyRoutes = {
  structure: {
    labelZh: '平衡结构与相稳定性',
    labelEn: 'Equilibrium structure and phase stability',
    objectZh: '基态能量、力、应力与自由能差',
    objectEn: 'Ground-state energies, forces, stresses, and free-energy differences',
    methodZh: '结构弛豫、状态方程、声子/自由能',
    methodEn: 'Relaxation, equation of state, and phonon/free-energy calculations',
    boundaryZh: '局域优化不等于全局或有限温度稳定',
    boundaryEn: 'A local optimization is not global or finite-temperature stability',
  },
  phonon: {
    labelZh: '声子与位移型相变',
    labelEn: 'Phonons and displacive transitions',
    objectZh: '力常数、动力学矩阵和模式本征矢',
    objectEn: 'Force constants, dynamical matrix, and mode eigenvectors',
    methodZh: '冻结声子或密度泛函微扰理论',
    methodEn: 'Frozen phonons or density-functional perturbation theory',
    boundaryZh: 'Γ 点或粗 q 网格不能证明全区稳定',
    boundaryEn: 'A Γ-point or coarse q mesh cannot establish full-zone stability',
  },
  quasiparticle: {
    labelZh: '加减电子谱与基本带隙',
    labelEn: 'Addition/removal spectra and the fundamental gap',
    objectZh: 'N±1 多体能量和单粒子谱函数',
    objectEn: 'N±1 many-body energies and the one-particle spectral function',
    methodZh: '总能差、广义 Kohn–Sham、GW/Green 函数',
    methodEn: 'Total-energy differences, generalized Kohn–Sham, and GW/Green functions',
    boundaryZh: '普通 Kohn–Sham gap 不是一般的基本 gap',
    boundaryEn: 'An ordinary Kohn–Sham gap is not generally the fundamental gap',
  },
  optical: {
    labelZh: '光学谱与激子',
    labelEn: 'Optical spectra and excitons',
    objectZh: '定粒子数激发能、跃迁矩阵元和电子—空穴核',
    objectEn: 'Neutral excitation energies, transition matrix elements, and the electron–hole kernel',
    methodZh: 'TDDFT、Bethe–Salpeter 或适用响应方法',
    methodEn: 'TDDFT, Bethe–Salpeter, or another applicable response method',
    boundaryZh: 'DOS 峰和单粒子 gap 不能预测完整光谱',
    boundaryEn: 'A DOS peak and one-particle gap cannot predict the full spectrum',
  },
  topology: {
    labelZh: '拓扑分类与边界态',
    labelEn: 'Topological classification and boundary states',
    objectZh: '占据子空间、保护对称性和体不变量',
    objectEn: 'Occupied subspace, protecting symmetry, and a bulk invariant',
    methodZh: 'Berry 相位、Wilson loop、对称性指标与边界计算',
    methodEn: 'Berry phases, Wilson loops, symmetry indicators, and boundary calculations',
    boundaryZh: '表面局域态本身不证明体拓扑',
    boundaryEn: 'A surface-localized state alone does not establish bulk topology',
  },
};
