# Theory community resource expansion — Batch 10

Review date: 2026-08-04

Website baseline: `fa4ac816f6fe70caa362628d65d8cdceb99c11f4`

Scope: page-local additions for Brillouin-Zone Sampling and Relativistic Electronic Structure, Spin, and Magnetism. Methods, Reference, the Theory index, and the site architecture remain outside this batch.

## Review method

Open-access research, project-maintained school archives, and institutional crystallographic tutorials were used for discovery. Public inclusion required a primary or maintained destination, a distinct role not already filled on the page, and an explicit limitation. Publication venue, school prestige, code adoption, and tool coverage were treated as evidence about provenance and scope rather than proof that a parameter choice or magnetic model is valid for a new material.

## Accepted additions

| Theory page | Resource | Role and boundary |
| --- | --- | --- |
| Brillouin-Zone Sampling | de Miranda Nascimento et al., [Accurate and efficient protocols for high-throughput first-principles materials simulations](https://www.nature.com/articles/s41524-026-02097-8), with the [Materials Cloud data archive](https://archive.materialscloud.org/record/2025.62) | A 2026 open-access study and reproducible data record that quantify the coupled effects of k-point sampling and smearing on energies, forces, and other solid-state quantities across broad material classes. It provides a modern evidence route for error control and efficiency tradeoffs, but population-level protocols do not replace observable-specific convergence for a new system. |
| Relativistic Electronic Structure, Spin, and Magnetism | Materials Cloud / Quantum ESPRESSO, [Summer School on Materials Modeling from First Principles: Theory and Practice](https://www.materialscloud.org/learn/sections/Kr5WSY/summer-school-quantum-espresso-santa-barbara-2009) | A maintained school archive containing Andrea Dal Corso’s three-part introduction to noncollinear magnetism and spin–orbit coupling, with slides and exercises, alongside open-shell magnetism lectures. It supplies the missing solid-state implementation bridge, but its 2009 software syntax and examples are version-bound and do not establish a magnetic ground state or dataset suitability. |
| Relativistic Electronic Structure, Spin, and Magnetism | Bilbao Crystallographic Server, [Magnetic Tools tutorials](https://cryst.ehu.es/wiki/index.php/Category:Tutorials_on_tools) | An institutional tutorial index for magnetic-space-group generators, Wyckoff positions, point groups, tensors, propagation-vector subgroups, magnetic models, irreducible representations, and MAXMAGN. It closes part of the magnetic-symmetry reasoning gap, but tool output does not decide energetics, exchange parameters, SOC strength, or the physically realized order. |

## Deferred or rejected candidates

- Isolated k-point or smearing recommendations without a declared error model, material set, target observable, or convergence boundary were excluded.
- High-throughput defaults were not presented as universal settings for individual calculations.
- Short SOC keyword demonstrations without noncollinear-state, core-dataset, symmetry, and competing-solution context were excluded.
- Magnetic-structure databases were not treated as courses when they did not explain magnetic-group reasoning or model construction.
- Reuploaded lectures and unofficial copies were excluded when a maintained project or institutional archive was available.

## Source and access boundaries

The npj Computational Materials article is open access and the Materials Cloud record is the authors’ associated data archive. Materials Cloud maintains the Quantum ESPRESSO school page and links recordings, slides, and exercises. The Bilbao Crystallographic Server maintains the tutorial index and tool documentation. External files, software versions, school recordings, and tool interfaces can change. No article body, figures, videos, slides, exercises, datasets, or tutorial files were copied into the repository.

## Validation boundary

This review verifies source identity, visible scope, and the stated learning role of each destination on 2026-08-04. It does not independently reproduce the published benchmarks, validate every school derivation or exercise, audit every Bilbao program, or endorse future revisions. Completing these routes does not establish k-point convergence, smearing independence, magnetic-state completeness, relativistic-dataset compatibility, magnetic symmetry, or a material-specific scientific claim.
