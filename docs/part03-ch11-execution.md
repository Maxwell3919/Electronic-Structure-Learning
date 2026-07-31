# Part III Chapter 11 execution plan · Pseudopotentials

Status: content-complete; validation and deployment in progress

Initial website baseline: `77a2a095e9604be563cc7b04e7b5ff53fd32ea43`

Latest synchronized `main` baseline before current validation: `b727dd47cdc33285da61d5d4cdb2e3655536e274`

Primary source: Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., Chapter 11, printed pages 230–255; source exercises begin on page 256.

Practical cross-reference: David S. Sholl and Janice A. Steckel, *Density Functional Theory: A Practical Introduction*, §§3.2–3.2.1, printed pages 61–64.

Supplementary validation source: M. J. van Setten et al., “The PseudoDojo: Training and grading a 85 element optimized norm-conserving pseudopotential table,” used only for modern validation and provenance boundaries.

This file records execution scope and acceptance criteria. It does not reproduce source prose, figures, captions, exercises, or answers.

## 1. Chapter question and boundary

Chapter 11 asks how the oscillatory all-electron atomic problem can be replaced, for a declared valence space and energy range, by a smoother effective ionic operator that preserves selected scattering and response properties. The logical sequence is:

```text
all-electron radial reference
  -> partial-wave scattering and logarithmic derivative
  -> core-state orthogonality and OPW smooth functions
  -> norm-conserving channel construction
  -> screened-to-ionic unscreening and core corrections
  -> transferability and hardness tests
  -> semilocal-to-separable projector form
  -> extended/optimized norm conservation
  -> ultrasoft generalized overlap
  -> PAW all-electron reconstruction
```

Chapter 10 remains the authority for the atomic radial equation, occupations, scalar-relativistic/SOC distinctions and atomic total-energy differences. Chapter 11 does not re-derive the complete atomic SCF problem. Part IV owns production plane-wave algorithms and convergence practice after the effective operator is available.

## 2. Source map

| Section | Printed page | Chapter 11 ownership |
|---|---:|---|
| 11.1 Scattering Amplitudes and Pseudopotentials | 230 | Partial waves, asymptotic form, phase shift, scattering amplitude, logarithmic derivative and matching-radius equivalence. |
| 11.2 Orthogonalized Plane Waves and Pseudopotentials | 233 | OPW construction, smooth component, core orthogonality and induced energy-dependent nonlocal repulsion. |
| 11.3 Model Ion Potentials | 237 | Local analytic models, empirical fitting and the energy-reference limitation of early constructions. |
| 11.4 Norm-Conserving Pseudopotentials | 238 | Reference eigenvalue, exterior matching, logarithmic derivative and interior norm; first-order energy response. |
| 11.5 Generation of l-Dependent NCPPs | 241 | Reference configuration, smooth pseudo radial function, radial inversion and semilocal channel operator. |
| 11.6 Unscreening and Core Corrections | 245 | Screened atomic effective potential, ionic potential, frozen core, core-valence overlap and nonlinear core correction. |
| 11.7 Transferability and Hardness | 246 | Configuration, excitation, scattering/log-derivative and solid-state tests; core-radius/Fourier-cost tradeoff. |
| 11.8 Separable Operators and Projectors | 247 | Local channel, nonlocal correction, separable projector representation, denominator and ghost-state risk. |
| 11.9 Extended Norm Conservation | 248 | Multiple projectors and response over more than one reference energy. |
| 11.10 Optimized Norm-Conserving Potentials | 249 | Residual kinetic energy/Fourier-tail optimization under matching constraints. |
| 11.11 Ultrasoft Pseudopotentials | 250 | Relaxed norm conservation, generalized overlap, augmentation charges, density reconstruction and added force/stress terms. |
| 11.12 Projector Augmented Waves | 252 | Linear transformation from auxiliary smooth states to all-electron states, partial waves, projectors and one-centre corrections. |
| 11.13 Additional Topics | 255 | Many-body/core-polarization and remaining method boundaries at the level supported by Martin. |

## 3. Derivation targets

1. Derive the partial-wave asymptotic form and the scattering amplitude
   `f(theta)=k^{-1} sum_l (2l+1) exp(i delta_l) sin(delta_l) P_l(cos theta)`.
2. Show that equal logarithmic derivative at a matching radius and energy fixes the same exterior solution and phase shift.
3. Construct an OPW by projecting a plane wave out of the occupied core subspace and identify the resulting nonlocal, energy-dependent repulsive term.
4. State the norm-conserving conditions and derive the Wronskian identity connecting the energy derivative of the logarithmic derivative to the interior norm.
5. Invert the radial equation to obtain a channel-dependent screened potential, then separate the ionic pseudopotential from valence Hartree and exchange-correlation screening.
6. Write the semilocal angular-momentum operator, select a local component and derive a finite separable projector representation with its denominator/ghost-state boundary.
7. Formulate optimized norm conservation in reciprocal space without presenting any one generator as universally optimal.
8. Derive the ultrasoft generalized eigenproblem and augmentation-density structure.
9. Derive the PAW transformation and expectation-value one-centre correction.

Every derivation identifies atomic units, radial measure, reference state, matching radius, exact relation, construction choice, numerical representation and the stronger conclusions that do not follow.

## 4. Original visualizations

1. `PseudoWaveMatchingExplorer`: analytic all-electron-like and pseudo radial functions; adjustable core radius; exterior matching and cumulative norm readouts.
2. `LogDerivativeExplorer`: declared square-well teaching model; energy-dependent logarithmic derivatives and reference-energy matching.
3. `HardnessExplorer`: smooth-core length scale versus normalized Fourier-tail proxy; qualitative cutoff-cost relation only.
4. `ProjectorFlowDiagram`: semilocal channels, local component, projectors and nonlocal action, with semantic fallback.
5. `AugmentationComparisonDiagram`: smooth auxiliary density, augmentation contribution, reconstructed density and PAW transformation boundary.

Interactive controls must be keyboard operable and retain analytic/static fallbacks without JavaScript. Deterministic checks validate only the declared teaching models.

## 5. Execution batches

- [x] Batch A: source map, reading orientation, notation, §§11.1–11.3, scattering/OPW derivations and first two visualizations.
- [x] Batch B: §§11.4–11.7, norm-response derivation, generation, unscreening, nonlinear core correction, transferability and hardness.
- [x] Batch C: §§11.8–11.10, separable projectors, ghost states, multiple-projector and reciprocal-space optimization boundaries.
- [x] Batch D: §§11.11–11.13, ultrasoft and PAW derivations, validation matrix, original exercises, deterministic validator and exact-SHA Pages smoke implementation.

Only Chapter 11 is active in Part III. Chapter 10 body is read-only except for a separately justified regression fix.

## 6. Parallel-work isolation

During Chapter 11 work, accepted changes from Part II Chapter 8, Part VII Appendix A and Part I Chapter 3 entered `main`. They were brought into the Chapter 11 branch through explicit non-force synchronization PRs. Chapter 11 substantive code remains under:

```text
src/components/part03/ch11/
src/data/part03/
scripts/validate-part03-ch11.mjs
scripts/smoke-part03-ch11.py
src/content/docs/part-03-important-preliminaries-on-atoms/
```

Shared `package.json` and GitHub workflows contain additive Chapter 11 registrations while preserving every synchronized validator and browser smoke. No dependency, lockfile, Astro configuration or shared CSS change is included.

## 7. Scientific acceptance boundaries

- Exterior matching at one reference energy does not establish transferability over all energies, occupations or chemical environments.
- Norm conservation improves first-order scattering response near the reference state; it does not remove frozen-core error.
- A smaller recommended cutoff is not a quality ranking.
- Atomic tests, crystalline equation-of-state tests, force/phonon tests and target-observable convergence answer different questions.
- A readable pseudopotential file or converged SCF does not validate provenance, XC compatibility, relativistic treatment, ghost-state absence or the requested observable.
- Norm-conserving, ultrasoft and PAW results are not assumed numerically equivalent before independent convergence and cross-method comparison.
- PAW reconstructs an all-electron state within its frozen-core/partial-wave data set; this is not an unrestricted exact many-electron wavefunction.

## 8. Merge gate

```bash
npm ci --no-audit --no-fund
npm run check
```

The final Chapter 11 PR additionally requires a dedicated exact-SHA Pages test of the Part III index and Chapter 11 route, desktop/narrow bilingual layout, KaTeX, source map, keyboard interactions, no-JavaScript fallbacks and GitHub Pages base path.

## 9. Current validation state

- All Chapter 11 source sections 11.1–11.13 have corresponding bilingual content.
- Five original visualizations and their declared acceptance boundaries are present.
- The Chapter 11 deterministic validator and Pages smoke script are registered in the shared validation chain.
- The first integrated CI run reached the Chapter 11 model and exposed a JavaScript exponent-precedence error after all previously merged validators passed.
- The data-model and browser-side expressions were parenthesized through isolated fixes; the next full CI result remains the active completion gate.
- Talos worktree, filesystem and mirror alignment were not checked through a host-live tool and remain unknown.