# Part III content plan: atoms and pseudopotentials

Status: active plan for Chapter 10 and Chapter 11

Planning baseline: `7e0a73d74322828f0626b7174aaa61f1677dbf98`

Primary source: Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., Part III, printed pages 215–258.

Practical cross-reference: David S. Sholl and Janice A. Steckel, *Density Functional Theory: A Practical Introduction*, section 3.2 and 3.2.1, printed pages 61–64.

This plan records source locators, chapter boundaries, derivation targets, visualization contracts, implementation links and parallel-work constraints. It does not reproduce textbook prose, figures, exercises or answers.

## 1. Part-level dependency chain

```text
central-field one-electron equation
  -> radial separation and boundary conditions
  -> self-consistent spherical atom
  -> relativistic and open-shell refinements
  -> atomic total-energy differences and atomic-sphere estimates
  -> scattering equivalence and orthogonalized plane waves
  -> norm-conserving pseudopotentials
  -> separable projectors, ultrasoft potentials and PAW
  -> validation in atoms, molecules and solids
```

Chapter 10 supplies the all-electron radial reference problem. Chapter 11 begins with scattering and frozen-core reduction and constructs effective ionic operators for molecular and solid-state calculations. Chapter 10 may state that atomic solutions become pseudopotential or augmentation references, but the construction conditions, unscreening, transferability, projectors, ultrasoft formalism and PAW transformation belong to Chapter 11.

## 2. Source map and chapter boundaries

### Chapter 10 · Electronic Structure of Atoms

Martin printed pages 215–227; exercises begin on page 228.

| Section | Page | Website scope |
|---|---:|---|
| 10.1 One-Electron Radial Schrödinger Equation | 215 | Spherical separation, spherical harmonics, radial and reduced radial functions, boundary conditions, normalization, hydrogenic limits and logarithmic grids. |
| 10.2 Independent-Particle Equations: Spherical Potentials | 217 | Spherical Kohn–Sham and Hartree–Fock equations, density, Hartree potential, occupations and SCF. |
| 10.3 Spin–Orbit Interaction | 219 | Relativistic origin, scalar-relativistic terms, explicit spin–orbit coupling and angular splitting. |
| 10.4 Open-Shell Atoms: Nonspherical Potentials | 219 | Restricted, spin-unrestricted and unrestricted treatments; multiplets, angular expansions and radial Slater integrals. |
| 10.5 Example of Atomic States: Transition Elements | 221 | Radial localization, semicore/valence distinction, 3d–4s competition and functional dependence. |
| 10.6 Delta-SCF | 224 | Ionization, electron affinity, excitation, transition-state approximation and effective interaction energies. |
| 10.7 Atomic Sphere Approximation in Solids | 225 | Atomic-sphere boundary conditions, Wronskian relation, band-width estimates and model boundaries. |

Relevant appendices: Appendix K for spherical harmonics and angular coefficients, Appendix L for radial numerical methods, Appendix O for relativistic reductions and Appendix R for code references. Appendix J becomes central in Chapter 11.

### Chapter 11 · Pseudopotentials

Martin printed pages 230–255; exercises begin on page 256.

| Section | Page | Website scope |
|---|---:|---|
| 11.1 Scattering Amplitudes and Pseudopotentials | 230 | Partial waves, logarithmic derivatives, phase shifts and low-energy equivalence. |
| 11.2 Orthogonalized Plane Waves and Pseudopotentials | 233 | Core orthogonality, OPWs and the induced repulsive nonlocal operator. |
| 11.3 Model Ion Potentials | 237 | Analytic local models and their empirical boundaries. |
| 11.4 Norm-Conserving Pseudopotentials | 238 | Reference eigenvalue, exterior matching, logarithmic derivative and norm conservation. |
| 11.5 Generation of l-Dependent NCPPs | 241 | Radial inversion, semilocal channels, local component and reference configurations. |
| 11.6 Unscreening and Core Corrections | 245 | Screened atomic potential, ionic pseudopotential, frozen core and nonlinear core correction. |
| 11.7 Transferability and Hardness | 246 | Configuration, scattering and excitation tests; cutoff-radius and basis-cost tradeoffs. |
| 11.8 Separable Operators and Projectors | 247 | Semilocal-to-projector transformation, local-channel choice and ghost-state risk. |
| 11.9 Extended Norm Conservation | 248 | Multiple projectors and energy dependence beyond the linear regime. |
| 11.10 Optimized Norm-Conserving Potentials | 249 | Reciprocal-space optimization and residual kinetic energy. |
| 11.11 Ultrasoft Pseudopotentials | 250 | Relaxed norm conservation, overlap operator, augmentation charge and density reconstruction. |
| 11.12 Projector Augmented Waves | 252 | Smooth auxiliary state, all-electron reconstruction, partial waves, projectors and one-centre corrections. |
| 11.13 Additional Topics | 255 | Remaining source-specific topics and method boundaries. |

Sholl–Steckel pages 61–64 support only the practical connection among short real-space length scales, plane-wave cutoff, frozen core, transferability, hardness, ultrasoft potentials, PAW and consistent cutoffs in energy differences. They do not replace Martin’s operator-level derivations.

## 3. Cross-part dependencies

Chapter 10 depends on Part I for angular momentum and the independent-particle picture, and on Part II for Kohn–Sham equations, Hartree and exchange-correlation potentials, self-consistency and the eigenvalue/total-energy distinction.

Chapter 11 depends on Chapter 10 definitions of $R_{nl}(r)$, $u_{nl}(r)$, radial normalization, logarithmic derivative, atomic reference state, effective potential and total-energy differences. It prepares Part IV plane-wave and augmentation methods.

Cross-references must remain compatible with the GitHub Pages base path and cannot depend on code present only in another open PR.

## 4. Stable Part III terminology

| English | Chinese | Rule |
|---|---|---|
| radial wavefunction | 径向波函数 | $R_{nl}(r)$; Martin’s radial $\psi_{nl}$ mapping is stated. |
| reduced radial function | 约化径向函数 | $u_{nl}(r)=rR_{nl}(r)$; Martin’s $\phi_{nl}$ mapping is stated. |
| spherical harmonic | 球谐函数 | $Y_{lm}(\theta,\phi)$ normalized over solid angle. |
| centrifugal potential | 离心势 | $l(l+1)/(2r^2)$ in Hartree atomic units. |
| radial node | 径向节点 | Zero of $R$ or $u$ for $r>0$; origin behaviour is separate. |
| spherical average | 球平均 | Angular averaging and occupation averaging are distinguished. |
| open shell | 开壳层 | Incomplete spin or magnetic-sublevel occupation. |
| scalar relativistic | 标量相对论 | Relativistic scalar terms without explicit $j$ splitting. |
| phase shift | 相移 | $\delta_l(E)$; Martin’s $\eta_l$ convention is mapped. |
| logarithmic derivative | 对数导数 | $D_l(E,r)=rR_l'(E,r)/R_l(E,r)$. |
| screened potential | 屏蔽后的原子有效势 | Self-consistent reference-atom effective potential. |
| ionic pseudopotential | 离子赝势 | Potential after valence Hartree and exchange-correlation unscreening. |
| pseudo-wavefunction | 赝波函数 | Smooth function matching the all-electron solution outside $r_c$. |
| norm conservation | 范数守恒 | Equal interior radial norm at the reference energy. |
| transferability | 可迁移性 | Accuracy outside the generating configuration under declared tests. |
| hardness | 硬度 | Reciprocal-space content or converged cutoff cost, not a quality score. |
| semilocal operator | 半局域算符 | Angular projectors with channel-dependent radial potentials. |
| separable nonlocal operator | 可分离非局域算符 | Finite projector sum. |
| augmentation charge | 增广电荷 | Density correction in ultrasoft/PAW formalisms. |
| auxiliary wavefunction | 辅助平滑波函数 | PAW smooth state, distinct from the all-electron state. |

## 5. Derivation inventory

### Chapter 10

1. Spherical-coordinate Laplacian and its angular-momentum form.
2. Separation $\psi=R_{nl}Y_{lm}$ and derivation of both the $R$ and $u=rR$ equations.
3. Origin and asymptotic boundary conditions by leading-power analysis.
4. Reduction of three-dimensional normalization to $\int|u|^2dr=1$.
5. Logarithmic radial coordinate and derivative transformation.
6. Closed-shell density, occupancy factors and electron-number normalization.
7. Spherical Kohn–Sham equation and distinction from the nonlocal Hartree–Fock exchange operator.
8. Spherical Hartree potential from Poisson or shell decomposition.
9. Atomic SCF map, mixing, occupation stability and separate convergence gates.
10. $\mathbf L\cdot\mathbf S=[\mathbf J^2-\mathbf L^2-\mathbf S^2]/2$ and $j=l\pm1/2$ eigenvalues.
11. Coulomb multipole expansion and radial Slater integrals for open shells.
12. Ionization, affinity, excitation and interaction energies from total-energy differences; transition-state midpoint approximation with assumptions.
13. Radial Wronskian identity and the atomic-sphere band-width relation.

### Chapter 11

1. Partial-wave asymptotics, scattering amplitude and phase shifts.
2. Equality of logarithmic derivatives and phase-shift equivalence at a matching radius.
3. OPW construction and the effective repulsive nonlocal term generated by core orthogonality.
4. Mathematical connection among the norm-conserving conditions and first-order energy response.
5. Radial inversion for channel potentials and screened-to-ionic unscreening.
6. Semilocal operator and finite separable projector representation, including ghost-state conditions.
7. Reciprocal-space residual kinetic energy for optimized norm-conserving potentials.
8. Ultrasoft generalized eigenproblem and augmentation density.
9. PAW linear transformation and one-centre expectation-value corrections.

Every derivation states the unit convention, coordinates, measure, boundary conditions, exact relation or approximation, numerical discretization and conclusions not supported by the formula.

## 6. Original visualization inventory

### Chapter 10

1. Radial effective-potential explorer for Coulomb, centrifugal and total terms.
2. Hydrogenic $R_{nl}$, $u_{nl}$ and radial-probability explorer with normalization and node checks.
3. Accessible atomic SCF flow diagram.
4. $\mathbf L\cdot\mathbf S$ splitting explorer with degeneracy-weighted trace check.
5. Delta-SCF energy diagram with translation-invariance check.
6. Atomic-sphere boundary-condition diagram.

### Chapter 11

1. All-electron versus pseudo potential and radial function at a declared $r_c$.
2. Cumulative norm curves.
3. Logarithmic derivative or phase-shift comparison near a reference energy.
4. Core-radius/Fourier-tail/hardness explorer.
5. Semilocal-to-projector operator diagram.
6. Ultrasoft density reconstruction.
7. PAW auxiliary-to-all-electron transformation.
8. Pseudopotential validation matrix.

Each interactive component requires labelled keyboard-operable controls, units, defaults, deterministic acceptance criteria, no-JavaScript fallback and a boundary distinguishing the model from a real atomic or solid-state calculation.

## 7. Numerical implementation connection

```text
atomic equation and reference state specified
  -> radial grid and boundary conditions converged
  -> atomic SCF residual converged
  -> eigenvalues, norms and target atomic quantities reproduced
  -> pseudopotential generated with versioned provenance
  -> atomic transferability and ghost-state tests
  -> molecular or solid tests
  -> basis cutoff converged for the target observable
  -> forces, stress, phonons or response validated as required
```

File readability, a successful SCF, or a library-recommended cutoff does not satisfy the later gates. Exchange-correlation compatibility, valence/semicore selection, relativistic treatment, core correction, generator and library version, and target-observable convergence remain explicit.

## 8. One-chapter-at-a-time execution

### Chapter 10

Branch: `content/part03-ch10-atomic-structure`

- Batch A: source map, orientation, notation, radial separation and radial visualizations.
- Batch B: spherical independent-particle equations, Hartree potential and SCF.
- Batch C: relativistic treatment, spin–orbit coupling, open shells and transition elements.
- Batch D: Delta-SCF, ASA, exercises, deterministic checks, CI and live Pages smoke.

Chapter 11 remains an outline until Chapter 10 is merged, deployed and browser-tested.

### Chapter 11

Future branch: `content/part03-ch11-pseudopotentials`

- Batch A: scattering, phase shifts, OPW and model potentials.
- Batch B: norm conservation, generation, unscreening and core correction.
- Batch C: transferability, hardness, projectors, extended and optimized norm conservation.
- Batch D: ultrasoft, PAW, validation matrix, exercises, CI and live Pages smoke.

## 9. Parallel-work isolation

At the recorded baseline, Part I Chapter 1 was merged. The only open PR found before the Part III branch was stale bootstrap Draft PR #1; no Part II activity branch or PR was returned by the connected GitHub state.

The merged repository already provides `src/components/BilingualSection.astro`, `src/components/BilingualCallout.astro`, `DerivationBlock.astro`, `SourceNote.astro` and bilingual responsive CSS in `src/styles/custom.css`. Chapter 10 reuses these stable interfaces. All new components live under `src/components/part03/ch10/`; no Part I/II content, shared CSS, Astro configuration, dependency version or lockfile is changed. The only shared-file edit is a minimal `package.json` validation-script entry.

A later incompatible shared-interface change requires semantic rebase and adaptation. Part III will not duplicate a competing global component or refactor another Part inside a chapter content PR.

## 10. Validation plan

Chapter 10 deterministic checks cover hydrogenic normalization and node counts, centrifugal-potential identities, spin–orbit degeneracy-weighted trace, Delta-SCF arithmetic and energy-zero translation invariance, and absence of generated outline markers or TODOs.

The merge gate is:

```bash
npm ci --no-audit --no-fund
npm run check
```

The final diff is restricted to Chapter 10, the Part III index, `src/components/part03/ch10/`, `scripts/validate-part03-ch10.mjs`, this plan and the minimal package-script update. CI, Pages deployment and live browser-smoke evidence are required before completion.

## 11. Known boundaries

- Chapter 10 does not reproduce atomic-spectroscopy coefficient tables or textbook figures.
- Hydrogenic and SOC visualizations are analytic teaching models and do not validate an atomic code.
- Spherical averaging removes orbital polarization and parts of multiplet structure.
- Atomic promotion and interaction energies provide mechanism-level guidance, not direct solid-state parameters.
- The atomic-sphere model does not replace a periodic electronic-structure calculation.
- Chapter 11 software and pseudopotential-library facts are version-sensitive and require current primary documentation.
