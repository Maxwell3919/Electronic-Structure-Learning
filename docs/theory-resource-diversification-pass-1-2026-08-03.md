# Theory resource diversification — pass 1

Review date: 2026-08-03

Start website main: `69a4e8675dc4f641850a03a4f51db03d75d44ab5`

Correction baseline: `bd24efe9bcb96e6766090fd82e907fbc55668a4e`

## User decision

Theory course references must not be limited to MIT OpenCourseWare, major publishers, or famous institutions. Chinese university courses, independent Bilibili creators, Zhihu long-form explanations, and transparent GitHub learning repositories are eligible when their authorship, structure, technical scope, access, maintenance, and limitations can be checked.

The Reference collection is still expanding and remains deferred. This pass therefore places the reviewed alternatives inside the Theory entrance, grouped by the Theory responsibility they support. It removes the premature Reference-page publication created in PR #205.

## Review policy

Institutional prestige, play count, follower count, and GitHub stars are discovery signals only. They are not quality scores.

A resource can be included when the review can establish:

- an identifiable author, course team, institution, or repository owner;
- an intended source rather than an unattributed mirror or download bundle;
- enough syllabus, playlist, notebook, documentation, or repository structure to identify scope;
- a concrete match to a current Theory responsibility;
- a learning role not already served by the other selected routes;
- explicit prerequisites, language, platform, license, completeness, or maintenance boundaries;
- no unresolved copyright or provenance problem in the linked destination.

A small independent project is not downgraded because it lacks institutional branding. It is also not promoted solely because it is popular or personally engaging.

## Accepted routes

### Quantum mechanics

#### B站物院の量子力学

Destination: `https://www.bilibili.com/video/BV1yh4y1A7ja/`

Observed scope includes wavefunctions, Schrödinger equations, model potentials, operators, Hilbert-space notation, representations, hydrogen, spin, angular momentum, and identical particles.

Role: compact Chinese first pass or structured review.

Boundary: the short chapters need textbook reading and sustained exercise work; they do not replace a complete university sequence.

#### PeiLingX — 从线性代数到量子力学

Representative destination: `https://www.zhihu.com/tardis/zm/art/169805550`

Observed role: connects spin experiments, basis changes, probability distributions, Fourier transforms, coordinate and momentum representations, and uncertainty to familiar linear algebra.

Role: conceptual bridge between Linear Algebra and Quantum Mechanics.

Boundary: long-form explanation rather than a complete course or exercise system.

### Electromagnetism

#### USTC School of the Gifted Young — 大学物理《电磁学》

Destination: `https://www.bilibili.com/video/BV1ki4y1A7Mh/`

Observed basis:

- official account of the University of Science and Technology of China School of the Gifted Young;
- 116 lectures from an actual 2020 class;
- identifiable instructor and textbook;
- sequence through electrostatics, dielectric media, magnetism, induction, circuits, Maxwell equations, and waves.

Role: complete Chinese undergraduate route.

Boundary: does not replace the electronic-structure-specific treatment of periodic electrostatics, Coulomb kernels, potential references, or response functions.

#### 大T-Peachsea — 普通物理学—电磁学

Destination: `https://www.bilibili.com/video/BV1Kk4y1e7He/`

Observed role: completed handwritten derivation sequence with detailed examples.

Role: slow calculation-following supplement.

Boundary: the creator presents the work as an independent undergraduate project; technical details should be checked against established textbooks.

### Solid-state physics

#### National University of Defense Technology — 简明固体物理

Destination: `https://www.icourse163.org/course/NUDT-1206139804`

Observed scope: crystal structure, lattice vibrations, free-electron theory, and band theory in roughly ten video hours, with a course-team statement that the route is intended as a lower-barrier introduction.

Role: compact institutional entry route.

Boundary: not a complete treatment of many-body response, magnetism, topology, disorder, or advanced transport.

#### B站物院の固体物理

Destination: `https://www.bilibili.com/video/BV1Hs4y1n7T8/`

Observed scope: eight concise chapters with paired exercises on crystal structure, reciprocal lattices and diffraction, bonding, lattice vibrations, phonon thermodynamics, free-electron gas, bands, and semiconductors.

Role: compact review and topic-repair route.

Boundary: compressed presentation rather than proof- and derivation-level study.

### Density-functional and Kohn–Sham theory

#### 孙老师讲物理 — 密度泛函理论（2025年5月）

Representative destination: `https://www.bilibili.com/video/BV1spj4zgEv3/`

Observed six-part scope connects Thomas–Fermi, Thomas–Fermi–Dirac, Kohn–Sham equations, Hohenberg–Kohn variation, and local-density approximation.

Role: Chinese narrative bridge from early density models to practical DFT language.

Boundary: the sequence combines DFT foundations, Kohn–Sham construction, and LDA; the Atlas keeps these responsibilities separated.

#### `tjz21/DFT_PIB_Code`

Destination: `https://github.com/tjz21/DFT_PIB_Code`

Observed basis:

- MIT license;
- interactive Jupyter and Colab notebooks;
- worksheet and offline route;
- particle-in-a-box, molecular, and Kohn–Sham/SCF examples;
- LDA and PBE options;
- associated peer-reviewed Journal of Chemical Education article.

Role: beginner-friendly executable bridge into Kohn–Sham potentials and SCF iteration.

Boundary: pedagogical models and successful notebook execution do not establish production-material accuracy or scientific convergence.

#### `JuliaMolSim/DFTK.jl`

Destination: `https://github.com/JuliaMolSim/DFTK.jl`

Observed basis:

- MIT license;
- active 2026 releases at review time;
- plane-wave DFT toolkit emphasizing numerical and algorithmic transparency;
- tutorials separating model, basis, cutoff, k sampling, and SCF solution.

Role: advanced source-level bridge linking Kohn–Sham, SCF, plane-wave methods, and numerical analysis.

Boundary: requires Julia and substantial numerical maturity; it is not a zero-background course or material-validation certificate.

### Variational and real-space numerics

#### `JSchoeberl/iFEM`

Destination: `https://github.com/JSchoeberl/iFEM`

Observed basis: interactive Jupyter-book finite-element course from TU Wien contributors, covering weak formulations, Sobolev spaces, finite elements, iterative methods, multigrid, Maxwell problems, and time-dependent equations.

Role: rigorous interactive bridge from Differential Equations and Functional Analysis to real-space discretization.

Boundary: not an electronic-structure course; Hamiltonians, pseudopotentials, SCF, and observable-specific convergence remain separate responsibilities.

## Deferred and rejected source classes

This pass does not admit:

- third-party university-course reuploads or “restored” mirrors when the intended source is unclear;
- textbook-download bundles or pages centered on distributing copyrighted files;
- marketing-first VASP or DFT training pages without an inspectable syllabus and responsibility boundary;
- exam-cram fragments that optimize only for a test;
- translated notes with unresolved permission or provenance;
- stale tutorials whose software versions and assumptions are not maintained;
- repositories that are useful software but do not provide a learning route for the named Theory gap;
- resources justified only by play count, follower count, stars, or institutional reputation.

Commercial resources are not automatically rejected. They are deferred when authorship, syllabus, access, technical scope, and recommendation role cannot be inspected independently of a sales page.

## Integration decision

The selected routes are published in the existing `/theory/` entrance under `Reviewed Study Routes`. They remain grouped by Theory responsibility and link back to the relevant subject pages.

The `/reference/` entrance is restored to its empty reviewed baseline. Reference should be written only after the wider resource collection and page-level placements have stabilized.

No new route, dependency, client runtime, search index, data registry, or page-count change is introduced.

## Maintenance boundary

This is a dated scope and reachability review, not a permanent endorsement. Bilibili playlists, Zhihu articles, MOOC sessions, GitHub releases, authorship statements, and licenses can change.

Future Theory resource passes should continue across Chinese university MOOCs, Bilibili, Zhihu, GitHub, Gitee, personal course sites, lecture notes, and community projects. Each pass should remain bounded by concrete Theory gaps rather than attempting to build the final Reference catalogue early.
