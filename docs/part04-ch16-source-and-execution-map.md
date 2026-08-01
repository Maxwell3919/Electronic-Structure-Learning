# Part IV Chapter 16 source and execution map

Status: `active-plan`

Initial baseline: `Maxwell3919/Electronic-Structure-Learning@b5f14801bf974f99a84eb558a064723879e5d275`

Scope: Martin second edition, Chapter 16, printed pp. 332–361; §§16.1–16.8. Source exercises begin on printed p. 362 and are not reproduced.

## 1. Chapter boundary

Chapter 15 solved complete self-consistent equations in Gaussian and numerical localized bases. Chapter 16 changes the representation: smooth interstitial solutions are augmented inside nonoverlapping atomic spheres by radial partial waves times spherical harmonics. The central computational object is therefore an energy-dependent boundary-matching or multiple-scattering condition rather than a fixed localized-orbital basis alone.

Owned here:

- sphere/interstitial partition and muffin-tin approximation;
- augmented plane waves and Rayleigh expansion at sphere boundaries;
- value matching, logarithmic derivatives, derivative kinks and surface terms;
- nonlinear energy-dependent APW secular equations;
- APW examples and the phase-shift interpretation of bands;
- KKR/multiple-scattering Green functions, single-site scattering matrices and structure constants;
- reciprocal-space KKR secular determinants and local Green-function observables;
- binary-alloy single-site coherent potential approximation;
- muffin-tin orbitals, envelope functions and tail cancellation;
- atomic-sphere approximation, potential functions and canonical bands;
- screened/localized MTO and KKR representations;
- total-energy, force and pressure boundaries in augmented methods.

Not completed here:

- Chapter 17 linearization, energy derivatives of radial functions, LAPW, LMTO, local orbitals, NMTO and full-potential linear methods;
- Chapter 18 linear-scaling algorithms;
- a production all-electron implementation, material parameter set or converged calculation;
- textbook source figures, source exercise wording or answers.

## 2. Source map

| Section | Martin title | Printed page | Website boundary |
|---|---|---:|---|
| 16.1 | Augmented Plane Waves (APWs) and “Muffin Tins” | 332 | sphere/interstitial partition, APW definition, value matching, slope kink, logarithmic derivative and nonlinear energy dependence |
| 16.2 | Solving APW Equations: Examples | 337 | root finding, log-derivative poles, phase-shift interpretation, d bands and spin-polarized examples at a method-survey level |
| 16.3 | The KKR or Multiple-Scattering Theory (MST) Method | 342 | Dyson equation, single-site t matrix, free propagator, structure constants, secular determinant, local Green functions and contour integration |
| 16.4 | Alloys and the Coherent Potential Approximation (CPA) | 349 | single-site effective medium, zero average excess scattering, complex spectral broadening and omitted short-range order |
| 16.5 | Muffin-Tin Orbitals (MTOs) | 350 | augmented spherical-wave envelopes, head/tail structure and tail cancellation |
| 16.6 | Canonical Bands | 352 | atomic-sphere approximation, potential functions, structure constants, unhybridized canonical bands and DOS |
| 16.7 | Localized “Tight-Binding,” MTO, and KKR Formulations | 358 | screening transformations, short-ranged structure constants and localized Green functions |
| 16.8 | Total Energy, Force, and Pressure in Augmented Methods | 360 | DFT total energy, core/nuclear cancellation, sphere-boundary terms, force/stress/pressure and finite-difference requirements |

Direct supporting source boundaries:

- Chapter 10: radial Schrödinger equations and angular-momentum channels;
- Chapter 11 and Appendix J: scattering phase shifts, logarithmic derivatives and pseudopotential analogies;
- Chapters 12–13: plane-wave/interstitial representation and self-consistent total energy;
- Chapters 14–15: localized basis matrices, Green functions, forces and Pulay terms;
- Appendices F–H: electrostatic partitions, stress derivatives and local densities;
- Chapter 17: later linearization boundary.

## 3. Mathematical objects and conventions

- atomic sphere centred at `τ_s` with radius `S_s`;
- interstitial wavevector `K=k+G`;
- spherical harmonics `Y_L`, with `L=(l,m)`;
- regular radial solution `u_{ls}(r,E)`;
- radial logarithmic derivative `D_{ls}(E)=S_s u'_{ls}(S_s,E)/u_{ls}(S_s,E)`;
- spherical Bessel and Neumann functions `j_l`, `n_l`;
- single-site scattering matrix or phase shift `t_l(E)`, `δ_l(E)`;
- free/reference propagator `G^0(E)` and scattering-path operator `τ(E)`;
- KKR structure constants `B_{LL'}(E,k)`;
- MTO potential function `P_l(E)` and structure matrix `S_{LL'}(k)`;
- coherent medium `t_c(E)` or coherent potential and component excess scattering;
- declared Hartree/Rydberg unit convention wherever factors of two matter.

The website will not silently identify coefficient-space Green functions, physical real-space Green functions, scattering-path operators, structure constants and density-of-states projectors with one another.

## 4. Derivation targets

1. Rayleigh expansion of an interstitial plane wave about an atomic centre.
2. APW boundary-value matching coefficients and the distinction between value continuity and derivative continuity.
3. Surface contribution generated by a derivative kink under the kinetic-energy operator.
4. Logarithmic derivative and its poles at radial boundary nodes.
5. Energy-dependent APW secular root and why it is nonlinear.
6. Dyson series, single-site t matrices and the KKR determinant `det[t^{-1}-G^0]=0`.
7. Partial-wave truncation and matrix dimension per atom.
8. Local DOS and occupied charge from Green-function spectral integration with an explicit projector convention.
9. Single-site CPA condition that the concentration-weighted excess scattering vanishes.
10. MTO head/envelope/tail decomposition and tail cancellation.
11. Separation of potential functions from geometry-only structure constants in canonical-band approximations.
12. Force/pressure derivatives with core cancellation, moving boundaries and basis-response terms.

## 5. Original visualization plan

1. **Muffin-tin partition explorer** — original two-dimensional periodic-cell schematic; sphere radius, overlap warning and interstitial-area fraction. It teaches geometry only, not a three-dimensional material potential.
2. **APW matching explorer** — original radial surrogate in which inside and outside pieces match in value at `S` while their logarithmic derivatives can differ; reports the kink and a nonlinear root condition.
3. **Phase-shift/KKR explorer** — original single-channel square-well scattering surrogate; phase shift, unitary single-site amplitude and a one-site structure-constant root.
4. **CPA effective-medium explorer** — original scalar binary-alloy single-site model; coherent medium, component excess scattering, residual and spectral broadening, including pure-component limits.
5. **MTO screening/locality explorer** — original head-plus-envelope radial surrogate; value matching, tail cancellation measure and screened versus unscreened range.

Every visualization must retain a static SVG or table, keyboard-operable controls, a no-JavaScript fallback, declared units/normalization, deterministic regression tests and an explicit production-code claim ceiling.

## 6. Execution batches

- Batch A: route, chapter body, contents, source map, orientation and §§16.1–16.2.
- Batch B: §§16.3–16.4, KKR/Green-function/CPA derivations and two teaching models.
- Batch C: §§16.5–16.7, MTO/ASA/canonical-band/screening derivations and locality model.
- Batch D: §16.8, method comparison, convergence ladder, misconceptions and original exercises.
- Batch E: deterministic validator, live browser smoke, current-main semantic integration, additive shared registration, review promotion, squash merge, exact-SHA Pages acceptance and Research-Ops handoff.

## 7. Parallel isolation

Substantive files remain under:

```text
src/components/part04/ch16/
src/data/part04/ch16TeachingModels.mjs
scripts/validate-part04-ch16.mjs
scripts/smoke-part04-ch16.py
src/content/docs/part-04-determination-of-electronic-structure/chapter-16-augmented-functions-apw-kkr-mto.mdx
```

The Part IV index may receive only a Chapter-16 status sentence. Shared `package.json`, CI and Pages files are modified only at final synchronization and rebuilt additively from the then-current `main`. Dependencies, lockfile, global CSS and Astro configuration are not expected to change.

Talos worktree, filesystem and operational-mirror alignment are `【未知/待验证】`; this web session has no host-live access.
