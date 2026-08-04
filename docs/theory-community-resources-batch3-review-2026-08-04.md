# Theory community resource expansion — Batch 3

Review date: 2026-08-04

Website baseline: `df8fb861b682b4f0f709178769911be5daa8d0d8`

Scope: page-local additions for Plane-Wave and Real-Space Methods, Linear Response and Excited States, and Berry Phases and Electronic Topology. Methods and Reference remain outside this batch.

## Review method

Community discussions, video-platform course recommendations, and open-course catalogues were used for discovery. Public inclusion required an original project or instructor-maintained destination, an inspectable sequence or documentation structure, a distinct role not already filled on the page, and an explicit applicability boundary.

Recommendation frequency, play counts, institutional reputation, repository activity, and benchmark claims were treated as discovery signals rather than scientific validation.

## Accepted additions

| Theory page | Resource | Role and boundary |
| --- | --- | --- |
| Plane-Wave and Real-Space Methods | DFT-FE project, [official documentation](https://dftfedevelopers.github.io/dftfe/) and [project site](https://sites.google.com/umich.edu/dftfe/download) | Connects a local real-space variational Kohn–Sham formulation to higher-order adaptive finite elements, pseudopotential/all-electron treatments, and periodic, semi-periodic, or non-periodic boundaries. It is an advanced implementation bridge, not an introductory FEM course or a transferable mesh/convergence prescription. |
| Linear Response and Excited States | IIT Bombay / NPTEL, [Ideas and Methods in Condensed Matter Theory](https://archive.nptel.ac.in/courses/115/101/115101009/) | The early module derives the response kernel, causality/analyticity structure, dispersion relations, and fluctuation–dissipation theorem before moving into interacting condensed-matter examples. It supplies the conceptual bridge missing between equilibrium correlations and code-specific TDDFT/DFPT tutorials. It does not teach electronic-structure response implementations or replace observable-specific convergence. |
| Berry Phases and Electronic Topology | Ken Shiozaki and Kohei Kawabata, University of Tokyo ISSP, [Condensed Matter Physics II (2025)](https://kawabata.issp.u-tokyo.ac.jp/lectures/2025CMP.html) | Instructor-maintained course sequence from SSH and bulk–boundary correspondence through Berry phase/curvature, Chern and Z₂ invariants, topological superconductors, axion response, and symmetry classification, with selected notebooks and notes. It is a model/theory course and does not validate a material-specific topological claim. |

## Deferred or rejected candidates

- Bilibili or YouTube copies of university lectures without a verifiable original publication chain, even when their playlists were complete or highly viewed.
- Finite-element software tutorials that teach generic assembly and meshing but never connect weak formulations, adaptive spaces, and Kohn–Sham operators.
- Real-space DFT code manuals limited to input flags and example outputs without a visible representation or convergence discussion.
- Linear-response courses centred on classical transport or nonequilibrium stochastic processes when the connection to retarded quantum response was too indirect for this page.
- Topology playlists that inferred a material phase from band inversion, one edge plot, or one symmetry label without stating the invariant, gap, subspace, and Hamiltonian assumptions.

## Validation boundary

The review verifies source identity, visible scope, and the stated role of each accepted destination on 2026-08-04. It does not independently verify every derivation, implementation result, benchmark, notebook output, subtitle, exercise, future revision, or external platform state. The learning routes do not replace system- and observable-specific validation.
