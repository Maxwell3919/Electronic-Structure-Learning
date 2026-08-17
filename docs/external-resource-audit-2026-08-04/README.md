# Electronic Structure Atlas — full-site external resource audit

Review date: 2026-08-04

Repository baseline reviewed: `8906164574c88a6f76207c6b1cfe77a39de76b34`

Current production site: <http://188.255.156.20/Electronic-Structure-Learning/>. The GitHub Pages deployment named in the original 2026-08-04 audit context was retired on 2026-08-17.

This directory is a research and implementation backlog. It does **not** modify public pages. Talos should read the current remote repository, synchronize any stale local checkout, verify every destination again, and then decide which recommendations belong on which page.

## Files in this audit

- [`theory-resource-backlog.md`](theory-resource-backlog.md): page-by-page recommendations for all thirty-nine Theory subjects.
- [`methods-tools-reference-backlog.md`](methods-tools-reference-backlog.md): recommendations for Methods, Computational Tools, Reference, and the minimal Home ecosystem map.
- [`talos-integration-prompt.md`](talos-integration-prompt.md): a ready-to-use Talos goal-mode prompt, including safe local/remote synchronization.

## Current site assessment

The current repository contains Home, thirty-nine individually reviewed Theory pages, Methods, Computational Tools, Reference, and a 404 page. The scientific page taxonomy is already broad enough for the present project. The next resource phase should improve the **quality and diversity of learning routes**, not create more topics merely to host links.

### Theory

Theory is the strongest section. Most pages already contain a coherent explanation and at least one textbook, course, official documentation route, or implementation bridge. Coverage is uneven:

- several pages have a strong English theory route but little executable or visual material;
- several pages have official software documentation but no continuous course;
- Chinese material is concentrated in a subset of subjects;
- advanced topics often have software tutorials but no explicit bridge from formalism to convergence and interpretation;
- some pages contain valuable implementation resources whose software version must remain visible.

### Methods

Methods is intentionally a concise conceptual map. It should not become a long directory of codes, papers, and tutorials. At most, each method family should receive one or two highly selective external gateways, while detailed software and workflow resources should be routed to Computational Tools or Reference.

### Computational Tools

This is the largest current resource gap. The page is still a placeholder. A useful version should classify tools by scientific role and retain the distinction among:

- electronic-structure engines;
- structure and symmetry utilities;
- workflow and provenance systems;
- databases and interoperability layers;
- phonon, electron–phonon, transport, topology, defect, surface, and bonding tools;
- visualization and post-processing;
- HPC, environments, testing, and reproducibility infrastructure.

The page should not imply that installing or successfully running a tool validates a calculation.

### Reference

Reference is also a placeholder. It should become a reviewed index of durable resources rather than a second copy of every page-local link. Recommended collections are:

- core textbooks and open lecture notes;
- course and school hubs;
- official code tutorial portals;
- benchmark and verification collections;
- materials, molecular, crystallographic, and spectroscopic databases;
- workflow, provenance, and FAIR-data resources;
- interpretation tools and their methodological references.

## Review criteria

A recommendation was accepted into this backlog only when it met most of the following conditions:

1. **Primary or maintained destination.** Prefer the institution, project, author, code, database, or creator-maintained page.
2. **Inspectable scope.** The syllabus, tutorial sequence, documentation tree, notebooks, or dataset description can be inspected before recommendation.
3. **Distinct role.** The resource fills a learning, implementation, validation, or reference role not already adequately served on the target page.
4. **Explicit boundary.** The recommendation states what it does not validate.
5. **Access clarity.** Open, enrolment-gated, commercial, version-bound, or platform-dependent access is identified.
6. **Copyright restraint.** Link to resources; do not copy lectures, figures, textbook text, datasets, exercises, or restricted files into the repository.
7. **Recency awareness.** Current documentation is preferred for software use. Older schools may remain valuable for theory but must retain their date and version boundary.
8. **No popularity-only acceptance.** Search ranking, stars, views, institution prestige, and community familiarity are discovery signals, not scientific validation.

## Priority labels

- **P0 — structural gap:** fills a currently empty or seriously underdeveloped site section, especially Computational Tools and Reference.
- **P1 — high-value addition:** provides a distinct, well-maintained course, school, executable notebook, benchmark, or implementation bridge.
- **P2 — specialist option:** valuable for advanced readers, alternative codes, or specific observables; integrate only when the page remains readable.
- **P3 — reference-only:** record in Reference or this audit, but do not add page-local text unless a future need appears.

## Existing verified anchors — do not duplicate

The current site already contains or has recently reviewed the following resources. Talos must re-read the live page before adding anything and should not create a second paragraph for the same destination:

- 3Blue1Brown linear algebra and MIT 18.06;
- MIT 18.303 and a creator-uploaded Chinese PDE route;
- NYCU open Fourier course;
- NPTEL/IMSc Functional Analysis by S. Kesavan and iFEM;
- a reviewed Chinese group-theory sequence;
- USTC and independent Chinese electromagnetism routes;
- B站物院 quantum mechanics, a Zhihu linear-algebra-to-QM bridge, and the Renmin University spin/SOC unit;
- HUST thermodynamics/statistical physics and David Tong statistical physics;
- David Tong solid-state physics and a University of Tokyo topology course;
- Nanjing University quantum chemistry and the creator-maintained Hartree–Fock sequence by 斯坦福大厨 / stanfordbshan;
- MIT inorganic chemistry and NPTEL surface chemistry;
- École Polytechnique DFT MOOC, Burke Group Learn DFT, and University of Strasbourg Kohn–Sham teaching material;
- the Chinese DFT/SCF algorithm orientation route by 拜访北极熊;
- DFT-FE, Materials Cloud/Wannier90 schools, SIESTA, FHI-aims, Basis Set Exchange, and the existing plane-wave/local-orbital implementation bridges already cited on pages;
- PseudoDojo/SSSP/QE/GPAW/ABINIT resources already present on the pseudopotential page and the Chinese 于博微课 orientation;
- the open 2026 k-point/smearing benchmark and Materials Cloud archive;
- Materials Cloud/QE noncollinear and SOC school, Bilbao magnetic-tools tutorials, and the existing GPAW/Octopus magnetic implementation links;
- IIT Bombay/NPTEL linear-response material;
- BerkeleyGW, Yambo, and the UT Austin 2024 GW/BSE school;
- Materials Cloud/Wannier90 schools and existing topology implementation routes already present.

This list is a deduplication warning, not an assertion that every resource is sufficient or permanently live.

## Global findings and recommended sequence

### Wave A — P0 site infrastructure without changing architecture

1. Build a curated Computational Tools directory from the P0 entries in the tools backlog.
2. Build a restrained Reference index organized by resource role, not by alphabetical title.
3. Keep Home minimal; add only a small ecosystem map if the current design supports it.
4. Keep Methods concise and add only gateway links that genuinely help readers move from a method name to a maintained learning route.

### Wave B — Theory gaps with the highest educational return

1. Numerical analysis, SCF, discretization, and plane-wave/real-space implementation.
2. Quantum chemistry, bonding analysis, and correlated wavefunction methods.
3. DFPT, electron–phonon coupling, transport, and finite-temperature methods.
4. Defects, surfaces/interfaces, and magnetic-state construction.
5. Berry phase, topology, GW/BSE, and other advanced subjects.

### Wave C — language and format diversity

For pages already strong in English, search specifically for:

- source-clear Chinese university or creator-maintained long-form courses;
- executable Jupyter notebooks with declared licenses;
- official school recordings with slides and exercises;
- visual or interactive resources that do not collapse interpretation into software operation.

Do not lower source or scope standards merely to increase language diversity.

## Integration rule

The backlog is deliberately larger than the public site should become. Talos must select resources rather than paste the inventory. A typical Theory page should usually expose a small combination such as:

- one rigorous spine;
- one accessible or Chinese route;
- one executable or visual bridge;
- one official implementation or benchmark route where relevant.

Additional alternatives belong in Reference or remain in this audit.
