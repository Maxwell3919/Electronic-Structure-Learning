# Computational Tools foundation review — 2026-08-04

## Scope and decision

This review supplies the first public Computational Tools taxonomy. It does not add commands, input templates, output semantics, troubleshooting instructions, or a research workflow. Those remain with code-specific documentation and DFT Research Workflow.

All accepted destinations below were opened on 2026-08-04. The public page uses original, short role descriptions and states the applicable access, version, model, or validation boundary.

## Accepted routes

| Role | Accepted destinations | Why this small set is distinct |
| --- | --- | --- |
| Electronic-structure engines | Quantum ESPRESSO; FHI-aims; GPAW | Plane-wave/pseudopotential, all-electron atom-centred, and multi-representation PAW routes. |
| Molecular and many-electron methods | PySCF; Psi4; QMCPACK | Scriptable molecular/periodic methods, molecular quantum chemistry, and stochastic many-electron methods. |
| Structure and symmetry | ASE; Spglib | Atomistic simulation interface and symmetry library; neither replaces physical-model review. |
| Workflow and provenance | AiiDA | Explicitly separates recorded lineage from scientific validity. |
| Databases and interoperability | NOMAD; COD; OPTIMADE | Managed materials data, open crystallographic structures, and cross-database API specification. |
| Phonons and transport | phonopy; EPW; Perturbo | Harmonic phonons, electron-phonon/Wannier interpolation, and carrier scattering/dynamics. |
| Defects and reactions | doped; ShakeNBreak | Defect workflow support and structural-candidate search without a ground-state or convergence claim. |
| Topology and post-processing | Z2Pack | Wilson-loop/hybrid-Wannier invariant calculation with explicit interface and subspace limits. |
| Visualization | VESTA; OVITO | Structural/field inspection and atomistic analysis, neither treated as validation. |
| HPC environments | Slurm; Spack | Scheduler semantics and reproducible environment construction, neither treated as scientific evidence. |

## Deferred or rejected candidates

- Bilbao Crystallographic Server: primary destination returned a 502 response during this review; defer until it can be rechecked.
- Materials Project: the primary destination rejected this review environment with HTTP 403; defer rather than publish an unchecked route.
- Critic2: the maintainer documents its stable version as seriously outdated. Its active development route has real archival value but is not a first-pass representative without a version-specific placement decision.
- LOBSTER: the primary destination timed out during this review; defer rather than relying on the audit snapshot.
- The remainder of the audit inventory: retained in the audit because it would make the first public page a software directory, duplicate future Reference collections, or needs a distinct placement decision.

## Cross-cutting boundary

Installation, normal termination, parser success, workflow completion, database retrieval, visualization, and provenance capture do not establish representation convergence, observable convergence, physical validity, or scientific support.
