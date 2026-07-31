# Part VII content plan

## Scope and verified baseline

This plan governs Martin Part VII, Appendices A–R, in `Maxwell3919/Electronic-Structure-Learning`.

- Website baseline used to start Appendix A: `a008357ff3f655b125c51a46224d7ca0f9851401`.
- Structural authority: `src/data/martin/part07.mjs` and `src/data/martin/index.mjs`.
- Primary source: Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., printed pp. 581–703.
- Practical cross-reference: Sholl–Steckel is used only where it adds implementation context; it does not replace Martin's appendix structure.
- Sequence is fixed: A → B → C → D → E → F → G → H → I → J → K → L → M → N → O → P → Q → R.
- Only one Appendix may be in substantive drafting at a time. Each Appendix uses a dedicated branch and PR and must be merged, deployed, and checked before the next Appendix begins.

The connected web session can read and write GitHub but has no host-live Talos or scheduler/filesystem access. Talos worktree alignment and local validation remain `【未知/待验证】` unless later supplied by an actual host-side observation. GitHub Actions and Pages records are treated as separate evidence.

## Part VII role

Part VII is a reference layer for three recurring needs:

1. complete mathematical steps that the numbered chapters legitimately compress;
2. define numerical algorithms, special functions, and implementation conventions used across methods;
3. keep response, force, stress, relativistic, and topological formulas under explicit and compatible conventions.

An Appendix must therefore read as continuous reference prose, not as an isolated formula inventory. It may summarize where a formula is used, but it must not replace the complete physical narrative of a numbered chapter or alter another Part's scientific conclusion.

## Common mathematical and numerical conventions

Each Appendix repeats any convention whose omission could change a sign, prefactor, unit, or numerical result. The defaults below are a coordination baseline, not permission to hide local exceptions.

### Units

- Electronic-structure derivations default to atomic units only when the page explicitly states `e = m_e = \hbar = 4\pi\epsilon_0 = 1`.
- Relativistic formulas retain `c` unless an atomic-unit reduction is being derived.
- Electromagnetic and optical-response formulas use SI by default so that conductivity and dielectric prefactors remain identifiable.
- Every interactive or numerical model declares its own displayed units. Dimensionless teaching coordinates are labelled as such.

### Fourier transforms

For a continuum field,

```math
f(\mathbf r)=\int\frac{d^3q}{(2\pi)^3}\,f(\mathbf q)e^{i\mathbf q\cdot\mathbf r},
\qquad
f(\mathbf q)=\int d^3r\,f(\mathbf r)e^{-i\mathbf q\cdot\mathbf r}.
```

For a periodic cell of volume `\Omega`,

```math
f(\mathbf r)=\frac{1}{\Omega}\sum_{\mathbf G}f_{\mathbf G}e^{i\mathbf G\cdot\mathbf r},
\qquad
f_{\mathbf G}=\int_{\Omega}d^3r\,f(\mathbf r)e^{-i\mathbf G\cdot\mathbf r}.
```

A page using another normalization must state it before the first transformed equation.

### Time and response

- Default harmonic time dependence: `e^{-i\omega t}`.
- A retarded response vanishes for negative time and is analytic for `\operatorname{Im}\omega>0` under this convention.
- The sign of the imaginary part, spectral functions, and Kramers–Kronig relations must be checked against that convention rather than copied mechanically.

### Tensors, strain, and stress

- Repeated Cartesian indices are summed when explicitly declared.
- Infinitesimal strain is symmetric: `\epsilon_{ij}=\epsilon_{ji}`.
- Default stress convention: `\sigma_{ij}=\Omega^{-1}\partial E/\partial\epsilon_{ij}`; positive diagonal stress is tensile.
- Hydrostatic pressure is `p=-\operatorname{Tr}\boldsymbol\sigma/3` under that convention.

### Angular momentum and spinors

- Complex spherical harmonics use the Condon–Shortley phase.
- Any real-harmonic basis supplies the transformation matrix and ordering.
- Spinors are normalized with the spatial integral and spinor-component sum made explicit.
- Appendix N implementation tables must state orbital ordering, local-axis orientation, and Hermiticity conventions.

### Berry geometry

- Default Berry connection: `\mathbf A_n(\mathbf k)=i\langle u_{n\mathbf k}|\nabla_{\mathbf k}u_{n\mathbf k}\rangle`.
- Curvature is `\boldsymbol\Omega_n=\nabla_{\mathbf k}\times\mathbf A_n`.
- Brillouin-zone orientation is right-handed; discrete plaquette orientation must be stated.
- Gauge-dependent quantities, gauge-invariant loops, and integer invariants remain separately identified.

### Linear algebra and residuals

- Vector residuals use the Euclidean 2-norm unless another norm is declared.
- Matrix inner products use the Frobenius form `\langle A,B\rangle=\operatorname{Tr}(A^\dagger B)` unless the basis carries an overlap matrix.
- Generalized eigenproblems must state the metric and normalization.
- Eigensolver residual, density residual, total-energy change, wavefunction error, SCF outer iteration, and eigensolver inner iteration are never treated as interchangeable convergence measures.

## Appendix dependency and execution map

| Appendix | Martin locator | Main role and content boundary | Main chapter crosswalk | Core derivations | Original visualizations or models | Planned batches |
|---|---:|---|---|---|---|---|
| A · Functional Equations | 581–583; A.1–A.2 | Functions, functionals, first/second variation, constrained variation, gradient functionals and boundary terms. It supplies mathematics rather than repeating DFT history. | Chapters 3, 6–9 | Functional derivative; Euler–Lagrange equation; gradient-dependent functional; second variation | Function/functionals map; direction in function space; endpoint boundary term | source/orientation → variation → gradient functional → review/validation |
| B · LSDA and GGA | 584–586; B.1–B.3 | Spin densities, LSDA, gradient ingredients and explicit PBE reference formulas; Chapter 8–9 narrative remains outside this Appendix. | Chapters 8–9 | Spin scaling/interpolation identities; reduced gradients; enhancement-factor limits | Information hierarchy; reduced-gradient field; PBE enhancement curve | LSDA → GGA ingredients → PBE/constraints → validation |
| C · Adiabatic Approximation | 587–589; C.1–C.2 | Fast/slow coordinates, derivative couplings, electron–phonon matrix elements and breakdown conditions. | Chapters 4, 19–21 | Parameterized electronic basis; nonadiabatic coupling terms; transition denominator | Energy surfaces; avoided crossing; time-scale ratio | general formulation → electron–phonon connection → limits |
| D · Perturbation, Response, Green Functions | 590–599; D.1–D.6 | Perturbation order, self-consistent response, causality, resolvents and `2n+1`; dielectric specialization stays in E. | Chapters 7, 20–21 | First/second-order corrections; Dyson response; spectral representation; Kramers–Kronig; `2n+1` statement | Feedback loop; poles; real/imaginary response | static theory → self-consistency → dynamic/Green → theorem |
| E · Dielectric and Optical Properties | 600–606; E.1–E.6 | Electromagnetic, conductivity, dielectric, sum-rule and lattice-response reference under explicit SI/time conventions. | Chapters 20–21 | Conductivity–dielectric relation; f-sum; longitudinal/transverse separation; ionic contribution | Field decomposition; tensor action; spectral-weight model | Maxwell/conventions → tensors/sum rule → longitudinal/transverse/lattice |
| F · Coulomb Interactions | 607–619; F.1–F.6 | Periodic Coulomb sums, neutrality, Ewald decomposition, surfaces, interfaces and image corrections. | Chapters 12–14, 18, 22 | Ewald real/reciprocal split; self/background terms; dipole correction | Gaussian split; periodic images; slab-vacuum error | convergence problem → Ewald → charge models/references → surfaces/images |
| G · Stress | 620–626; G.1–G.4 | Macroscopic strain/stress, virial and reciprocal-space expressions, internal strain. | Chapters 2, 18–20 | Energy derivative under strain; pair virial; pressure/sign relation | Deformation tensor; stress components; internal relaxation | continuum definition → pair forces → Fourier form → internal strain |
| H · Energy and Stress Densities | 627–636; H.1–H.4 | Local-density gauge freedom, integrated observables, partition dependence and ELF. | Chapters 18–20 | Gauge-equivalent energy densities; integrated stress; ELF expression | Gauge redistribution; local/integrated comparison; ELF teaching field | energy → stress → integration → ELF/boundaries |
| I · Alternative Force Expressions | 637–643; I.1–I.5 | Variational freedom, Hellmann–Feynman and Pulay terms, pressure/stress and APW forces. | Chapters 10–19 | Parameter derivative of variational energy; basis-response term; pressure/force identities | Force decomposition; moving basis; APW sphere boundary | variational forces → differences/pressure → force/stress/APW |
| J · Scattering and Phase Shifts | 644–646; J.1 | Spherical potential scattering and partial waves; pseudopotential construction remains in Chapter 11. | Chapters 10–11, 16–17 | Radial asymptotics; phase shift; scattering amplitude/cross section; logarithmic derivative | Phase-shifted radial wave; resonance | radial equation → asymptotics/phase → observables/transferability |
| K · Useful Relations | 647–650; K.1–K.5 | Searchable special-function and angular-momentum reference with ordering and phase conventions. | Chapters 10–17, 20 | Recurrences, orthogonality, harmonic transformations, Gaunt coupling, Chebyshev recursion | Function families; harmonics; coupling triangle; polynomial approximation | radial functions → harmonics/coupling → Chebyshev |
| L · Numerical Methods | 651–660; L.1–L.7 | General integration, optimization, mixing and spectral approximation. | Chapters 7, 10–20 | Numerov; steepest/CG; quasi-Newton; DIIS; Broyden; moments/KPM | Optimization paths; residual subspace; spectral reconstruction | integration → optimization → mixing → stochastic/spectral methods |
| M · Iterative Electronic-Structure Methods | 661–676; M.1–M.11 | Electronic-structure eigensolver and minimization algorithms, inner/outer loops and complexity. | Chapters 7, 12–21 | Krylov/Lanczos; Davidson correction; RMM-DIIS; energy minimization; imaginary time | Krylov growth; tridiagonalization; residual preconditioner; scaling | motivation/relaxation → Krylov family → minimization/projection → complexity |
| N · Two-Center Matrix Elements | 677–678; continuous text | Arbitrary-angular-momentum two-center angular factorization. No invented `N.1` sections. | Chapters 14–17 | Local-axis rotation; angular/radial factorization; symmetry and Hermiticity | Two-center frame; sigma/pi/delta channels; sparsity | source-structure reconstruction → derivation → indexing/validation |
| O · Dirac and Spin–Orbit | 679–685; O.1–O.3 | Dirac equation, nonrelativistic expansion and atomic relativistic treatments under explicit order/unit conventions. | Chapters 10, 25–28 | Free spectrum; Pauli reduction; mass-velocity, Darwin and SOC terms; central potential | Dirac branches; spinor components; `j=l\pm1/2` splitting | Dirac equation → nonrelativistic terms → atomic implementation |
| P · Berry Geometry and Chern Numbers | 686–696; P.1–P.7 | Gauge geometry, curvature, Chern number, adiabatic phase, AB effect and monopole. | Chapters 23–28 | Gauge transformation; curvature/flux; patching and quantization | Parameter loop; gauge patch; monopole sphere | connection/phase → curvature/Chern → evolution/AB/monopole |
| Q · Quantum Hall and Edge Conductivity | 697–700; Q.1–Q.2 | Landau levels, Hall response and bulk–edge relation; detailed material models remain in Part VI. | Chapters 25–28 | Landau quantization; Chern conductivity; edge-channel current | Landau levels; edge/skipping states; channel count | bulk topology → boundary states/conductivity |
| R · Electronic-Structure Codes | 701–703; continuous categorized list | Separate Martin's historical snapshot from a time-stamped official-source current catalog. No invented `R.1` sections and no ranking. | All methods/practice pages | Data-model and evidence rules rather than a universal algorithm | Historical/current ecosystem map; method/basis/license matrix | historical reconstruction → official-source catalog → validation/time policy |

## Shared component and data plan

Shared changes remain minimal because six other Parts are being developed concurrently.

- Reuse merged `BilingualSection.astro`, `BilingualCallout.astro`, `SourceNote.astro`, and current typography.
- Appendix-specific code lives under `src/components/part07/appX/`.
- Small deterministic kernels live under `src/data/part07/`.
- Appendix validators are named `scripts/validate-part07-app-x.mjs`.
- A Part VII common component is created only after two Appendices demonstrate the same stable interface. Premature common abstractions are avoided.
- `src/styles/custom.css`, `astro.config.mjs`, dependencies, and the lockfile are not modified for Appendix A unless a reproducible defect requires a separate compatible change.
- `package.json` may receive only the validator script and the corresponding `check` entry; it must preserve all scripts already accepted on current `main`.

Candidate common components after repeated use:

- convention panel for units/Fourier/time/sign declarations;
- bilingual source-map table;
- derivation step container with assumptions and boundary term;
- deterministic curve/field plot shell with semantic fallback;
- special-function table with phase/order metadata.

## Current-program information policy for Appendix R

The historical program list is tied to Martin's publication context. Current program records are a separate machine-readable dataset, expected at `src/data/part07/electronicStructureCodes.mjs`, with at least:

```text
name, officialUrl, officialDocs, methodFamilies, basisTypes,
boundaryConditions, license, currentStatus, lastVerified, sourceRefs,
scopeBoundary
```

Every current-state field must be checked against an official project site, official documentation, official repository, formal paper, or license page at the time Appendix R is drafted. An official claim of support is not an independent implementation test. Restricted files, including VASP POTCAR datasets, never enter the repository.

## Validation and acceptance

Each Appendix must pass the following gates before merge:

1. all catalogued Martin sections are covered; N and R preserve their actual continuous structure;
2. Chinese and English explanations carry the same assumptions and limits;
3. symbols, units, function spaces, boundary conditions, normalization and conventions are explicit;
4. definitions, exact identities, approximations, discretizations and algorithms are distinguished;
5. each teaching model has deterministic input, a known limit, a regression test, a no-JavaScript fallback and a stated scientific boundary;
6. original exercises do not reproduce textbook exercises;
7. `npm ci --no-audit --no-fund` and `npm run check` pass in the recorded environment;
8. PR diff is Appendix-scoped and contains no textbook scans/PDFs, restricted content, credentials or large outputs;
9. GitHub Actions executes nonzero steps successfully;
10. the merged Pages deployment identifies the exact commit and the live route passes the declared browser checks.

Framework validation, static build, or a visually plausible plot does not independently validate a textbook claim, numerical method, real DFT calculation, or learner outcome.

## Copyright boundary

The public repository may contain bibliographic identity, Appendix and section titles, printed-page locators, original exposition, independently written derivations, original diagrams/models, and original exercises. It must not contain the supplied textbook PDFs, page images, copied figures, long transcription/translation, textbook exercise wording or answers, license-restricted software content, or private research data.