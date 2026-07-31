# Part III content plan: atoms and pseudopotentials

Status: active planning baseline for Chapter 10 and Chapter 11

Baseline website commit: `7e0a73d74322828f0626b7174aaa61f1677dbf98`

Primary source: Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., Part III, printed pages 215–258.

Practical cross-reference: David S. Sholl and Janice A. Steckel, *Density Functional Theory: A Practical Introduction*, section 3.2 and 3.2.1, printed pages 61–64.

This document is a writing and validation plan. It records source locators, dependencies, derivation targets, visualization contracts, and chapter boundaries. It does not reproduce textbook prose, figures, or exercises.

## 1. Part-level purpose and dependency chain

Part III connects the general independent-particle and Kohn–Sham framework to the radial atomic problems used to construct effective ionic descriptions and augmentation data:

```text
central-field one-electron equation
  -> radial separation and boundary conditions
  -> self-consistent spherical atom
  -> relativistic and open-shell refinements
  -> atomic total-energy differences and atomic-sphere estimates
  -> scattering equivalence and orthogonalized plane waves
  -> norm-conserving pseudopotentials
  -> separable projectors, ultrasoft potentials, and PAW
  -> validation in atoms, molecules, and solids
```

Chapter 10 supplies the all-electron radial reference problem. Chapter 11 starts from scattering and frozen-core reduction and constructs operators intended for molecular and solid-state calculations. Chapter 10 may preview that atomic solutions become pseudopotential and augmentation references, but the construction conditions, unscreening, transferability, projectors, ultrasoft formalism, and PAW transformation belong to Chapter 11.

## 2. Source map and exact chapter boundaries

### Chapter 10 · Electronic Structure of Atoms

Martin printed pages 215–227; exercises begin on page 228 and continue through page 229.

| Section | Printed page | Website scope |
|---|---:|---|
| 10.1 One-Electron Radial Schrödinger Equation | 215 | Spherical separation, spherical harmonics, radial and reduced radial functions, boundary conditions, normalization, hydrogenic spectrum, logarithmic radial grids, numerical integration context. |
| 10.2 Independent-Particle Equations: Spherical Potentials | 217 | Closed-shell spherical density, Kohn–Sham and Hartree–Fock radial equations, self-consistency, radial Hartree/Poisson treatment, exchange-correlation choices. |
| 10.3 Spin–Orbit Interaction | 219 | Relativistic origin, scalar-relativistic terms, spin–orbit operator, atomic generation context, limits of nonrelativistic calculations. |
| 10.4 Open-Shell Atoms: Nonspherical Potentials | 219 | Restricted, spin-unrestricted, and unrestricted treatments; multiplets, cylindrical symmetry, spherical-harmonic expansions, Coulomb multipoles and radial Slater integrals. |
| 10.5 Example of Atomic States: Transition Elements | 221 | Radial localization, semicore/valence distinction, 3d–4s promotion energies, functional dependence, atomic-to-solid inference boundary. |
| 10.6 Delta-SCF: Electron Addition, Removal, and Interaction Energies | 224 | Total-energy differences, transition-state approximation, occupation dependence, effective interaction energies and screening analogy. |
| 10.7 Atomic Sphere Approximation in Solids | 225 | Atomic sphere boundary conditions, bonding/antibonding limits, Wronskian identity and bandwidth estimates; relation to APW/LMTO/KKR. |

Relevant appendices: Appendix J for scattering and phase shifts; Appendix K for spherical harmonics, Gaunt and Clebsch–Gordan coefficients; Appendix L for radial numerical methods; Appendix O for the Dirac and scalar-relativistic reductions; Appendix R for code references. Appendix material will be cited only where it closes a mathematical dependency.

### Chapter 11 · Pseudopotentials

Martin printed pages 230–255; exercises begin on page 256 and continue through page 258.

| Section | Printed page | Website scope |
|---|---:|---|
| 11.1 Scattering Amplitudes and Pseudopotentials | 230 | Partial waves, logarithmic derivatives, phase shifts, low-energy scattering equivalence, energy-dependent exact potential construction and its limits. |
| 11.2 Orthogonalized Plane Waves and Pseudopotentials | 233 | Core-state orthogonality, smooth valence functions, effective repulsive operator, OPW norm and pseudopotential transformation. |
| 11.3 Model Ion Potentials | 237 | Analytic model potentials, local models, empirical and semi-empirical scope. |
| 11.4 Norm-Conserving Pseudopotentials | 238 | Reference eigenvalue, exterior matching, logarithmic derivative, norm conservation and first-order response. |
| 11.5 Generation of l-Dependent Norm-Conserving Pseudopotentials | 241 | Radial inversion, semilocal channels, local component, relativistic channel generation and reference configurations. |
| 11.6 Unscreening and Core Corrections | 245 | Screened atomic effective potential, ionic pseudopotential, Hartree and exchange-correlation subtraction, nonlinear core correction. |
| 11.7 Transferability and Hardness | 246 | Configuration tests, logarithmic derivatives, excitation energies, cutoff-radius tradeoffs and plane-wave cost. |
| 11.8 Separable Pseudopotential Operators and Projectors | 247 | Semilocal operator to projector form, Kleinman–Bylander-type separation, local-channel choice and ghost-state boundary. |
| 11.9 Extended Norm Conservation: Beyond the Linear Regime | 248 | Multiple projectors and higher-order energy dependence. |
| 11.10 Optimized Norm-Conserving Potentials | 249 | Fourier-space optimization and residual kinetic-energy criteria. |
| 11.11 Ultrasoft Pseudopotentials | 250 | Relaxed norm conservation, overlap operator, augmentation charge, generalized eigenproblem, density reconstruction. |
| 11.12 Projector Augmented Waves | 252 | Linear transformation from smooth auxiliary state to all-electron state, partial waves, projectors, one-center corrections and frozen core. |
| 11.13 Additional Topics | 255 | Nonlocal-core effects, reconstruction, pseudohamiltonians and source-specific closing topics. |

Sholl–Steckel section 3.2 and 3.2.1, printed pages 61–64, will be used only for the practical connection among short real-space length scales, plane-wave cutoff, frozen core, transferability, hardness, ultrasoft potentials, PAW, and consistent cutoff choices in energy differences. Its simplified descriptions will not replace Martin’s operator-level derivations.

## 3. Chapter dependency and cross-reference rules

Chapter 10 depends on:

- Part I: many-electron Hamiltonian, antisymmetry, independent-particle picture, angular momentum vocabulary;
- Part II: Kohn–Sham equations, Hartree potential, exchange-correlation potential, self-consistency, eigenvalue and total-energy distinctions;
- Appendices K, L, and O for angular functions, radial integration, and relativistic reductions.

Chapter 11 depends on:

- all Chapter 10 definitions of `R_{nl}(r)`, reduced radial function `u_{nl}(r)`, radial normalization, logarithmic derivative, atomic reference state, effective potential and total-energy difference;
- Appendix J scattering notation;
- Part IV for later use in plane-wave and augmentation methods.

Cross-references must use repository-relative or `import.meta.env.BASE_URL`-aware links and must not depend on code that exists only in an open Part I or Part II PR.

## 4. Stable Part III terminology

The following English terms and symbols remain fixed across both chapters:

| English | Chinese | Preferred symbol or rule |
|---|---|---|
| radial wavefunction | 径向波函数 | `R_{nl}(r)`; Martin’s `psi_{nl}(r)` is identified explicitly when mapping notation |
| reduced radial function | 约化径向函数 | `u_{nl}(r)=rR_{nl}(r)`; Martin’s `phi_{nl}(r)` mapping is stated once |
| spherical harmonic | 球谐函数 | `Y_{lm}(theta,phi)`, normalized over solid angle |
| centrifugal potential | 离心势 | `l(l+1)/(2r^2)` in Hartree atomic units |
| radial node | 径向节点 | zero of `R` or `u` for `r>0`; origin behavior handled separately |
| atomic density | 原子电子密度 | three-dimensional density `n(r)`; radial probability is not called density without qualification |
| spherical average | 球平均 | angular average over `dOmega`; occupation averaging is stated separately |
| open shell | 开壳层 | incompletely occupied spin or magnetic sublevels |
| scalar relativistic | 标量相对论 | relativistic mass/Darwin-type corrections without explicit spin-orbit splitting |
| phase shift | 相移 | `delta_l(E)` or Martin’s `eta_l(E)`; one convention per derivation |
| logarithmic derivative | 对数导数 | `D_l(E,r)=rR_l'(E,r)/R_l(E,r)` |
| all-electron potential | 全电子势 | nuclear plus self-consistent electronic terms where applicable |
| screened potential | 屏蔽后的原子有效势 | self-consistent potential in the atomic reference calculation |
| ionic pseudopotential | 离子赝势 | screened potential after valence Hartree and exchange-correlation unscreening |
| pseudo-wavefunction | 赝波函数 | smooth reference function matching the all-electron solution outside `r_c` |
| norm conservation | 范数守恒 | equal integrated radial norm inside `r_c` at the reference energy |
| transferability | 可迁移性 | accuracy outside the generating configuration, assessed by declared tests |
| hardness | 硬度 | high reciprocal-space content or high converged basis cutoff; not a quality score |
| semilocal operator | 半局域算符 | angular-momentum projectors with radial channel potentials |
| separable nonlocal operator | 可分离非局域算符 | finite projector sum acting on the state |
| augmentation charge | 增广电荷 | density correction required by ultrasoft/PAW constructions |
| auxiliary wavefunction | 辅助平滑波函数 | PAW smooth state, distinct from reconstructed all-electron state |

## 5. Formula and derivation inventory

### Chapter 10

1. Expand the spherical-coordinate Laplacian and rewrite its angular part as `-L^2/r^2`.
2. Insert `psi(r)=R_{nl}(r)Y_{lm}(Omega)` and use `L^2Y_{lm}=l(l+1)Y_{lm}`.
3. Derive the radial equation for `R_{nl}` with measure `r^2dr`, then substitute `u=rR` to remove the first derivative.
4. Derive origin behavior by a Frobenius ansatz and state the assumptions on `V(r)`; derive the exponentially decaying bound-state asymptote under a finite ionization threshold.
5. Reduce three-dimensional normalization to `int_0^infinity |u|^2dr=1`.
6. Map the logarithmic radial coordinate, including the derivative transformation, interval mapping, numerical benefit and origin treatment.
7. Derive closed-shell density and electron-number normalization with explicit occupancy factors.
8. State the spherical Kohn–Sham equation and distinguish it from the orbital-dependent Hartree–Fock radial equation.
9. Derive the spherical Hartree potential either from the radial Poisson equation or from the shell decomposition, including boundary conditions at zero and infinity.
10. Specify the atomic SCF map, mixing variable, occupation handling, convergence residual and the separate total-energy/observable checks.
11. Derive `L·S=[J^2-L^2-S^2]/2` and the eigenvalues for `j=l±1/2`; distinguish scalar-relativistic and explicit spin-orbit terms.
12. Explain the open-shell Coulomb multipole expansion and radial Slater integrals without reproducing Martin’s long coefficient tables.
13. Define ionization energy, electron affinity, excitation and interaction energies as total-energy differences; derive the midpoint/transition-state approximation only as a supplementary derivation with its occupation-linearity assumption.
14. Derive the radial Wronskian identity used for atomic-sphere bandwidth estimates and state which boundary conditions produce the bonding and antibonding limits.

### Chapter 11

1. Derive the partial-wave asymptotic form, scattering amplitude and cross section from the phase shifts.
2. Connect equality of logarithmic derivatives at a matching radius to equality of phase shifts at the same energy.
3. Construct an orthogonalized plane wave and show how core-state orthogonality produces an effective repulsive nonlocal operator.
4. State and connect the norm-conserving conditions: reference eigenvalue, exterior wavefunction matching, logarithmic derivative matching, and interior norm equality.
5. Derive the first energy derivative of the logarithmic derivative and show the role of the interior norm.
6. Invert the radial equation to generate a channel potential, then separate screened and ionic potentials through unscreening.
7. Write the semilocal angular-momentum operator and transform it to a finite separable projector representation; state denominator and ghost-state conditions.
8. Define residual kinetic energy or Fourier-tail measures used in optimized norm-conserving construction.
9. Derive the ultrasoft generalized eigenproblem `H|psi_n>=epsilon_n S|psi_n>` and density augmentation terms.
10. Derive the PAW linear transformation `|Psi>=T|tildePsi>` and the one-center correction structure for expectation values.

Each derivation must identify unit convention, integration measure, boundary conditions, exact steps, physical approximations, numerical discretization and conclusions that do not follow from the formula.

## 6. Original visualization inventory

All plots are generated from analytic teaching models or deterministic browser-side formulas. None is presented as a real atom, pseudopotential library validation, or production DFT result.

### Chapter 10 planned visualizations

1. **Radial effective-potential explorer**: Coulomb, centrifugal, and total effective potential for selectable `l`, `Z`, and softened-core display radius. Acceptance: for `l=0`, the centrifugal trace is identically zero; for fixed `r`, increasing `l` raises the centrifugal term by the analytic amount.
2. **Hydrogenic radial-function explorer**: normalized `R_{nl}`, `u_{nl}` and radial probability for a small supported set of analytic states. Acceptance: numerical quadrature of the displayed `|u|^2` is within a declared tolerance of unity and node counts match `n-l-1`.
3. **Atomic SCF flow diagram**: static accessible SVG plus semantic fallback showing density, effective potential, radial solve, occupation, new density, mixing and residual checks. It illustrates control flow only.
4. **Spin-orbit splitting explorer**: selectable `l` and coupling `xi`; outputs `j=l±1/2` and analytic `L·S` eigenvalues. Acceptance: degeneracy-weighted trace of the model splitting is zero when both `j` manifolds are included.
5. **Delta-SCF energy diagram**: editable `E(N-1)`, `E(N)`, `E(N+1)` and derived ionization/electron-affinity arrows with sign checks.
6. **Atomic-sphere boundary diagram**: static SVG showing free-atom decay, zero-value and zero-slope boundary conditions; qualitative geometry only.

### Chapter 11 planned visualizations

1. All-electron versus pseudo potential and radial function with explicit `r_c`.
2. Cumulative norm curves inside and outside `r_c`.
3. Logarithmic derivative or phase-shift comparison near a reference energy.
4. Core radius, Fourier tail and illustrative cutoff/hardness tradeoff.
5. Semilocal channel-to-projector operator flow.
6. Ultrasoft density reconstruction.
7. PAW auxiliary-to-all-electron transformation.
8. Pseudopotential validation matrix separating provenance, atomic, molecular, solid, cutoff, ghost-state, relativistic and target-observable checks.

Each interactive component requires keyboard-operable controls, labels, units, default values, a no-JavaScript fallback, deterministic acceptance criteria and a boundary statement.

## 7. Numerical implementation connection

The pages will use the following evidence ladder:

```text
atomic reference equation specified
  -> radial grid and boundary conditions converged
  -> atomic SCF residual converged
  -> reference eigenvalues and norms reproduced
  -> pseudopotential generated with recorded provenance
  -> atomic transferability tests
  -> molecular or solid structural/energetic tests
  -> plane-wave cutoff convergence for the target observable
  -> force, stress, phonon, response or other property validation
```

A parser accepting a file, an SCF reaching its threshold, or a library recommending a cutoff does not satisfy the later gates. Exchange-correlation compatibility, valence/semicore choice, relativistic treatment, core correction, library/version provenance and target-observable convergence must remain explicit.

## 8. Batch plan and one-chapter-at-a-time rule

### Chapter 10 branch and Draft PR

Branch: `content/part03-ch10-atomic-structure`

- Batch A: source map, orientation, notation, complete radial separation and first radial visualizations.
- Batch B: spherical Kohn–Sham/Hartree–Fock equations, Hartree potential and atomic SCF implementation.
- Batch C: spin–orbit coupling, open shells and transition-element examples.
- Batch D: Delta-SCF, atomic sphere approximation, exercises, source boundary, validators and final browser checks.

Chapter 11 remains unchanged except for Part III index navigation text until Chapter 10 is merged, deployed and smoke-tested.

### Chapter 11 branch and Draft PR

Branch after Chapter 10 completion: `content/part03-ch11-pseudopotentials`

- Batch A: scattering, phase shifts, OPW and model potentials.
- Batch B: norm conservation, generation, unscreening and core corrections.
- Batch C: transferability, hardness, separable projectors, extended and optimized norm conservation.
- Batch D: ultrasoft, PAW, validation matrix, exercises and final checks.

## 9. Parallel-work isolation

At the planning baseline, Chapter 1 is already merged to `main`; the only open PR is the stale bootstrap Draft PR #1. No Part II activity branch or PR was found through the connected GitHub state. The merged Chapter 1 uses chapter-local components under `src/components/chapter01/`; no merged `BilingualSection.astro`, `BilingualDefinition.astro`, `BilingualCallout.astro`, or `BilingualDerivation.astro` was found.

Part III therefore uses only `src/components/part03/` and avoids changes to `src/styles/custom.css`, `astro.config.mjs`, `package.json`, `package-lock.json`, shared navigation components, and Part I/II content. Any future common bilingual-component consolidation must be a separate compatibility PR after active content branches have converged.

## 10. Validation plan

Chapter-specific deterministic checks will cover analytic radial normalization/node cases, centrifugal-potential values, spin-orbit eigenvalues and Delta-SCF arithmetic. The full merge gate remains:

```bash
npm ci --no-audit --no-fund
npm run check
```

The PR diff must be limited to Chapter 10, the Part III index, `src/components/part03/`, `src/data/part03/`, `scripts/validate-part03-*`, and this plan. CI and Pages browser smoke evidence must be recorded before the chapter is marked complete.

## 11. Known boundaries

- Martin’s detailed atomic Hartree–Fock multiplet machinery is summarized and connected to radial Slater integrals; the site will not reproduce coefficient compilations or become an atomic-spectroscopy reference.
- The Chapter 10 visualizations use hydrogenic or explicitly declared toy potentials. They cannot validate a real atomic code or a pseudopotential.
- Sholl–Steckel provides practical intuition about cutoff, frozen core, hardness, ultrasoft potentials and PAW, but does not supply the operator-level derivations required for Chapter 11.
- Official software and pseudopotential-library facts are version-sensitive and must be checked against current primary documentation when Chapter 11 is written.
