# Theory resource review — Batch G · Advanced theory

**Review date:** 2026-08-04  
**Scope:** `relativistic-electronic-structure-spin-and-magnetism`, `many-body-physics`, `linear-response-and-excited-states`, `many-body-perturbation-theory-and-quasiparticles`, and `atomic-and-molecular-physics`.

## Existing coverage and gaps

The pages already offered bounded anchors: Martin or Hedin where appropriate, MIT 8.421/8.513, Octopus, and BerkeleyGW. The review sought complementary roles rather than a larger list: a named magnetism course note that connects spin–orbit concepts to magnetic response; an identifiable Chinese-authored many-body bridge; a more specific account of the maintained Octopus response sequence; an independent GW/BSE code route; and freely visible spectroscopy material that connects atomic/molecular states to measured spectra.

## Accepted resources

| Page | Resource and source | Coverage and intended reader | Added value and limit |
| --- | --- | --- |
| Relativistic electronic structure, spin, and magnetism | [Shingo Katsumoto, University of Tokyo, *Lecture note on Magnetism*](https://note-collection.issp.u-tokyo.ac.jp/katsumoto/magnetism2022/note01-14_en.pdf) | A named 2022 course note hosted by the Institute for Solid State Physics. Its opening material covers spin magnetic moments, the Dirac/SOC connection, Zeeman response, localized electrons, and later collective magnetism. | Adds a theory route missing from the page’s code documentation. It is not a relativistic-DFT manual or a magnetic-configuration search protocol. |
| Many-body physics | [Wei Zhu, Westlake University, *Lecture Notes on Modern Condensed Matter Physics*](https://quantum-many-body-theory.lab.westlake.edu.cn/files/modern_CMP_Introduction.pdf) | An openly posted named-author note for advanced graduate readers, explicitly requiring quantum mechanics, statistical mechanics, and solid-state physics and introducing interacting particles and Green functions. | Adds a Chinese-English independent-author bridge. It intentionally remains an introduction to basic techniques, not a complete diagrammatic or computational many-body curriculum. |
| Linear response and excited states | [Octopus Optical Response tutorials](https://octopus-code.org/main/tutorials/2-optical-response/) | Current documentation maintained by the Max Planck Institute for the Structure and Dynamics of Matter, with distinct time-propagation, Casida, Sternheimer, triplet, and symmetry lessons. | The existing link was updated to the maintained tutorial index and its role clarified. It is code-specific and assumes an Octopus ground-state setup. |
| MBPT and quasiparticles | [Yambo Project tutorials](https://yambo-code.org/tutorials/index.php) | An official tutorial suite with visible GW, lifetime/spectral-function, TDDFT, and BSE topics. Intended for readers who already understand mean-field input and Green-function/response foundations. | Adds a second independent implementation path alongside BerkeleyGW. Some material is version-sensitive and needs reference databases; it cannot certify convergence or validate another code. |
| Atomic and molecular physics | [MIT OCW 5.80, Robert Field, *Small-Molecule Spectroscopy and Dynamics*](https://ocw.mit.edu/courses/5-80-small-molecule-spectroscopy-and-dynamics-fall-2008/resources/lecture-notes/) | A graduate course with accessible lecture-note/video sequence on atomic spectra, Born–Oppenheimer separation, transitions, rotations, vibrations, coupling, symmetry, and molecular electronic spectra. | Adds a complete spectroscopy route beyond the publisher book and atomic/optical course. Its small-molecule focus does not replace broad atomic-structure training. |

Each accepted source was opened at its institutional or project origin. Authorship/maintainer identity, visible content structure, audience, prerequisites, coverage, access condition, and limitation were checked. No added route is an exercise or solution recommendation.

## Deferred or rejected candidates

- An archived UCSB relativistic-quantum-mechanics course description gives a clear syllabus but no inspectable course materials; it was not presented as a full learning route.
- MIT 8.514 is a strong named course with lecture notes, but it overlaps the two MIT 8.513 routes already on the many-body page. The non-overlapping Westlake note was preferred for this batch.
- DFTK/Yambo walkthroughs centred on explicit exercises or large downloadable reference bundles were not added to the linear-response page; the maintained Octopus sequence is the closer existing learning role.
- Unattributed mirrors, course aggregators, and search-result snippets without clear original authorship or a visible curriculum were excluded.

## Source and scientific boundaries

No external body text, figures, videos, inputs, output files, or datasets were copied. Openly hosted notes and documentation retain their original copyright and version terms. Reproducing a code tutorial does not establish a material’s excitation spectrum, magnetic ground state, SOC treatment, GW self-energy, BSE convergence, or experimental agreement.

## Remaining gaps

- A maintained Chinese-language route devoted specifically to relativistic electronic structure/SOC in solids remains desirable.
- A source-reviewed conceptual treatment that links linear-response functions, TDDFT kernels, and MBPT/BSE without immediately becoming code documentation would complement the current routes.
- The pages remain deliberately bounded: they do not prescribe a universal functional, starting point, broadening, magnetic order, k-grid, dielectric cutoff, or quasiparticle workflow.
