# Part IV Chapter 17 source and execution map

Status: `active-plan`

Initial baseline: `Maxwell3919/Electronic-Structure-Learning@4a0f2bba63c8808237070f40014b0377c8fb1d1a`

Scope: Martin second edition, Chapter 17, printed pp. 365–384; §§17.1–17.10. Source exercises begin on printed p. 385 and are not reproduced.

## 1. Chapter boundary

Chapter 16 developed nonlinear energy-dependent APW, KKR and MTO formulations. Chapter 17 converts augmented functions into fixed linearized bases or reduced Hamiltonians by expanding radial solutions about one or more reference energies.

Owned here:

- the distinction between the fundamental linear Schrödinger equation and nonlinear numerical secular equations caused by energy-dependent bases;
- radial partial waves `u_l(E_l,r)` and energy derivatives `dot u_l(E_l,r)`;
- fixed-sphere normalization, orthogonality and the inhomogeneous energy-derivative equation;
- first-order wavefunction linearization, second-order eigenvalue accuracy and variational-order boundaries;
- energy-independent generalized eigenproblems obtained from linearized augmented functions;
- LAPW value-and-slope matching and its angular/interstitial cutoffs;
- LAPW applications and convergence/evidence boundaries;
- LMTO heads, tails, screening, ASA and minimal-basis interpretation;
- tight-binding LMTO formulation and its distinction from empirical tight binding;
- LMTO application categories without reproducing source figures or material-specific claims;
- NMTO interpolation at multiple energies, downfolding and target-band representations;
- full-potential matrix elements inside spheres and in the interstitial;
- linearization, basis, semicore, angular and target-observable convergence as separate gates.

Not completed here:

- Chapter 16 nonlinear APW/KKR/MTO derivations except as prerequisites;
- Chapter 18 locality and O(N) algorithms;
- source material figures, captions, tables, numerical values, exercise wording or answers;
- production-code recommendations or universal parameter choices;
- a material-specific all-electron benchmark or convergence claim.

## 2. Source map

| Section | Martin title | Printed page | Website boundary |
|---|---|---:|---|
| 17.1 | Linearization of Equations and Linear Methods | 365 | numerical nonlinearity, reference energies, error order and reduced Hamiltonians |
| 17.2 | Energy Derivative of the Wavefunction: ψ and ψ̇ | 366 | radial equation, energy derivative, fixed normalization, orthogonality and inhomogeneous equation |
| 17.3 | General Form of Linearized Equations | 368 | basis construction, overlap/Hamiltonian matrices and energy-independent generalized eigenproblem |
| 17.4 | Linearized Augmented Plane Waves (LAPWs) | 370 | value/slope matching, coefficients, cutoffs, angular expansion and linearization error |
| 17.5 | Applications of the LAPW Method | 372 | capability categories and convergence evidence without copying source examples |
| 17.6 | Linear Muffin-Tin Orbital (LMTO) Method | 375 | heads/tails, energy-independent orbitals, ASA/minimal basis and generalized eigenproblem |
| 17.7 | Tight-Binding Formulation | 379 | screened compact representation, derived matrix elements and environment dependence |
| 17.8 | Applications of the LMTO Method | 379 | interpretation/efficiency categories and evidence boundaries |
| 17.9 | Beyond Linear Methods: NMTO | 381 | multi-energy interpolation, error products, downfolding and target-band orbitals |
| 17.10 | Full Potential in Augmented Methods | 383 | nonspherical sphere potential, interstitial matrix elements, density/Poisson multipoles and truncations |

Direct supporting boundaries:

- Chapter 10: radial atomic equations and normalization;
- Chapters 11 and 13: pseudopotential/PAW and plane-wave/full-potential comparison;
- Chapter 16: nonlinear augmented functions, KKR/MTO objects and moving-boundary derivatives;
- Appendix D: variational and `2n+1` relationships;
- Appendices F–I: electrostatics, stress, local densities and alternative force expressions;
- Chapter 18: later locality and linear-scaling boundary.

## 3. Mathematical objects and conventions

- radial partial wave: `u_l(E_l,r)` or `ψ_l(E_l,r)` under the declared radial convention;
- energy derivative: `dot u_l(E_l,r)=∂u_l(E,r)/∂E|_{E_l}`;
- first-order approximation: `u_l(E,r)≈u_l(E_l,r)+(E-E_l)dot u_l(E_l,r)`;
- fixed-sphere normalization convention for the derivative;
- inhomogeneous equation: `(H_l-E_l)dot u_l=u_l`;
- linearized basis function: `χ_i=φ_i+dot φ_i h_i` or an equivalent coefficient convention;
- overlap and Hamiltonian matrices constructed from fixed basis functions;
- LAPW interior coefficients determined by matching value and radial derivative;
- LMTO potential functions, structure matrices and screened representations;
- NMTO energy mesh `{E_0,…,E_N}` and interpolation error product;
- full-potential angular expansion inside spheres and smooth/interstitial representation outside.

Every equation will state its radial normalization, units and representation. A dot denotes an energy derivative, not a time derivative. Reference energy, eigenenergy, band centre and Fermi energy are not interchangeable.

## 4. Derivation targets

1. Differentiate the radial Schrödinger equation to obtain `(H_l-E_l)dot u_l=u_l`.
2. Derive `⟨u_l|dot u_l⟩=0` from fixed normalization.
3. Establish the first-order radial-function error and the separate variational/eigenvalue error order.
4. Convert the energy-dependent augmented expansion to an energy-independent generalized eigenproblem.
5. Solve the two LAPW boundary equations for value and slope matching coefficients.
6. Explain why `l_max` grows with sphere radius times interstitial cutoff and why wavefunction/density/potential angular cutoffs differ.
7. Construct an LMTO head plus tails and distinguish ASA, screening and basis truncation.
8. Show that screened/tight-binding LMTO is a representation change before neighbour truncation.
9. Derive the NMTO interpolation error product and its squared eigenvalue error boundary.
10. Organize full-potential matrix elements into sphere angular integrals, interstitial integrals and Poisson multipoles.

## 5. Original visualization plan

1. **Linearization-error explorer** — an analytic energy-dependent radial surrogate compared with its Taylor approximation at `E_l`; displays wavefunction error scaling and the declared variational boundary.
2. **Energy-derivative explorer** — finite-dimensional normalized state family showing `⟨u|dot u⟩=0`, the derivative direction and the distinction between energy derivative and time derivative.
3. **LAPW matching explorer** — interstitial plane-wave radial component matched in value and slope to `u_l` and `dot u_l`; reference energy and semicore separation controls.
4. **LMTO head-tail explorer** — augmented head, intersite tails and screening/range truncation with a target-error readout.
5. **NMTO interpolation explorer** — one-, two- and three-energy interpolation of a target band surrogate, with exact mesh points and error-product scaling.

Full-potential representation will also have an original static diagram/table if it is not promoted to a sixth interactive model. All visualizations retain static SVG/tabular output, keyboard controls, no-JavaScript fallback, deterministic tests, units/conventions and claim ceilings.

## 6. Execution batches

- Batch A: route, body wrapper, contents, source map, orientation and §§17.1–17.3.
- Batch B: §§17.4–17.5 and LAPW matching/cutoff model.
- Batch C: §§17.6–17.8 and LMTO head-tail/screening model.
- Batch D: §§17.9–17.10, NMTO/full-potential coverage and final model.
- Batch E: method comparison, misconceptions, original exercises, deterministic validator, exact-SHA Pages smoke, current-main semantic integration, merge and Research-Ops handoff.

## 7. Parallel isolation

Substantive files remain under:

```text
src/components/part04/ch17/
src/data/part04/ch17TeachingModels.mjs
scripts/validate-part04-ch17.mjs
scripts/smoke-part04-ch17.py
src/content/docs/part-04-determination-of-electronic-structure/chapter-17-augmented-functions-linear-methods.mdx
```

Shared `package.json`, CI and Pages files are modified only at final synchronization, additively from the then-current `main`. Dependencies, lockfile, global CSS and Astro configuration are not expected to change.

Talos worktree and mirror alignment are `【未知/待验证】`; this web session has no host-live access.
