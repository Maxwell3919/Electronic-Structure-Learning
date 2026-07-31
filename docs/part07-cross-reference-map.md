# Part VII cross-reference map

## Purpose

This map records which numbered chapters rely on each Appendix and what is delegated to the reference layer. It prevents two opposite failures: repeating a chapter's complete narrative inside an Appendix, and citing an Appendix without identifying the exact mathematical or numerical dependency.

The website may add outward links from an Appendix to an already stable chapter. Reverse links from Parts I–VI are added only through separate conflict-checked changes after the relevant chapter is stable; this Part VII branch does not bulk-edit parallel chapter pages.

## Map

| Appendix route | Supports | Delegated reference content | Boundary |
|---|---|---|---|
| `appendix-a-functional-equations` | Chapters 3, 6, 7, 8, 9 | Functional derivative, constrained stationarity, Euler–Lagrange equation, gradient contribution, boundary term, second variation | Does not establish DFT existence/uniqueness theorems or choose an exchange-correlation approximation. |
| `appendix-b-lsda-and-gga-functionals` | Chapters 8, 9 | Spin-density variables, LSDA/GGA ingredients, reduced gradients, PBE formulas and exact-limit checks | Does not rank functionals or prove material-specific accuracy. |
| `appendix-c-adiabatic-approximation` | Chapters 4, 19, 20, 21 | Parameterized electronic states, derivative coupling, electron–phonon transition structure and breakdown criteria | Does not infer phonon stability, EPC strength or superconductivity from an energy-surface sketch. |
| `appendix-d-perturbation-theory-response-functions-and-green-s-functions` | Chapters 7, 20, 21 | Perturbation orders, susceptibilities, self-consistent response, causal dynamic response, Green functions and `2n+1` | Does not replace convergence checks for a particular DFPT or TDDFT implementation. |
| `appendix-e-dielectric-functions-and-optical-properties` | Chapters 20, 21 | Conductivity/dielectric tensors, longitudinal/transverse response, sum rule and lattice contribution | Does not identify exciton, plasmon or phonon modes without the required model and calculation. |
| `appendix-f-coulomb-interactions-in-extended-systems` | Chapters 12, 13, 14, 18, 22 | Conditional convergence, Ewald terms, neutral backgrounds, surface dipoles and image corrections | Does not make a finite supercell equivalent to an isolated charged or slab system. |
| `appendix-g-stress-from-electronic-structure` | Chapters 2, 18, 19, 20 | Stress/strain convention, energy derivative, virial/Fourier forms and internal strain | Program-reported stress still requires code-specific sign, unit and basis checks. |
| `appendix-h-energy-and-stress-densities` | Chapters 18, 19, 20 | Local energy/stress gauges, integrated quantities and ELF | A local gauge-dependent density or ELF field alone does not establish a unique bond type. |
| `appendix-i-alternative-force-expressions` | Chapters 10–19 | Hellmann–Feynman/Pulay decomposition, pressure and APW force terms | Small force residual is distinct from basis convergence and scientific structural acceptance. |
| `appendix-j-scattering-and-phase-shifts` | Chapters 10, 11, 16, 17 | Partial waves, asymptotic phase shifts, logarithmic derivatives and cross sections | Matching selected phase shifts is only one part of pseudopotential transferability. |
| `appendix-k-useful-relations-and-formulas` | Chapters 10–17, 20 | Bessel families, spherical harmonics, angular couplings and Chebyshev relations | Formula identities do not fix basis ordering or numerical normalization unless declared. |
| `appendix-l-numerical-methods` | Chapters 7, 10–20 | Integration, Numerov, optimization, DIIS/Broyden and spectral approximation | No algorithm is unconditionally optimal; conditioning and objective/residual definitions matter. |
| `appendix-m-iterative-methods-in-electronic-structure` | Chapters 7, 12–21 | Relaxation, preconditioning, Krylov/Lanczos/Davidson/RMM-DIIS, energy minimization and complexity | Eigensolver convergence and SCF convergence remain separate inner and outer gates. |
| `appendix-n-two-center-matrix-elements-expressions-for-arbitrary-angular-momentum-l` | Chapters 14–17 | Local bond axis, angular rotations, radial/angular factorization, symmetry and indexing | The source has continuous text and equations but no numbered N.1 subsection; the site must not invent one. |
| `appendix-o-dirac-equation-and-spin-orbit-interaction` | Chapters 10, 25–28 | Dirac spinors, nonrelativistic reduction, scalar-relativistic terms and SOC | SOC splitting depends on the Hamiltonian, symmetry and basis; an atomic formula is not a complete solid-state classification. |
| `appendix-p-berry-phase-curvature-and-chern-numbers` | Chapters 23–28 | Connection, curvature, gauge transformation, Chern number, adiabatic phase, AB effect and monopole | Gauge-dependent connection, local curvature, converged invariant and material topology are distinct evidence levels. |
| `appendix-q-quantum-hall-effect-and-edge-conductivity` | Chapters 25–28 | Landau levels, Hall conductivity and bulk–edge relation | A finite-edge spectrum needs boundary and convergence checks before it supports a bulk–edge claim. |
| `appendix-r-codes-for-electronic-structure-calculations-for-solids` | All method and practice chapters | Historical program ecology and a separately verified current official-source catalog | It is not a ranking. Advertised support, independent reproduction and scientific suitability are separate statements. |

## Appendix A detailed crosswalk

| Chapter | Dependency on Appendix A | Link state during Appendix A PR |
|---|---|---|
| Chapter 3 · The Many-Body Problem | Variational stationarity and constrained normalization | Outward link from Appendix A only; reverse edit deferred. |
| Chapter 6 · DFT Foundations | Density as a variational variable and Lagrange multiplier for particle number | Appendix A links to the stable Chapter 6 route; no Chapter 6 edit. |
| Chapter 7 · Kohn–Sham Auxiliary System | Orbital and density variations leading to effective equations | Outward link only. |
| Chapter 8 · Exchange-Correlation Functionals | Functional derivative of local and gradient-dependent energies | Outward link only. |
| Chapter 9 · Advanced Functionals | Higher-variable and orbital-dependent generalizations; Appendix A supplies only the baseline calculus | Outward link only. |

## Maintenance rule

When a numbered chapter becomes complete, its author may add a focused reverse link that names the exact Appendix section or formula. The reverse link must not claim that the Appendix validates a material result, a software implementation, or a convergence decision. A cross-reference is navigation evidence, not independent scientific verification.