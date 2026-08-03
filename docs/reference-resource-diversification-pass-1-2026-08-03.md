# Reference resource diversification — pass 1

Review date: 2026-08-03

Website baseline: `69a4e8675dc4f641850a03a4f51db03d75d44ab5`

## Decision

The Reference entrance should not treat MIT OpenCourseWare, major publishers, or famous institutions as the only credible learning routes. Institutional courses remain valuable, but independent creators, community teaching teams, long-form Chinese explanations, and transparent open-source repositories may be equally useful when their authorship, structure, technical scope, access, and limitations can be reviewed.

The first pass deliberately avoids a popularity ranking and a large resource registry. Each accepted item must occupy a distinct learning role and must state what it does not replace.

## Review criteria

A resource was considered for inclusion only when the following could be checked:

- an identifiable author, course team, institution, or repository owner;
- evidence that the linked destination is the intended source rather than a mirror, download bundle, or unattributed reupload;
- enough visible syllabus, playlist, notebook, documentation, or repository structure to determine its scope;
- a clear match to one or more current Theory responsibilities;
- a useful role that is not already served by another accepted item;
- a stated language, prerequisite, platform, software, licensing, access, or completeness boundary;
- no dependence on follower count, play count, stars, or university prestige as a quality proxy.

Popularity and repository activity were used only to discover candidates. They were not acceptance criteria.

## Accepted Chinese-language university routes

### USTC School of the Gifted Young — Electromagnetism

Destination: `https://www.bilibili.com/video/BV1ki4y1A7Mh/`

Observed basis:

- published by the official Bilibili account of the University of Science and Technology of China School of the Gifted Young;
- 116 lectures from an actual 2020 class;
- visible sequence from electrostatics and dielectric media through magnetism, induction, gauge ideas, Maxwell equations, waves, energy, and momentum;
- identifiable instructor and textbook.

Accepted role: complete Chinese undergraduate route for the Electromagnetism page.

Boundary: long course; not a quick repair resource and not a substitute for electronic-structure-specific periodic electrostatics or dielectric-response methods.

### National University of Defense Technology — Concise Solid-State Physics

Destination: `https://www.icourse163.org/course/NUDT-1206139804`

Observed basis:

- official Chinese University MOOC destination;
- marked as a nationally recognized high-quality online course;
- approximately ten hours;
- visible core syllabus: crystal structure, lattice vibrations, free-electron theory, and band theory;
- course team explicitly presents it as a lower-barrier introduction.

Accepted role: compact institutional entry to Solid-State Physics.

Boundary: its concise scope does not cover the full modern range of many-body response, magnetism, topology, disorder, or advanced transport.

## Accepted independent Bilibili routes

### Bilibili Physics School — Quantum Mechanics

Destination: `https://www.bilibili.com/video/BV1yh4y1A7ja/`

Observed basis:

- self-produced community teaching project rather than a third-party university reupload;
- playlist covers wavefunctions, Schrödinger equations, model potentials, operators, Hilbert-space notation, representations, hydrogen, spin, angular momentum, and identical particles;
- chapters are compact and connected to a broader undergraduate physics collection.

Accepted role: fast Chinese first pass or structured review before a longer textbook/course route.

Boundary: short lectures cannot replace sustained exercise work, careful theorem conditions, or a full two-semester sequence.

### Bilibili Physics School — Solid-State Physics

Destination: `https://www.bilibili.com/video/BV1Hs4y1n7T8/`

Observed basis:

- self-produced eight-chapter sequence;
- topics include crystal structure, reciprocal lattices and diffraction, crystal binding, lattice vibrations, phonon thermodynamics, free-electron gas, bands, and semiconductors;
- most chapters have paired short exercise videos.

Accepted role: concise review route that connects the Atlas crystallography, Fourier, phonon, and band responsibilities.

Boundary: highly compressed; not an advanced derivation course or evidence source for material-specific calculations.

### 大T-Peachsea — General Physics: Electromagnetism

Destination: `https://www.bilibili.com/video/BV1Kk4y1e7He/`

Observed basis:

- completed independent handwritten course;
- detailed derivations and examples;
- six visible units spanning electrostatics and steady currents, magnetostatics, induction, media, circuits, Maxwell theory, and waves;
- creator openly describes the work as an independent undergraduate project.

Accepted role: calculation-following supplement for learners who need derivations at a slower pace.

Boundary: the creator's own educational stage is part of the review record; use as a supplement and check technical details against established textbooks.

### 孙老师讲物理 — Density Functional Theory, May 2025

Destination: `https://www.bilibili.com/video/BV1spj4zgEv3/`

Observed basis:

- six-part Chinese sequence;
- visible topics include Thomas–Fermi, Thomas–Fermi–Dirac, Kohn–Sham equations, Hohenberg–Kohn variation, and local-density approximation;
- coherent narrative from early density models to practical DFT language.

Accepted role: compact conceptual bridge into DFT Foundations.

Boundary: the series intentionally combines foundational theorems, Kohn–Sham construction, and LDA. The Atlas preserves those as separate responsibilities and does not inherit the video's organization as its architecture.

## Accepted Zhihu conceptual bridge

### PeiLingX — From Linear Algebra to Quantum Mechanics

Representative destination: `https://www.zhihu.com/tardis/zm/art/169805550`

Observed basis:

- identifiable author with a long-form series;
- representative lessons connect Stern–Gerlach experiments, basis changes, probability distributions, Fourier transforms, coordinate/momentum representations, and uncertainty;
- articles link to a larger directory and adjacent lessons.

Accepted role: Chinese conceptual repair between Linear Algebra and Quantum Mechanics.

Boundary: a long-form explanatory series is not a complete university course, and the linked representative article does not provide a full exercise system. Equations and derivations should be checked against standard texts when used beyond conceptual orientation.

## Accepted interactive GitHub routes

### `tjz21/DFT_PIB_Code`

Destination: `https://github.com/tjz21/DFT_PIB_Code`

Observed basis:

- MIT license;
- three interactive Jupyter/Colab notebooks plus offline route and worksheet;
- particle-in-a-box, molecular frontier-orbital, and Kohn–Sham DFT examples;
- exposes Kohn–Sham potential terms, density/eigenvalue changes through SCF, and LDA/PBE choices;
- accompanied by a peer-reviewed Journal of Chemical Education publication.

Accepted role: beginner-friendly executable bridge from single-particle quantum mechanics to Kohn–Sham and SCF ideas.

Boundary: pedagogical model systems and notebook completion do not validate production-material accuracy or real-code convergence.

### `JuliaMolSim/DFTK.jl`

Destination: `https://github.com/JuliaMolSim/DFTK.jl`

Observed basis:

- MIT license;
- actively maintained academic project with more than 1,500 commits and current 2026 releases at review time;
- explicit emphasis on simplicity, numerical development, and plane-wave DFT transparency;
- documentation separates physical model, plane-wave basis, cutoff, k grid, and SCF result;
- tutorials and basic examples are directly linked from the repository.

Accepted role: advanced source-level and algorithmic bridge for Kohn–Sham, SCF, plane-wave, and numerical-analysis pages.

Boundary: requires Julia and substantial numerical maturity; it is a real toolkit rather than a zero-background course, and successful execution does not provide scientific validation for a target material.

### `JSchoeberl/iFEM`

Destination: `https://github.com/JSchoeberl/iFEM`

Observed basis:

- interactive finite-element course prepared by Joachim Schoeberl and colleagues at TU Wien;
- Jupyter notebooks and Jupyter Book;
- online Binder/JupyterLite routes;
- covers finite-element theory, weak formulations, Sobolev spaces, iterative methods, multigrid, Maxwell, and time-dependent problems.

Accepted role: rigorous interactive bridge from Differential Equations and Functional Analysis to real-space discretization.

Boundary: not an electronic-structure course; electronic Hamiltonians, pseudopotentials, SCF, and observable convergence must be learned elsewhere.

## Candidates not accepted in pass 1

The review rejected or deferred the following source classes:

- university lectures uploaded by third parties as downloads, restorations, or unattributed mirrors;
- pages explicitly centered on downloading textbooks or bundled copyrighted material;
- marketing-first VASP/DFT training pages without an inspectable syllabus and scientific responsibility boundary;
- exam-cram fragments that optimize for a test rather than the Theory responsibility;
- translated notes or repositories with unresolved copyright/licensing provenance;
- old software tutorials whose versions and assumptions were not maintained;
- research software repositories that do not provide a learning route for the selected Theory topic;
- resources recommended only because of play count, follower count, stars, or institutional branding.

A commercial resource is not rejected merely because it is paid. It is deferred when authorship, syllabus, access, technical scope, and recommendation role cannot be inspected independently of the sales page.

## Public integration decision

The first pass is published centrally in `/reference/` rather than copied into multiple Theory pages. This avoids repeated links and keeps the Atlas readable. Each entry links back to the Theory responsibilities it supports.

A resource may later be promoted into an individual Theory page after actual use shows that it fills a durable gap there. Promotion should not happen merely because the resource survived this discovery review.

No route, dependency, client runtime, search index, content registry, or page-count change is required.

## Maintenance boundary

This is a dated reachability and scope review, not a permanent endorsement. Bilibili playlists, Zhihu articles, MOOC enrollment states, repository releases, authorship information, and licenses can change. Periodic checks should distinguish:

- destination still reachable;
- intended author/source still identifiable;
- public scope still matches the review;
- access and license boundaries unchanged;
- technical content still suitable for its stated role.

Future passes should search Chinese university MOOCs, Bilibili, Zhihu, GitHub, Gitee, personal course sites, lecture notes, and community repositories without imposing a famous-institution filter. They should remain bounded by concrete Theory gaps rather than attempting to catalogue every available course.
