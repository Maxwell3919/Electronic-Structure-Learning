# Theory batch 12 acceptance

Reviewed route:

- `/theory/berry-phases-and-electronic-topology/`

## Content acceptance

The page is acceptable only if it preserves the following boundaries.

### Gauge and occupied-subspace foundations

- Introduces phase gauge freedom for isolated Bloch states before defining the Berry connection.
- Distinguishes the gauge-dependent connection from closed-loop phases, curvature, projectors, and declared gauge-invariant quantities.
- Uses occupied-subspace or non-Abelian language when occupied bands cross or mix.
- Does not track topology through arbitrary energy-ordered band labels at degeneracies.

### Polarization, curvature, and invariants

- Covers Berry phases, Berry curvature, modern polarization, polarization branches, and polarization quanta.
- Covers Chern numbers only with a stated dimensionality, gap, filling, and occupied subspace.
- States that a gap closing can change or invalidate the invariant at a transition.
- Does not equate a unit-cell dipole with a unique bulk polarization in a periodic crystal.

### Wannier and Wilson-loop bridge

- Distinguishes atom-centred basis functions, canonical Kohn–Sham orbitals, and Wannier functions.
- Covers overlap matrices, Wilson loops, hybrid Wannier centres, and localization obstructions.
- States projection, window, disentanglement, mesh, symmetry, and interpolation dependencies.
- Does not treat one Wannier90 run or tutorial example as scientific validation.

### Topology evidence

- Uses two-band models as explanatory models with explicit Hamiltonian, symmetry, filling, and gap assumptions.
- Treats band inversion and symmetry indicators as clues or constrained diagnostics rather than universal proofs.
- Treats bulk invariants and boundary spectra as related but separately validated objects.
- Requires boundary localization, termination, finite-size, full boundary-BZ, and projected-bulk checks when edge or surface bands are used.
- Does not infer strongly interacting topological order from ordinary independent-particle or Kohn–Sham bands.

### Convergence and reproducibility

- Requires the invariant, protecting assumptions, dimensional setting, electron count, selected subspace, Hamiltonian, structural model, spin/SOC/magnetic state, and gap conditions to be stated.
- Requires k-space mesh, loop discretization, branch tracking, subspace/window choices, and Wannier interpolation error to be checked where relevant.
- Requires slab/ribbon thickness, termination, vacuum, potential, k sampling, and localization to be checked for boundary calculations.
- Does not present one smooth plot or integer-looking numerical output as observable convergence.

## Source and copyright acceptance

- Public prose and MathML are original site content.
- No textbook pages, figures, tables, lecture transcripts, screenshots, tutorial solutions, or exercise solutions are stored.
- External links point to official Cambridge, MIT OpenCourseWare, and Wannier90 destinations reviewed for this batch.
- Paid or institutional resources and implementation-only software documentation are labelled accordingly.
- Source roles and limitations are recorded in `docs/theory-batch-12-sources.md`.

## Technical acceptance

- The page is an ordinary static Astro page.
- Every mathematical expression uses native MathML with one TeX annotation inside `<semantics>`.
- Display mathematics uses `.math-display` and remains contained at narrow widths.
- No MathJax, KaTeX, client JavaScript, packaged font, new dependency, CMS, search index, content registry, or standalone interactive Learning Map is introduced.
- The Theory directory, README, AGENTS, architecture, source/build validator, browser smoke, and build budget include the new route.
- The production build contains exactly forty-five HTML documents, including thirty-nine mathematical Theory pages and the general 404 page.
- Zero JavaScript and zero packaged fonts remain hard requirements.

## Directory-completion boundary

After this batch, every subject explicitly listed in the current two-level Theory directory has an individually reviewed page. This is directory responsibility completion, not proof that every page is exhaustive, every second-round resource comparison is complete, or learning effectiveness has been tested. The Learning Map remains a relationship layer and does not become a separate fixed curriculum or client-side application.

## Evidence boundary

Passing source validation, Astro checking, production build, internal-link validation, MathML serialization checks, build-budget checks, and browser smoke establishes only the covered source and runtime behavior. It does not independently validate every scientific statement, choose a physical Bloch gauge, certify a Wannier subspace, reproduce a topological invariant, prove a material classification or bulk–boundary correspondence, establish interacting topology, or measure educational effectiveness.
