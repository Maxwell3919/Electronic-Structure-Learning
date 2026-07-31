# Part IV Chapter 15 source and execution map

Status: `active-plan`

Initial baseline: `Maxwell3919/Electronic-Structure-Learning@97b1a6fc0ce6ffb78c74324b2549be1f4870710b`

Scope: Martin second edition, Chapter 15, printed pp. 320–330; §§15.1–15.8. Source exercises begin on printed p. 331 and are not reproduced.

## 1. Chapter boundary

Chapter 14 established model Hamiltonians, hopping/overlap structure, Slater–Koster parameterization and transferability. Chapter 15 turns the same finite nonorthogonal representation into a full Kohn–Sham/Hartree–Fock calculation in which matrix elements, density, potential, total energy and derivatives are recomputed self-consistently.

Owned here:

- generalized Kohn–Sham eigenproblem in a localized basis;
- density matrix and real-space density;
- multiple-ζ, polarization and diffuse/compressed radial functions;
- Gaussian product theorem and analytic-integral hierarchy;
- ground-state and excitation methods based on Gaussian orbitals, at Martin's survey level;
- numerical atomic orbitals, confinement and tabulated two-centre integrals;
- grid evaluation of local-potential matrix elements;
- total energy, force, stress and Pulay/basis-response terms;
- applications and convergence/transferability boundaries;
- Green functions, recursion and continued fractions;
- mixed localized/plane-wave or localized/grid bases.

Not completed here:

- Chapter 14 empirical/model tight binding;
- Chapter 16–17 augmented-wave/multiple-scattering/linearized methods;
- Chapter 18 full linear-scaling theory;
- production quantum-chemistry excitation algorithms beyond the source's survey boundary;
- material-specific basis recommendations or universal parameters.

## 2. Source map

| Section | Martin title | Printed page | Website boundary |
|---|---|---:|---|
| 15.1 | Solution of Kohn–Sham Equations in Localized Bases | 320 | generalized eigenproblem, basis naming, ζ/polarization, self-consistency data flow |
| 15.2 | Analytic Basis Functions: Gaussians | 322 | primitive/contracted Gaussians, product theorem, analytic integrals, cusp/tail cost |
| 15.3 | Gaussian Methods: Ground-State and Excitation Energies | 324 | chemistry method hierarchy and claim boundaries |
| 15.4 | Numerical Orbitals | 324 | confined radial functions, multiple-ζ, interpolation, grid/local-potential integrals |
| 15.5 | Localized Orbitals: Total Energy, Force, and Stress | 327 | density matrix, density, energy organization, force/stress/Pulay terms |
| 15.6 | Applications of Numerical Local Orbitals | 329 | capability examples and convergence evidence rather than software promotion |
| 15.7 | Green’s Function and Recursion Methods | 329 | resolvent, local DOS, Lanczos recursion, continued fraction, termination |
| 15.8 | Mixed Basis | 330 | complementary basis partitions and double-counting/conditioning boundaries |

Direct supporting source boundaries:

- Chapter 7: Kohn–Sham energy, density and self-consistency;
- Chapter 11: separable pseudopotentials and PAW projectors;
- Chapter 14: localized Bloch basis and generalized eigenproblem;
- Appendix F: neutral-atom Coulomb decomposition;
- Appendix G: strain and stress derivatives;
- Appendix N: two-centre matrix elements;
- Chapter 18: later density-matrix locality and O(N) methods.

Sholl–Steckel is used only for the general practical distinction between numerical convergence and physical accuracy; it does not supply a direct localized-basis chapter matching Martin Chapter 15.

## 3. Mathematical objects and notation

- basis functions: `χ_μ(r-R_I)`;
- overlap: `S_{μν}=<χ_μ|χ_ν>`;
- Hamiltonian: `H_{μν}=<χ_μ|H_KS|χ_ν>`;
- generalized eigenvectors: `H C = S C ε`;
- occupations: `f_i`;
- density matrix: `P_{μν}=Σ_i f_i C_{μi} C^*_{νi}`;
- density: `n(r)=Σ_{μν}P_{μν}χ_μ(r)χ^*_ν(r)`;
- energy-weighted density matrix: `W_{μν}=Σ_i f_i ε_i C_{μi} C^*_{νi}`;
- Green function in a nonorthogonal basis: `G(z)=(zS-H)^{-1}`;
- local DOS: `D_μ(E)=-(1/π) Im [GS]_{μμ}` under the declared coefficient-space convention;
- basis derivative and overlap derivative terms in forces/stress.

Every formula will state the basis metric and coefficient convention. `P`, `S`, `H`, `G`, and the continuous density are not interchangeable objects.

## 4. Derivation targets

1. Rayleigh–Ritz variation in a nonorthogonal basis and `HC=SCε`.
2. Orthonormality `C†SC=I`, electron count `Tr(PS)=N`, and density reconstruction.
3. Gaussian product theorem and centre/exponent/weight relations.
4. Primitive versus contracted Gaussian normalization and polynomial/angular prefactors.
5. Finite-support numerical-orbital sparsity and basis-confinement error.
6. Density-matrix eigenvalue sum `E_s=Tr(PH)`.
7. Force derivative in a moving nonorthogonal basis, separating explicit Hamiltonian and overlap/energy-weighted-density terms.
8. Green-function spectral representation in a nonorthogonal basis.
9. Lanczos three-term recursion and continued-fraction local Green function.
10. Mixed-basis block generalized eigenproblem and conditioning/double-counting boundary.

## 5. Original visualization plan

1. **Gaussian product explorer** — two primitive s Gaussians; product centre, exponent and overlap prefactor; analytic coincident-centre and separation limits.
2. **Basis confinement/completeness explorer** — confined radial-like functions; support radius versus overlap sparsity and tail error; explicitly a teaching model.
3. **Pulay-force explorer** — two moving nonorthogonal basis functions; explicit `∂H` and overlap `∂S` contributions; finite-difference regression.
4. **Density-matrix explorer** — coefficients/occupations to `P`, `Tr(PS)` and real-space density in a two-function model.
5. **Recursion/continued-fraction explorer** — finite chain local DOS, Lanczos coefficients and broadening/termination boundary.

All models must retain static SVG or tabular output, keyboard controls, no-JavaScript fallback, deterministic tests, units/normalization and claim ceilings.

## 6. Execution batches

- Batch A: route, body wrapper, contents, source map, orientation and §15.1.
- Batch B: §§15.2–15.4, Gaussian/numerical-orbital derivations and first two models.
- Batch C: §§15.5–15.6, density matrix, total energy, forces/stress and Pulay model.
- Batch D: §§15.7–15.8, Green function/recursion, mixed basis, final models.
- Batch E: method comparison, misconceptions, original exercises, deterministic validator, exact-SHA Pages smoke, current-main semantic integration, merge and Research-Ops handoff.

## 7. Parallel isolation

Substantive files remain under:

```text
src/components/part04/ch15/
src/data/part04/ch15TeachingModels.mjs
scripts/validate-part04-ch15.mjs
scripts/smoke-part04-ch15.py
src/content/docs/part-04-determination-of-electronic-structure/chapter-15-localized-orbitals-full-calculations.mdx
```

Shared `package.json`, CI and Pages are modified only at final synchronization, additively from the then-current `main`. Dependencies, lockfile, global CSS and Astro configuration are not expected to change.

Talos worktree and mirror alignment are `【未知/待验证】`; this web session has no host-live access.
