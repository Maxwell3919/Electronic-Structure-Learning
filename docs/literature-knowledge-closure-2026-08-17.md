# Literature v1 knowledge closure

This audit freezes the current Literature corpus at 95 scientifically reviewed papers and 1,379 curated annotations. The 16 acceptance fixtures remain test data and are excluded from every scientific count. The Records coverage manifest and annotation files remain the authority; the generated Atlas concept map records the stable hash of the manifest's paper-state array (excluding its Atlas commit and generation timestamp) but does not replace them.

## Normalized vocabulary

The paper corpus is mapped to 44 reviewed concepts. The vocabulary is intentionally smaller than the papers' terminology: it normalizes equivalent language, separates methods from observables, and does not create tags from arbitrary keywords. Every paper maps to at least two concepts, and every concept links to an Atlas canonical explanation plus a small number of useful source annotations.

## Coverage audit

The responsibility audit found four material gaps and repaired them in the canonical Methods/Core locations:

- dynamical stability now distinguishes a Γ-point check from full-Brillouin-zone evidence, treats the two-dimensional flexural branch explicitly, and states the harmonic-model boundary;
- the DFPT-to-Tc chain now connects phonons and matrix elements to α²F, λ, ωlog, Allen–Dynes and Eliashberg without treating those contractions as equivalent evidence;
- DFT+U and magnetic-exchange guidance now separates localized-subspace choices, candidate magnetic states, exchange mapping and finite-temperature claims;
- interface guidance now separates band alignment, charge redistribution and hybridization.

Core already carried the continuous physical argument, Foundations already carried the prerequisite theory, and Methods already carried execution-independent interpretation boundaries. No full scientific explanation was duplicated strongly enough to justify deletion. Contextual repetitions were retained only where they introduce a local question and link to the canonical explanation. Active links to the DFT Research Workflow were corrected to the Newt/Talos production endpoint; the workflow remains the authority for execution, convergence, acceptance and evidence preservation.

## Cross-paper synthesis

Twelve bounded syntheses answer recurring questions rather than reproducing paper summaries:

1. Dynamical stability in two-dimensional materials
2. From DFPT to a phonon-mediated Tc
3. What establishes conventional superconductivity?
4. SOC and Ising superconductivity
5. Fermi-surface evidence versus band-path evidence
6. Interlayer coupling as a control parameter
7. DFT+U in low-dimensional magnetism
8. Effective Hamiltonians and ferroelectric transitions
9. Intercalation as an electronic-structure control knob
10. Soft modes, nesting, and charge order
11. Evidence for two-dimensional superconductivity
12. From materials prediction to evidence

Each page states the question, mechanism, agreements, differences, evidence ceiling, canonical Atlas concepts and a short key-paper list. The relation is bidirectional: paper Readers expose their normalized concepts, concept pages list papers, and synthesis pages connect both.

## Annotation quality sample

Fifteen papers were sampled across long reviews, foundational method papers, short materials studies, two-dimensional superconductivity, DFPT, DFT+U, ferroelectricity, intercalation, variant/SI packages, excitons and quantum geometry. The audit recomputed fixture exclusion and checked scientific counts, UUID/content uniqueness, all four evidence labels, explicit limitation coverage, expected critical-figure/equation coverage and variant provenance. No systematic defect was found, so the 1,379 annotations remain frozen rather than being rewritten.

The machine audit is `npm run audit:literature-knowledge`; it fails if the frozen counts drift, a paper loses concept coverage, the vocabulary leaves the 30–60 range, a sampled annotation set loses its evidence boundary, or a fixture enters the scientific count.
