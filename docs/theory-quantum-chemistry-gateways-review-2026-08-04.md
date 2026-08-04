# Quantum Chemistry gateway review — 2026-08-04

## Scope

This small Theory batch augments only `/theory/quantum-chemistry/`. Its purpose is to add an open, continuous notebook route and a focused hands-on molecular route without duplicating the Methods, Computational Tools, or DFT Research Workflow responsibilities.

## Accepted routes

| Destination | Local teaching role | Audience and access | Boundary retained on the page |
| --- | --- | --- | --- |
| [eChem — Computational Chemistry from Laptop to HPC](https://kthpanor.github.io/echem/) | Notebook-based progression from electronic ground states through structure, spectra, environments, visualization, and workflows. | Open KTH-hosted book; useful after introductory quantum mechanics and Python. | Notebook/software versions and a completed exercise do not validate a new Hamiltonian, basis, correlation treatment, or property calculation. |
| [MolSSI Quantum Mechanics Tools](https://education.molssi.org/qm-tools/) | Hands-on molecular geometry, potential-energy surface, basis-convergence, and redox-potential exercises. | Open MolSSI lesson for early-career learners with Python, NumPy, plotting, and Jupyter preparation. | Its workflow and convergence examples are scoped to the stated molecule and property; they do not select a method or basis automatically. |

Both destinations were opened on 2026-08-04. eChem exposes a maintained topical book structure and an explicit citation route. MolSSI exposes prerequisites, a lesson sequence, source repository, and stated development status. They are complementary rather than duplicate: eChem supplies a broad notebook spine while MolSSI supplies focused molecular exercises.

## Deferred candidates

| Candidate | Disposition | Reason |
| --- | --- | --- |
| Quantum Chemistry Jupyter Book | Deferred | The primary destination did not expose sufficient current, inspectable page structure in this review environment. |
| Psi4Education and PySCF guide | Deferred | Useful implementation alternatives, but this small page-local batch already has a continuous notebook route and a focused exercise route. Adding them now would unnecessarily turn the page into a software list. |

## Evidence boundary

These links are study routes. They do not independently establish numerical convergence, method appropriateness, a chemical interpretation, or scientific support for a new molecular calculation.
