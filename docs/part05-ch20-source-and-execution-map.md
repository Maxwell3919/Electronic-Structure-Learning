# Part V Chapter 20 source and execution map

Status: Chapter 20 is the only active Part V writing chapter.

Branch baseline: `f7d16e551a7ba14392b0c80397042747dd86a46b`

## Verified source boundary

Primary source: Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., Chapter 20, printed pp. 427–444. The public site may retain the chapter/section titles and printed-page locators below; it must not reproduce the source prose, figures, captions, exercise wording, or answers.

| Section | Martin title | Printed page | Website boundary |
|---|---|---:|---|
| 20.1 | Lattice Dynamics from Electronic Structure Theory | 427 | Equilibrium, harmonic expansion, real-space force constants, mass weighting, crystal Bloch form, acoustic/optic branches, long-range electric fields, stress and internal strain. |
| 20.2 | The Direct Approach: “Frozen Phonons,” Magnons | 430 | Numerical derivatives, displacement amplitude, supercell/commensurability/range, anharmonic finite displacements, frozen fields, and frozen spin spirals. |
| 20.3 | Phonons and Density Response Functions | 433 | Second energy derivatives, density response, dielectric-matrix relation, independent-particle response, and why all-purpose response matrices/empty-state sums are costly. |
| 20.4 | Green’s Function Formulation | 435 | First-order density/orbitals, self-consistent screened perturbation, occupied/empty projectors, projected Sternheimer equation, and iterative solution. |
| 20.5 | Variational Expressions | 436 | Second-order response functional, constrained minimization, equivalence to the projected linear equation, and stationary-error boundaries. |
| 20.6 | Periodic Perturbations and Phonon Dispersion Curves | 438 | A perturbation at `q`, `k -> k+q` mixing, cell-periodic response, FFT implementation, and one-cell access to arbitrary commensurate response wavevectors. |
| 20.7 | Dielectric Response Functions, Effective Charges | 439 | Homogeneous-field difficulty, off-diagonal position matrix elements/commutators, nonlocal-potential correction, Born effective charges, dielectric and piezoelectric response. |
| 20.8 | Electron–Phonon Interactions and Superconductivity | 441 | Screened electron–phonon matrix elements, normal-mode normalization, Fermi-surface sampling, `alpha^2 F`, `lambda`, frequency moments, and superconductivity claim ceilings. |
| 20.9 | Magnons and Spin Response Functions | 442 | Frozen magnons versus dynamic spin susceptibility, generalized Bloch spirals, spectral peaks, damping, disorder, and the distinction between collective and particle-hole response. |

The printed source exercises begin on p. 444 and will not be copied.

## Source observations that determine the chapter structure

Martin begins from the same Born–Oppenheimer ionic equation used in Chapter 19, then changes the target from a finite trajectory to derivatives of the equilibrium energy. The harmonic problem is therefore defined by the Hessian of the same approximate total-energy surface. The crystal reduction is a Fourier transform of real-space force constants, not a second independent definition of a phonon.

The chapter places direct finite-displacement calculations before response theory. The website will preserve that order because it exposes the numerical trade: direct methods reuse ordinary total-energy/force calculations and naturally include finite-displacement anharmonicity, while linear response targets derivatives at a chosen wavevector without requiring a matching supercell.

Martin’s response-function discussion separates an all-purpose density/dielectric response matrix from perturbation-specific DFPT. The website will derive the projected Sternheimer equation rather than treating it as a software command. It will also state the insulating, metallic, degeneracy, occupation and gauge qualifications that control the projector and linear solve.

The source’s electric-field section requires the periodic-position/Berry-phase boundary that is developed fully in Chapter 24. Chapter 20 will define Born effective charge as a mixed derivative and explain the nonanalytic long-range contribution to the dynamical matrix; it will not pre-write the modern polarization chapter.

The source introduces electron–phonon coupling through the screened derivative of the effective potential and Fermi-surface scattering. The website will supplement Martin’s compact discussion with explicit normalization, `k/q` integration, smearing/interpolation and evidence-level distinctions. Bands, DOS, a phonon dispersion, a finite `lambda`, and an Allen–Dynes number are separate evidence objects.

The final source section distinguishes a frozen spin spiral/energy dispersion from the full frequency-dependent spin spectral function. The website will retain this distinction and will not interpret every low-energy spin excitation as a sharp undamped magnon.

## Supporting source crosswalk

Sholl–Steckel Chapter 5 is used for the practical finite-displacement boundary: a displacement that is too large samples anharmonicity, while a displacement that is too small divides by energy/force differences below the numerical noise floor. Its molecular Hessian and surface-mode examples provide a practical cross-check, but Martin defines the periodic response/DFPT organization.

Martin Appendix D supplies perturbation theory, response, Green-function identities and the `2n+1` theorem. Appendix E supplies dielectric matrices and lattice contributions. Appendices C, G, I, M and P are used only where Chapter 20 needs the adiabatic, stress/internal-strain, force, iterative-solver or Berry-phase boundary.

Version-sensitive software syntax for Quantum ESPRESSO, DFPT, EPW or other implementations will be checked against current official documentation only when the practical sections are written. No universal cutoff, `k/q` mesh, displacement, smearing, broadening, `mu*` or interpolation window will be prescribed.

## Mathematical conventions

- Ionic displacements: `u_{l s alpha}` for atom `s`, cell `l`, Cartesian component `alpha`.
- Real-space force constants: `Phi_{0 s alpha,l s' beta}`.
- Dynamical matrix: `D_{s alpha,s' beta}(q)` with an explicitly stated mass and phase convention.
- Eigenvectors: mass-weighted normalization will be declared before using normal coordinates or electron–phonon matrix elements.
- The acoustic sum rule is a translational-invariance identity before it is a numerical correction.
- A negative eigenvalue of `D(q)` corresponds to `omega^2<0`; “imaginary frequency” is shorthand and requires a declared sign convention.
- Density response uses a retarded/static convention as appropriate; static phonon DFPT is not automatically a real-time excitation calculation.
- Periodic perturbation wavevector is written `q`; electronic crystal momentum is `k`.
- Born effective charge is `Z*_{s,alpha beta} = Omega (partial P_alpha / partial u_{s beta})_{E=0}` or its equivalent mixed derivative, with boundary conditions stated.
- Electron–phonon matrix elements include the phonon zero-point normalization explicitly; any alternate code normalization must be translated before comparison.
- `alpha^2 F(omega)`, `lambda`, `omega_log`, `mu*`, isotropic/anisotropic and adiabatic/Migdal assumptions remain separate declared objects.

## Planned original teaching models and acceptance conditions

1. **Monoatomic/diatomic chain dispersion.** Deterministic real-space springs transformed to `D(q)`. Acceptance: the acoustic mode is zero at `q=0` when the sum rule holds; doubling every mass reduces all frequencies by `1/sqrt(2)`; the diatomic model has one acoustic and one optical branch.
2. **Frozen-phonon curvature explorer.** A quartic energy model with controllable force noise and central differences. Acceptance: the symmetric second derivative is second-order in displacement in the noiseless small-step regime; the error rises again when the difference falls below the declared noise scale.
3. **Sternheimer response flow.** A finite Hermitian model comparing explicit empty-state summation with a projected linear solve. Acceptance: the two first-order responses agree to numerical tolerance; adding an occupied component to the trial response does not change the projected density response after gauge fixing.
4. **Long-range LO–TO model.** Analytic short-range dynamical matrix plus a direction-dependent nonanalytic charge/dielectric term. Acceptance: setting effective charges to zero removes the splitting; transverse polarization is unaffected by the longitudinal nonanalytic term in the declared model.
5. **EPC spectrum and evidence ladder.** Deterministic positive spectral peaks with cumulative `lambda` and `omega_log`. Acceptance: numerical quadrature reproduces analytic peak weights within tolerance; changing a smearing/grid parameter visibly changes an unconverged result and cannot be labelled a material prediction.
6. **Spin-response teaching model** if the chapter remains readable after the first five: a damped susceptibility with peak/linewidth. Acceptance: zero damping returns a sharp collective pole; increasing damping broadens the spectrum without redefining the peak as a static frozen-magnon energy.

## Evidence matrix entry conditions

| Claim | Minimum direct evidence | Minimum convergence/validity checks | Weaker evidence that cannot establish it |
|---|---|---|---|
| Harmonic stability at sampled `q` | Positive semidefinite mass-weighted dynamical matrices at declared `q`, with expected acoustic null space | electronic/force response, cutoff, `k/q`, supercell/interpolation, ASR treatment, long-range correction | relaxation, small forces, total-energy convergence |
| Full-BZ harmonic stability | Adequate full-zone mesh/interpolation plus checks of unsampled minima | `q` mesh/range, interpolation, nonanalytic term, symmetry, numerical noise | Gamma point or high-symmetry path alone |
| A soft mode is physical | Reproducible negative curvature/eigenvalue, converged eigenvector, lower-energy distortion or appropriate finite-temperature theory | displacement/response thresholds, cell, functional, electronic state, anharmonicity | one small imaginary frequency after ASR/noise |
| Born effective charge is reliable | Consistent mixed displacement–polarization or field–force response | `k` mesh, branch/gauge, field boundary, nonlocal terms | Bader/Mulliken/static ionic charge |
| EPC is significant | Converged screened `g_{mn nu}(k,q)` or `alpha^2 F` in the target energy region | `k/q`, smearing, bands, phonons, interpolation, gauge/normalization | metallicity, DOS at `E_F`, soft phonon alone |
| Conventional phonon-mediated superconductivity is supported | Converged EPC spectrum, Coulomb treatment, applicable Migdal–Eliashberg/Allen–Dynes analysis and robustness | all EPC checks plus `mu*`, anisotropy, anharmonic/nonadiabatic sensitivity | finite `lambda`, one `T_c`, metallic bands, phonon stability |
| A magnon is a well-defined collective mode | A stable peak/pole in the transverse spin response with controlled linewidth and wavevector dependence | ground-state magnetic order, `k/q/omega`, broadening, SOC/disorder/continuum | static spin spiral energy alone or a spin-polarized band structure |

## Batch sequence

- Batch A: source map, bilingual orientation, object table, §§20.1–20.2, chain/frozen-phonon models.
- Batch B: §§20.3–20.6, response/Sternheimer/variational derivations and projected finite model.
- Batch C: §§20.7–20.9, effective-charge/LO–TO, EPC/evidence and spin response.
- Batch D: practical workflow, original exercises, validator, live smoke, final copyright/scientific review, CI, merge, Pages and Research-Ops handoff.

Chapter 21 remains inactive until Chapter 20 reaches merged exact-SHA deployment and browser acceptance.
