# Theory quality audit — pass 3: Periodic Physics

Review date: 2026-08-03

Website baseline: `338217169717f5846b7d1adb5333c43fda65896a`

This document continues `docs/theory-quality-audit-2026-08-03.md`. It uses the same scientific, responsibility-boundary, derivation-continuity, mathematical-presentation, evidence, cross-page-coherence, and reader-value criteria. It does not impose one visible page template or require equal page length.

## Scope

The third pass reviewed:

- Solid-State Physics;
- Crystallography;
- Fourier Analysis;
- Group Theory and Symmetry;
- Relativistic Electronic Structure, Spin, and Magnetism;
- Berry Phases and Electronic Topology.

The bounded evidence basis was the uploaded Theory systematic-review report, Richard M. Martin's second-edition electronic-structure text, the existing source-review records, and the current public page sources. This pass did not perform a new time-bounded network reachability audit of every external resource.

## Findings

### Solid-State Physics

Status: **Accepted without public-page modification**.

The page already:

- separates a Bravais lattice from the atomic motif and from a numerical orbital basis;
- defines reciprocal space and Bloch states before discussing bands;
- distinguishes a selected band path from a full-zone search or Brillouin-zone integration;
- distinguishes density of states from momentum-resolved dispersion;
- places phonons, dielectric screening, and magnetism as distinct collective or response sectors;
- assigns detailed geometry, symmetry, and numerical sampling to their dedicated pages.

No concrete scientific, responsibility, or MathML defect requiring correction was found. A later learner trial should test whether the band-filling and chemical-potential discussion is sufficient for a complete beginner.

### Crystallography

Status: **Accepted without public-page modification**.

The page already:

- distinguishes lattice, motif, primitive cell, conventional cell, and coordinate convention;
- states the transformation and normalization consequences of changing cells;
- separates fractional and Cartesian coordinates;
- connects reciprocal vectors, Miller indices, diffraction, structure factors, space groups, and Wyckoff positions without merging their meanings;
- records setting, origin, symmetry-tolerance, standardization, and provenance boundaries;
- warns that imposed symmetry can suppress real structural, magnetic, charge, or soft-mode instabilities;
- separates a high-symmetry band path from full-zone integration.

No concrete scientific or MathML defect requiring correction was found. International Tables access and quotation boundaries remain a separate licensing review.

### Fourier Analysis

Status: **Accepted without public-page modification**.

The page already:

- states transform conventions and their dimensional consequences;
- distinguishes Fourier series, continuous transforms, the finite DFT, and the FFT algorithm;
- covers differentiation, convolution, distributions, periodic repetition, sampling, Nyquist limits, truncation, and aliasing;
- distinguishes reciprocal-lattice vectors from Bloch wavevectors;
- keeps plane-wave cutoffs, orbital bases, FFT grids, density grids, and interpolation grids separate.

No concrete scientific or MathML defect requiring correction was found. Circular-convolution details and FFT implementation optimization remain outside the page's current responsibility.

### Group Theory and Symmetry

Status: **Major representation-scope and selection-rule repair completed**.

Strengths retained:

- symmetry is defined relative to a specified object rather than a vague material label;
- representations, irreducible sectors, characters, projection, direct products, little groups, compatibility relations, double groups, and magnetic extensions are connected coherently;
- degeneracy and symmetry reduction are not inferred from numerical coincidence;
- imposed symmetry is explicitly bounded as a restricted search sector rather than global evidence.

Finding GT-1: the representation equation was stated generically even though the page includes antiunitary time reversal. Ordinary complex-linear representation matrices do not by themselves describe antiunitary operations.

Action completed: restricted the displayed representation equation to ordinary unitary group elements and added the corepresentation or equivalent antiunitary-formalism boundary.

Finding GT-2: the character-decomposition and character-projector formulas use finite-group sums, while the surrounding page also discusses continuous groups and infinite space groups.

Action completed: stated that the displayed sums apply to finite groups or finite point/little co-groups after translational phases are handled. Continuous groups require integration with invariant measure, while full space-group representations retain translation and wavevector dependence. The character projector is identified as projecting the isotypic component; resolving repeated copies or individual rows can require matrix-element projectors.

Finding GT-3: the selection-rule expression omitted the conjugate representation of the final state.

Action completed: replaced it with

```text
Gamma_f* tensor Gamma_O tensor Gamma_i contains Gamma_tot
```

and explained why the star can be hidden for real irreducible representations but cannot be omitted generically for complex little-group representations.

### Relativistic Electronic Structure, Spin, and Magnetism

Status: **Accepted without public-page modification; resource comparison remains pending**.

The page already:

- distinguishes scalar-relativistic, collinear spin, noncollinear spinor, constrained-moment, and SOC models;
- avoids treating a spin or relativistic switch as a generic accuracy ladder;
- connects magnetic branches to nonlinear SCF landscapes and competing cells, occupations, directions, and symmetry groups;
- treats projected local moments as partition-dependent diagnostics;
- states that SOC changes symmetry and Brillouin-zone reduction;
- treats magnetic anisotropy as a small difference requiring tighter numerical evidence;
- binds relativistic content to pseudopotential/PAW dataset lineage.

No concrete page-level scientific or MathML defect requiring correction was identified. The systematic report's dedicated modern textbook/course comparison for this subject remains open; current resources are theory and implementation anchors rather than a finalized curriculum.

### Berry Phases and Electronic Topology

Status: **Major occupied-subspace and discrete-transport repair completed**.

Strengths retained:

- gauge freedom is introduced before connection, phase, and curvature;
- gauge-dependent and gauge-invariant objects are separated;
- occupied projectors and non-Abelian connections replace arbitrary energy-ordered labels at crossings;
- polarization branches, Chern numbers, Wilson loops, Wannier centres, symmetry indicators, and bulk-boundary evidence are bounded separately;
- band inversion and one diagnostic are not accepted as topology proofs;
- numerical claims name mesh, subspace, window, disentanglement, Hamiltonian, gap, and boundary controls.

Finding BT-1: the Chern-number section said the occupied subspace was fundamental but displayed a sum of individual-band curvatures. That expression assumes the occupied bands can be treated as separately isolated and smooth, and is not the most robust formulation at internal occupied-band crossings.

Action completed: replaced the formula with the trace of the non-Abelian occupied-subspace curvature,

```text
C = (1 / 2 pi) integral_BZ Tr[Omega_xy(k)] d^2k,
```

and stated the restricted conditions under which it reduces to a sum of isolated-band curvatures.

Finding BT-2: the finite-mesh section implied that an ordered product of raw neighbouring-subspace overlap matrices directly defines a Wilson-loop operator. At finite spacing, raw overlap matrices need not be unitary.

Action completed: stated that a discrete parallel transporter is commonly built from the unitary polar or singular-value-decomposition factor, or an equivalent orthonormalized construction, before forming the ordered closed-path Wilson loop. The existing mesh, path, subspace, window, disentanglement, and symmetry convergence boundaries remain.

## Third-pass cross-page result

No blocker, broad scientific reversal, or major responsibility collision was found in the periodic-physics route:

```text
crystal geometry and reciprocal conventions
├── Fourier representation
├── Bloch states and bands
└── space-, little-, double-, and magnetic-group structure
    ├── relativistic spinor and magnetic Hamiltonians
    └── occupied-subspace geometry and topology
```

The route now more clearly separates:

- lattice geometry from physical band consequences and numerical sampling;
- reciprocal-lattice Fourier components from Bloch wavevectors;
- ordinary unitary representations from antiunitary corepresentations;
- finite point/little co-groups from continuous and full space-group representation theory;
- real-irrep shorthand from complex-irrep selection rules;
- individual isolated-band curvature from occupied-subspace non-Abelian curvature;
- raw finite-mesh overlap matrices from unitary discrete parallel transport;
- one converged magnetic or topological diagnostic from a complete evidence chain.

## Pending checks

The first three passes do not claim:

- time-bounded external-link reachability for every resource;
- exhaustive comparison of editions, courses, exercises, or regional access conditions;
- completion of the dedicated relativity/spin/magnetism resource comparison;
- cross-browser verification of every corrected MathML tree;
- assistive-technology conformance;
- learner testing or proof that every page has sufficient depth for every beginner;
- independent numerical reproduction of symmetry labels, Berry curvature, Wilson loops, topological invariants, magnetic energies, or band structures;
- completion of the full cross-link and prerequisite graph review.

## Next bounded review batches

1. **Chemistry and finite systems:** Quantum Chemistry, Atomic and Molecular Physics, Chemical Bonding and Molecular Structure, General Chemistry, Inorganic Chemistry, Solid-State Chemistry, and Surface and Interface Chemistry.
2. **Advanced response and many body:** Many-Body Physics, Linear Response and Excited States, Many-Body Perturbation Theory and Quasiparticles, Statistical Mechanics, and Thermodynamics.
3. **Foundational support and navigation:** remaining mathematical and physical pages, source reachability, cross-link graph, narrow-screen equation rendering, accessibility, and learner-oriented reading trials.

Each later pass should correct only evidenced defects. The audit must not become a public completion dashboard, a mandatory page template, or a reason to lengthen every subject equally.
