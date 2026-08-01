const term = (id, termEn, termZh, preferredUsage, distinction = '') => ({
  id, termEn, termZh, preferredUsage, distinction,
});

export const terminology = [
  term('hamiltonian', 'Hamiltonian', 'Hamiltonian（哈密顿算符）', 'Use Hamiltonian for the energy operator; state the modeled terms and scope.'),
  term('operator', 'operator', '算符', 'Use for a map acting on states or functions; do not conflate it with a scalar observable value.'),
  term('observable', 'observable', '可观测量', 'Name the operator, expectation value, units, and measurement or calculation context.'),
  term('eigenvalue', 'eigenvalue', '本征值', 'Distinguish an eigenvalue from a measured excitation or total-energy difference.'),
  term('state', 'state', '量子态', 'Use state for the physical Hilbert-space object.', 'Keep wavefunction and orbital as representations or auxiliary objects where applicable.'),
  term('wavefunction', 'wavefunction', '波函数', 'Use for a representation of a quantum state in specified coordinates and conventions.'),
  term('orbital', 'orbital', '轨道', 'State whether the orbital is Kohn–Sham, Hartree–Fock, localized, atomic-like, or another construction.'),
  term('density', 'density', '密度', 'Specify particle, electron-number, charge, spin, or pseudo-density and its units.'),
  term('charge-density', 'charge density', '电荷密度', 'Reserve for charge per volume/area/length and state the sign convention.'),
  term('pseudo-density', 'pseudo-density', '赝密度', 'Identify the pseudized construction and do not silently equate it with an all-electron density.'),
  term('spin-density', 'spin density', '自旋密度', 'State the spin convention, components, and normalization.'),
  term('density-matrix', 'density matrix', '密度矩阵', 'State basis, normalization, spin structure, and whether it is one-body or many-body.'),
  term('effective-potential', 'effective potential', '有效势', 'Name the theory and components that define the effective potential.'),
  term('external-potential', 'external potential', '外势', 'State which degrees of freedom are external and the boundary conditions.'),
  term('coulomb-interaction', 'Coulomb interaction', 'Coulomb 相互作用', 'State charges, screening convention, periodic treatment, and omitted relativistic/QED terms.'),
  term('exchange', 'exchange', '交换', 'Distinguish exact/Fock exchange, exchange energy, and an approximate functional contribution.'),
  term('correlation', 'correlation', '关联', 'State the reference decomposition; correlation is not a universal synonym for all interaction effects.'),
  term('basis', 'basis', '基组', 'Name basis functions, truncation, completeness target, and conditioning.'),
  term('representation', 'representation', '表示', 'Use for basis/grid/coordinate choices without implying a physical approximation by itself.'),
  term('discretization', 'discretization', '离散化', 'State grid, cutoff, mesh, boundary, and convergence target.'),
  term('self-consistency', 'self-consistency', '自洽性', 'Name the fixed-point variables, residual, stopping rule, and stability evidence.'),
  term('residual', 'residual', '残差', 'Define the residual norm, units or normalization, and acceptance threshold.'),
  term('convergence', 'convergence', '收敛', 'Qualify algorithmic, SCF, structural, observable, or scientific convergence.'),
  term('response-function', 'response function', '响应函数', 'State perturbation, response observable, frequency/wavevector convention, and causality.'),
  term('excitation', 'excitation', '激发', 'Distinguish auxiliary eigenvalue differences from physical neutral or charged excitations.'),
  term('quasiparticle', 'quasiparticle', '准粒子', 'State the Green-function or effective-theory context and lifetime assumptions.'),
  term('phonon', 'phonon', '声子', 'State harmonic/anharmonic level, q sampling, normalization, and stability convention.'),
  term('electron-phonon-coupling', 'electron–phonon coupling', '电子–声子耦合', 'State matrix-element normalization, bands, modes, sampling, and observable.'),
  term('wannier-function', 'Wannier function', 'Wannier 函数', 'State band subspace, gauge, localization construction, and disentanglement window where used.'),
  term('berry-phase', 'Berry phase', 'Berry 相位', 'State path, gauge convention, occupied subspace, and modulo ambiguity.'),
  term('topological-invariant', 'topological invariant', '拓扑不变量', 'Name the symmetry class, gap, manifold, discretization, and invariant definition.'),
];

export default terminology;
