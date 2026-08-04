# Methods gateway review — 2026-08-04

## Scope

This review supports a deliberately small update to `/methods/`. The page remains a conceptual map; it does not become a software directory, a manual mirror, or a substitute for the DFT Research Workflow operation contracts.

## Accepted routes

| Method family | Primary destination | What it is useful for | Boundary retained on the page |
| --- | --- | --- | --- |
| Ground-state DFT | [Quantum ESPRESSO Learn](https://www.quantum-espresso.org/learn/) | Workshop lectures and hands-on material for plane-wave ground-state calculations. | Code-specific examples do not establish pseudopotential, magnetic-branch, or observable convergence for a new study. |
| XC and functional extensions | [Libxc](https://libxc.gitlab.io/) | Versioned functional catalogue and implementation documentation. | Availability of a functional is not evidence that it is suitable for the system or observable. |
| DFPT and lattice response | [ABINIT DFPT topic guide](https://docs.abinit.org/topics/DFPT/) | Official concepts, variables, inputs, and tutorials for linear-response calculations. | ABINIT-specific route; q-point, interpolation, and observable convergence remain required. |
| Wannier representations | [Materials Cloud Wannier90 schools](https://www.materialscloud.org/learn/sections/kpbmzt/wannier90-schools) | Lectures and hands-on learning for localization and interpolation. | A school exercise does not validate selected subspaces, windows, gauges, or interpolation for a new system. |
| GW, BSE, and TDDFT | [BerkeleyGW tutorial](https://berkeleygw.org/documentation/tutorial/) and [Octopus tutorials](https://octopus-code.org/main/tutorials/) | Official implementation routes for GW/GW-BSE and time-dependent or response calculations. | Starting point, representation, screening or kernel, and boundary conditions still need explicit convergence. |
| Electron–phonon and transport | [EPW documentation](https://docs.epw-code.org/) | Official tutorials, schools, and benchmarks for Wannier-interpolated electron–phonon workflows. | Dense meshes, interpolation, Coulomb treatment, and the final observable remain material- and model-specific checks. |

All accepted destinations were opened on 2026-08-04. They are official project or host-maintained educational/documentation routes, accessible without a login in this review environment, and each occupies a distinct method-family role.

## Deferred routes

| Candidate | Disposition | Reason |
| --- | --- | --- |
| CECAM ESL tutorials | Deferred | The primary destination was not safely accessible in this review environment. |
| ASE NEB documentation | Deferred | The reviewed primary URL returned a current 404 response. |
| i-PI and PLUMED routes | Deferred | Not added in this deliberately small batch; the structural-path and sampling section remains conceptual until a distinct, stable gateway is reviewed. |
| DMFT-specific route | Deferred | The page names DMFT, but adding another destination would exceed this batch’s focused gateway budget without a reviewed, distinct teaching role. |

## Review boundary

The linked routes are learning or implementation entry points. They do not independently validate a calculation, establish a global ground state, prove a physical model is applicable, or support a scientific claim without the system- and observable-specific evidence described on the page and in the DFT Research Workflow.
