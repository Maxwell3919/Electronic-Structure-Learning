# Part V Chapter 21 · Excitation Spectra and Optical Properties — source and execution map

Baseline: `Maxwell3919/Electronic-Structure-Learning@be1dbfcdd1cc2b0a0168897f2225c0122ba07c40`

Primary source: Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., Chapter 21, printed pp. 446–464. The supplied PDF was checked page by page. The source exercises begin on p. 464 and will not be copied. Public prose, derivations, diagrams, numerical kernels and exercises will be original.

## Verified source boundary

| Section | Martin title | Page | Website responsibility |
|---|---|---:|---|
| 21.1 | Overview | 446 | Separate addition/removal spectra from neutral excitations and define the observable hierarchy. |
| 21.2 | Time-Dependent Density Functional Theory (TDDFT) | 447 | Action stationarity, time-dependent Kohn–Sham equations, history dependence and the adiabatic approximation. |
| 21.3 | Dielectric Response for Noninteracting Particles | 448 | Finite-system polarizability, periodic current/vector-potential response and independent-particle spectra. |
| 21.4 | Time-Dependent DFT and Linear Response | 450 | Dyson response, Hartree–XC kernel, transition-space coupling and Casida-type equations. |
| 21.5 | Time-Dependent Density-Functional Perturbation Theory | 451 | Frequency-dependent Sternheimer/Liouville response and empty-state-free iterative formulations. |
| 21.6 | Explicit Real-Time Calculations | 452 | Time propagation, unitarity, split operators, Cayley propagation, delta kicks and finite-time Fourier transforms. |
| 21.7 | Optical Properties of Molecules and Clusters | 454 | Polarizability, strength functions, sum rules, confinement and real-time versus frequency-domain routes. |
| 21.8 | Optical Properties of Crystals | 459 | Macroscopic current, local fields, starting-point gaps, excitons and long-range kernels. |
| 21.9 | Beyond the Adiabatic Approximation | 463 | Memory, frequency dependence, orbital-dependent kernels, exact exchange and hybrids. |
| Exercises | — | 464 | Six source exercises exist; the website will use a separate original set. |

## Dependencies and chapter boundary

```text
Chapter 7: static Kohn–Sham system and eigenvalue limitations
Chapter 9: generalized Kohn–Sham and hybrid/range-separated functionals
Chapter 20: response notation and Sternheimer logic
Appendix D: perturbation theory and response functions
Appendix E: dielectric response, conductivity and fields
        ↓
Chapter 21: neutral electronic excitation spectra and optical observables
```

Quasiparticle addition/removal spectra, Green-function methods and the Bethe–Salpeter equation may be named only to define the boundary. Chapter 22 owns surfaces/interfaces; Chapter 24 owns the full Berry-phase treatment of position and polarization in crystals.

## Information hierarchy

The chapter must keep distinct:

1. Ground-state density and static Kohn–Sham orbitals/eigenvalues.
2. Addition/removal energies and neutral excitation energies.
3. Independent-particle transition sums and interacting response poles.
4. Polarizability, conductivity, dielectric matrix, inverse dielectric response and optical strength.
5. Microscopic versus macroscopic fields and local-field corrections.
6. Bound excitons, continuum transitions and quasiparticle gaps.
7. Numerical broadening, physical lifetime broadening and finite-time resolution.
8. Frequency-domain linear response and explicit real-time propagation.
9. Adiabatic, frequency-dependent and orbital-dependent kernels.

Conventions will state the Fourier sign, retarded `omega + i eta` prescription, electron charge, occupation/spin factors and volume normalization. Finite systems may use the dipole operator; periodic crystals require a current/vector-potential or equivalent periodic formulation.

## Execution batches

### A — §§21.1–21.3

Derive the time-dependent Kohn–Sham equation, explain density-history dependence and the adiabatic approximation, then derive finite-system polarizability and periodic independent-particle dielectric/current response.

Original model: a causal two-level polarizability explorer with controllable transition energy, oscillator strength and damping.

### B — §§21.4–21.5

Develop `chi = chi0 + chi0 (v + fxc) chi`, transition-space coupling, a Casida-type eigenproblem and frequency-dependent Sternheimer/Liouville formulations.

Original model: two coupled transitions showing level repulsion, oscillator-strength redistribution and bright/dark combinations.

### C — §21.6

Compare exact exponentials, split operators, finite Taylor expansions and Crank–Nicolson/Cayley propagation. Connect a delta kick to induced dipole/current and a finite-time Fourier transform.

Original model: a time–frequency-resolution explorer based on deterministic damped oscillations.

### D — §§21.7–21.8

Treat molecular/cluster strength functions and sum rules, then periodic macroscopic current, local fields, excitons, starting-point gaps and long-range kernels.

Original models:

- an exciton-binding transition-space model separating the starting gap, binding energy and optical onset;
- a small dielectric-matrix model showing why inversion must precede extraction of the macroscopic component.

### E — §21.9 and closure

Explain memory and frequency-dependent kernels, multiple-excitation limits of adiabatic response, orbital-dependent/exact-exchange approaches, practical convergence, common misinterpretations and original exercises.

## Scientific claim ceilings

- A Kohn–Sham eigenvalue difference is not automatically an addition/removal energy or measured optical excitation.
- An independent-particle spectrum omits induced Hartree–XC response, local fields and electron–hole interaction.
- TDDFT response does not automatically repair a poor starting-point gap.
- A chosen broadening or finite propagation window is not automatically a physical lifetime.
- Norm preservation does not establish spectral convergence.
- One matching peak does not validate oscillator strengths, sum rules, continuum onset or all polarizations.
- A bound pole in a finite model does not establish a converged real-material exciton.
- Short-range adiabatic semilocal kernels generally cannot represent long-range crystal-exciton attraction.
- Program completion, propagation stability, target-spectrum convergence, method applicability and scientific acceptance are separate gates.

## Validation plan

Deterministic checks will cover causal two-level response, positive absorption under the declared convention, oscillator-strength scaling, analytic coupled-transition eigenvalues, strength conservation under orthogonal mixing, Cayley norm preservation, finite-time resolution scaling, dielectric-matrix inversion/local-field identities and exciton-threshold scaling.

Content checks will require all nine source rows, bilingual coverage, five original model contracts, five no-JavaScript fallbacks, original exercises, no placeholders and no forbidden control characters. The Pages smoke will verify exact deployment provenance, responsive layout, no document overflow, keyboard operation and static fallbacks.

## Parallel isolation

Open work at branch creation includes Part I Chapter 4, Part II Chapter 9, Part III Chapter 11, Part IV Chapter 13, Part VI Chapter 26 and Part VII Appendix B. Chapter 21 work remains chapter-local until final synchronization:

```text
src/components/part05/ch21/
src/data/part05/
src/content/docs/part-05-properties-of-matter/chapter-21-excitation-spectra-and-optical-properties.mdx
docs/part05-ch21-source-and-execution-map.md
scripts/validate-part05-ch21.mjs
scripts/smoke-part05-ch21.py
```

Shared package and workflow edits are deferred until a fresh current-main merge. Existing validators and smokes must be preserved additively. Talos mirror/worktree alignment remains `【未知/待验证】` because this session has no host-live access.
