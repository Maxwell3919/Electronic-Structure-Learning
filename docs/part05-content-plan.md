# Part V content plan: From Electronic Structure to Properties of Matter

Status: active planning for Chapter 19; Chapters 20-24 remain planned only until the preceding chapter is accepted.

Baseline website main: `7e0a73d74322828f0626b7174aaa61f1677dbf98`

Primary source: Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., Part V, printed pp. 411-514.

Practical cross-reference: David S. Sholl and Janice A. Steckel, *Density Functional Theory: A Practical Introduction*. The practical text supplies convergence questions and examples; it does not replace Martin's order or claims.

## 1. Part-level question and dependency chain

Part V explains how a ground-state electronic-structure calculation becomes a statement about motion, response, spectra, boundaries, localized representations, and geometric observables. The governing dependency chain is:

```text
ground-state density and orbitals
  -> total energy, force, stress, and first-order potential
  -> ionic motion or external perturbation
  -> force constants, response functions, and excitation poles
  -> phonons, magnons, dielectric and optical response, and electron-phonon matrix elements
  -> surfaces, interfaces, and reduced dimensionality
  -> localized Wannier representation
  -> polarization differences, localization measures, and Berry phases
```

The following objects must remain distinct throughout the Part:

- ground-state total energy and density;
- Kohn-Sham eigenvalues and energy differences;
- forces and force constants;
- static, retarded, and frequency-dependent response functions;
- phonon eigenvalues/frequencies and magnetic collective modes;
- electron-phonon matrix elements, Eliashberg functions, and derived superconducting estimates;
- quasiparticle addition/removal spectra and neutral optical excitations;
- electrostatic reference levels at surfaces and interfaces;
- Wannier functions, centers, spreads, and interpolation errors;
- Berry connections, Berry phases, polarization branches, and topology-related quantities.

No chapter may use the phrase “the band structure gives the property” without identifying the additional definition, matrix element, response equation, reference, approximation, and convergence checks required for the stated property.

## 2. Source map and chapter boundaries

| Chapter | Martin printed pages | Directory sections | Main boundary |
|---|---:|---:|---|
| 19 · Quantum Molecular Dynamics | 411-424 | 19.1-19.6 | Classical nuclei moving on an electronic energy surface; forces, BOMD, CPMD, plane-wave implementation, approximate QMD, and simulation limits. Linear-response phonons remain in Chapter 20. |
| 20 · Response Functions: Phonons and Magnons | 427-444 | 20.1-20.9 | Energy derivatives, frozen phonons, density response, Green functions, variational response, periodic perturbations, dielectric response, EPC, superconductivity boundaries, and spin response. |
| 21 · Excitation Spectra and Optical Properties | 446-464 | 21.1-21.9 | Time-dependent density, retarded response, TDDFT, independent-particle and interacting dielectric response, real-time propagation, and optical observables. Kohn-Sham energy differences are not treated as complete excitation spectra. |
| 22 · Surfaces, Interfaces, and Lower-Dimensional Systems | 465-479 | 22.1-22.9 | Electrostatic references, work functions, ordinary surface states/resonances, interfaces, layered materials, and one-dimensional systems. Topological boundary-state classification remains in Part VI. |
| 23 · Wannier Functions | 481-496 | 23.1-23.7 | Bloch-Wannier transforms, gauge freedom, projection, maximal localization, nonorthogonal functions, disentanglement, hybrid functions, and interpolation validation. |
| 24 · Polarization, Localization, and Berry Phases | 499-514 | 24.1-24.8 | Bulk polarization differences, Berry phase, Wannier centers, localization, Thouless pumping, and polarization lattices. Full Chern/topological-insulator classification remains in Part VI. |

Martin appendices used as direct support are Appendix C (adiabatic approximation), D (perturbation, response, Green functions, and the 2n+1 theorem), E (dielectric and optical response), F (extended-system Coulomb terms and surface/interface dipoles), I (alternative force expressions), M (iterative electronic-structure algorithms), and P (Berry phase, curvature, and adiabatic evolution). Appendix material is cited only where a derivation depends on it.

## 3. Practical crosswalk to Sholl-Steckel

| Part V topic | Sholl-Steckel locator | Use in this website |
|---|---|---|
| Molecular dynamics | Chapter 9, pp. 193-208 | Verlet integration, microcanonical/canonical ensembles, thermostat meaning, BOMD/CPMD comparison, timestep and trajectory-scale limits. |
| Vibrational modes | Chapter 5, pp. 113-129 | Finite-displacement Hessians, molecular/surface modes, zero-point energies, delocalized phonons, and numerical displacement choices. |
| Reaction paths and barriers | Chapter 6, pp. 131-160 | Separating trajectories, transition states, NEB-type paths, and the limited time-scale reach of direct MD. |
| Thermodynamic phases | Chapter 7, pp. 163-177 | Free-energy and chemical-potential connections for interpreting QMD examples; no replacement of Martin's QMD derivation. |
| Surface calculations | Chapter 4, pp. 83-112 | Slab/vacuum/k-point choices, relaxation, surface energies, symmetry, reconstruction, and adsorption convergence. |
| Accuracy | Chapter 10, pp. 209 onward | Numerical versus physical accuracy, functional dependence, vibrational benchmarks, and the boundary between a converged calculation and an accepted claim. |

## 4. Unified notation and conventions

Unless a chapter explicitly states otherwise:

- ionic indices: `I,J,K`; Cartesian components: `alpha,beta,gamma`;
- ionic positions and displacements: `R_I`, `u_{I alpha}`;
- ionic masses: `M_I`;
- electronic orbitals: `psi_{n k}` and cell-periodic parts `u_{n k}`;
- ground-state Born-Oppenheimer energy: `E_BO({R})`;
- force: `F_I = - partial E_BO / partial R_I`;
- force constants: `Phi_{I alpha,J beta}`;
- phonon branch and wavevector: `nu,q`;
- retarded response convention: Fourier transform proportional to `exp(-i omega t)` unless a section declares the opposite convention;
- positive infinitesimal: `eta -> 0+`;
- primitive-cell volume: `Omega`; Brillouin-zone sampling counts: `N_k`, `N_q`;
- atomic units may be used inside a derivation, but the page must state the choice and restore dimensions when connecting to calculations;
- discrete propagation uses a named integrator and explicit timestep `Delta t`;
- every broadening, smearing, normalization, reference energy, and branch convention must be declared.

## 5. Chapter 19 execution plan

### Source boundary

Martin Chapter 19, printed pp. 411-424, covers sections 19.1-19.6. The website will reproduce only section titles and page locators. Public exposition, derivations, exercises, diagrams, numerical kernels, and validation cases are original.

### Required derivations

1. Newton equations on the Born-Oppenheimer surface, including the distinction between a classical-ion approximation and the electronic ground-state problem.
2. Position-Verlet and velocity-Verlet updates from Taylor expansions, local truncation error, symplectic/reversible structure, and bounded energy oscillation versus secular drift.
3. Hellmann-Feynman differentiation from a normalized parameter-dependent eigenproblem; identify the terms that vanish only for an exact stationary state.
4. Pulay contributions from a coordinate-dependent finite basis and the separate issues of nonlocal pseudopotential forces and incomplete self-consistency.
5. BOMD data flow: initial guess, electronic minimization/self-consistency, force evaluation, ionic propagation, conserved quantity, thermostat boundary, and sampling.
6. Car-Parrinello extended Lagrangian, orthonormality multipliers, Euler-Lagrange equations, stationary Kohn-Sham limit, fictitious electronic mass, and adiabatic frequency separation.
7. Plane-wave coefficient propagation, orthonormality constraint, Hamiltonian application through reciprocal/real-space transforms, and the high-G timestep restriction.
8. Non-self-consistent QMD methods as changed Hamiltonians/energy surfaces, not faster realizations of the same exact calculation.

### Original visualizations

- `BornOppenheimerTrajectory.astro`: one-dimensional analytic energy surface with adjustable timestep and curvature; compares the reference harmonic trajectory with velocity-Verlet points. Acceptance: halving `Delta t` reduces maximum position error by approximately a factor of four in the small-step regime.
- `ForceDecompositionDiagram.astro`: static/interactive decomposition of exact Hellmann-Feynman, basis-motion (Pulay), nonlocal, and SCF-residual contributions. Acceptance: selecting a complete fixed basis removes only the Pulay branch, not nonlocal or SCF-residual terms.
- `BOMDCPMDFlow.astro`: keyboard-accessible process comparison and frequency-separation model. Acceptance: increasing fictitious mass lowers the model electronic frequency as `mu^{-1/2}` and narrows the adiabatic-separation margin.
- `EnergyDriftExplorer.astro` if the first three remain readable and validation cost is acceptable: deterministic comparison of timestep error and force noise. It will not claim to reproduce a production DFT trajectory.

### Batches

1. Plan, source map, orientation, terminology, and Part V evidence matrix.
2. Energy surface, forces, Hellmann-Feynman/Pulay derivations, and first force visualization.
3. BOMD integrators, energy conservation, timestep/SCF coupling, and trajectory visualization.
4. CPMD Lagrangian, stationary limit, plane-wave expressions, fictitious-mass limits, and workflow visualization.
5. Approximate QMD, examples, statistical/time-scale limits, exercises, source boundaries, validation, CI, Pages, and live smoke.

Only Chapter 19 is in active writing during these batches.

## 6. Chapters 20-24 formula and visualization plan

### Chapter 20

Derivations: harmonic expansion; mass-weighted dynamical matrix; translational invariance and acoustic sum rule; finite-displacement errors; first-order Sternheimer equation with occupied-space projection; periodic `q` perturbations; Born effective charge; nonanalytic LO-TO term; electron-phonon matrix elements; `alpha^2 F`, `lambda`, `omega_log`, and the assumptions behind McMillan/Allen-Dynes and Migdal-Eliashberg descriptions.

Visualizations: monoatomic/diatomic chain; frozen-phonon curvature; real-space force constants to `q`-space dispersion; Sternheimer flow; LO-TO splitting; `k,q` scattering geometry; cumulative `lambda`; superconductivity evidence ladder; magnon teaching model.

### Chapter 21

Derivations: retarded density response and causality; Lehmann/pole interpretation at Martin's level; independent-particle response; TDDFT Dyson equation; Hartree and XC kernels; dielectric matrix and local fields; real-time impulse/FFT relation; oscillator strengths; limits of the adiabatic kernel.

Visualizations: impulse-response Fourier pair; response poles and broadening; independent versus interacting response; real/imaginary dielectric function; local-field matrix; real-time propagation; molecular versus periodic optical boundary conditions; Kohn-Sham, quasiparticle, and optical-gap evidence boundary.

### Chapter 22

Derivations: planar/macroscopic potential averages; work function `V_vac - E_F`; electrostatic lineup and interface dipoles; simplified Tamm/Shockley boundary solutions; surface resonance distinction; low-dimensional density-of-states limits; finite-size/vacuum convergence logic.

Visualizations: periodic slab/vacuum; planar potential and work function; Tamm/Shockley/resonance comparison; semiconductor lineup; interface dipole; layer-resolved localization; 1D/2D/3D DOS; slab/vacuum convergence.

### Chapter 23

Derivations: Bloch-Wannier transform and inverse; translation and orthonormality; single/composite-band gauge freedom; projected functions and overlap matrices; spread functional decomposition at Martin's level; disentanglement with inner/outer windows; real-space Hamiltonian and interpolation error.

Visualizations: phase/gauge-controlled localization; Wannier center/spread; projection and orthonormalization; isolated versus entangled bands; window selection; hopping decay; interpolation residual; hybrid Wannier construction.

### Chapter 24

Derivations: failure of the ordinary position expectation in a periodic crystal; polarization as a change/current integral; Berry connection and gauge transformation; discrete overlap-product phase; multiband determinant; Wannier-center relation; polarization quantum/lattice; localization measure; quantized Thouless pump under an adiabatic gapped cycle.

Visualizations: cell-position ambiguity; polarization lattice/branch selection; closed-loop Berry phase; discrete overlap product; Wannier-center motion; adiabatic path; Thouless pump; hybrid-center flow limited to the bridge into Part VI.

## 7. Scientific evidence matrix

| Claim | Minimum calculation/evidence | Minimum convergence checks | Main approximations | Cannot be inferred from |
|---|---|---|---|---|
| A relaxed structure is a local minimum | Forces/stress at a stationary geometry plus Hessian information | cutoffs, k mesh, force threshold, cell size; relevant Hessian modes | XC functional, pseudopotential, finite cell | optimizer exit or small forces alone |
| Stable at sampled phonon points | Dynamical matrices at the declared `q` points | cutoff, k/q mesh, SCF/response threshold, ASR treatment | harmonic, adiabatic, XC | a geometry relaxation or Gamma point alone |
| Full-BZ harmonic dynamical stability | Converged dispersion over a mesh/path adequate to exclude unsampled instabilities | q mesh/interpolation/supercell, long-range terms | harmonic, adiabatic | high-symmetry line alone |
| Significant EPC | Converged `g`, linewidths or `alpha^2 F` with Fermi-surface sampling | k/q meshes, smearing, bands, interpolation windows | adiabatic/Migdal as declared | metallic bands, DOS at `E_F`, phonon stability, or a single `lambda` without convergence |
| Conventional phonon-mediated superconductivity is supported | Converged EPC spectrum plus a stated Coulomb treatment and robustness checks; ideally material-consistent comparison | k/q, smearing, interpolation, phonons, `mu*`/anisotropy sensitivity | Migdal-Eliashberg/Allen-Dynes scope | metallicity, finite DOS, soft modes, or nonzero `lambda` alone |
| An optical peak has an assigned transition | Converged response spectrum plus matrix-element/exciton/local-field analysis at the method's level | k mesh, empty bands, broadening, frequency grid, local fields | independent-particle, TDDFT kernel, or many-body approximation | band-gap magnitude or DOS peak matching alone |
| A state is surface-localized | Wavefunction/layer weight and convergence with slab thickness/vacuum; relation to projected bulk continuum | slab, vacuum, k mesh, termination, potential alignment | slab and XC choices | appearance inside a projected gap alone |
| A Wannier model reproduces a target subspace | Band/matrix-element comparison over a declared window and mesh | projections, inner/outer windows, k mesh, spread/hopping tails | chosen subspace and gauge | successful `.wout` completion or small spread alone |
| A polarization difference is reliable | Gapped adiabatic path and consistent Berry-phase branch tracking | k mesh, path discretization, overlap conditioning, structural path | independent-particle/DFT and branch convention | one absolute dipole of a periodic cell |
| A pump transports a quantized charge | Closed, gapped adiabatic cycle with integer-stable Berry/geometric result | k/time-parameter meshes and gap preservation | adiabaticity and coherent band subspace | Wannier-center motion on an open or gap-closing path |

## 8. Implementation and software connection policy

The sequence on every practical connection is:

```text
theoretical definition
  -> continuous equation
  -> discretization and gauge/reference choices
  -> program implementation
  -> input parameters
  -> numerical convergence of the target observable
  -> method applicability
  -> scientific interpretation
```

Version-sensitive syntax for Quantum ESPRESSO, DFPT, EPW, TDDFT implementations, Wannier90, and Berry-phase calculations must be checked against current official documentation when those sections are written. The website will not prescribe universal cutoffs, grids, timesteps, smearing, vacuum, displacement amplitudes, Wannier windows, or Coulomb pseudopotentials.

## 9. Parallel-work isolation

Current parallel branches are confined to chapter/Part namespaces and do not modify the global dependency stack, Astro config, lockfile, shared style sheet, or `src/lib/`. Part V will therefore:

- keep chapter components under `src/components/part05/chXX/`;
- keep deterministic kernels under `src/data/part05/` or `src/lib/part05/` only when shared within Part V;
- keep validators named `scripts/validate-part05-*`;
- avoid changes to `src/styles/custom.css` unless a local component cannot provide an accessible responsive style;
- not depend on files present only in another open branch;
- re-read `main` and compare active branches before each chapter is marked ready.

This web session can create and maintain the GitHub branch/PR. Talos worktree and host-local validation remain unknown until a host-live agent reports them.

## 10. Chapter acceptance sequence

For each chapter: source-complete draft -> deterministic validators -> framework/SCF/static build -> final diff review -> PR ready -> merge -> exact-SHA Pages deployment -> live desktop/narrow/keyboard/no-JavaScript smoke -> one Research-Ops handoff. A later chapter does not enter active writing before the preceding chapter reaches this state.
