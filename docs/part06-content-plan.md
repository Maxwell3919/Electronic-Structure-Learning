# Part VI · Electronic Structure and Topology — content plan

Baseline checked: `Maxwell3919/Electronic-Structure-Learning@7e0a73d74322828f0626b7174aaa61f1677dbf98`

Primary structure source: Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., Part VI, printed pp. 517–580. Chapters 23–24 and Appendices O–Q supply the prerequisite links listed below. The website will preserve Martin's section order and page locators while using original bilingual prose, derivations, diagrams, models, and exercises.

## 1. Dependency chain and chapter boundaries

```text
Chapter 23: Bloch ↔ Wannier gauge choice, Wannier centers, hybrid Wannier functions
       ↓
Chapter 24: Berry-phase polarization, overlap products, polarization lattice, Thouless pump
       ↓
Chapter 25: object of topology, Berry geometry, gap condition, bulk-boundary entry,
            TRS, Wannier obstruction, TQC, Majorana entry
       ↓
Chapter 26: explicit 2×2 models, Bloch sphere, 1D winding/Shockley states,
            2D Chern mapping, Thouless pump, graphene ribbons
       ↓
Chapter 27: 2D Chern and time-reversal-invariant insulators, Z2,
            square/honeycomb/HgTe models
       ↓
Chapter 28: 3D four Z2 indices, weak/strong phases, material models,
            Weyl/Dirac nodes and Fermi arcs
```

Appendix O supplies the Dirac equation and spin–orbit reduction. Appendix P supplies the discrete and continuous Berry phase, Berry curvature, Chern number, adiabatic evolution, Aharonov–Bohm analogy, and monopole picture. Appendix Q supplies the quantum Hall precedent and the bulk/edge conductivity connection.

Chapter 25 remains an introduction. It will establish the common mathematical language but will not pre-empt the full two-band derivations of Chapter 26, the two-dimensional Z2 construction of Chapter 27, or the three-dimensional classification of Chapter 28. Chapter 26 remains model-centred. Chapter 27 covers two dimensions only. Chapter 28 covers three dimensions and semimetals.

## 2. Unified mathematical conventions

- Bloch state: `|ψ_{n k}⟩ = e^{i k·r}|u_{n k}⟩`; the cell-periodic state is normalized in one primitive cell unless a model states otherwise.
- Reciprocal convention: `k` and `k+G` represent the same crystal momentum. Integration orientation is `(k_x,k_y)` with positive normal `+z`.
- Single-band gauge: `|u_n(k)⟩ → e^{iφ_n(k)}|u_n(k)⟩`.
- Occupied-subspace gauge: `|u_n(k)⟩ → Σ_m |u_m(k)⟩U_{mn}(k)`, with `U(k)` unitary inside a separated occupied manifold.
- Berry connection: `A_n(k)=i⟨u_n(k)|∇_k u_n(k)⟩`. With this convention `A→A−∇φ`.
- Berry phase: `γ[C]=∮_C A·dk`, defined modulo `2π` for a closed loop with a compatible endpoint gauge.
- Berry curvature: `Ω_n=∇_k×A_n`; in 2D the scalar component is `Ω_{n,z}`.
- Occupied projector: `P(k)=Σ_{n∈occ}|u_n(k)⟩⟨u_n(k)|`; projector-based statements are invariant under occupied-subspace unitary rotations.
- Chern number: `C=(1/2π)∫_BZ Tr Ω_z d²k`. A sign is meaningful only together with the orientation and Hamiltonian convention.
- Discrete Wilson products use normalized overlaps. Multiband loops use overlap matrices and either a path-ordered Wilson matrix or its determinant, depending on the stated observable.
- Topological invariants are assigned only when the relevant band manifold is separated by the required direct gap over the full parameter space and the protecting symmetry assumptions hold.

These conventions will be restated briefly at first use and reused without silent sign changes.

## 3. Chapter plans

### Chapter 25 · Introduction — printed pp. 517–530

Source order: §§25.1–25.10.

Core derivations:

1. A continuous family `H(k,λ)` and its occupied projector; continuity of `P` while the direct occupied–unoccupied gap remains open.
2. Gauge transformation of the Berry connection and modulo-`2π` invariance of a closed-loop Berry phase.
3. Curvature from the curl of the connection; Stokes' theorem, patching, and the obstruction to one global smooth gauge when `C≠0`.
4. Time reversal: `k→−k`, spinless/spinful distinction, `Θ²=±1`, Kramers degeneracy at TRIM, and the odd transformation of Berry curvature.
5. Interface interpolation and spectral flow as the controlled statement behind bulk-boundary correspondence.
6. Wannier localization versus symmetry-respecting Wannier obstruction.
7. BdG particle–hole structure as the minimum additional ingredient for Majorana modes.

Original visualizations:

- Gap-closing explorer for a deterministic 1D two-band Hamiltonian.
- Gauge-loop explorer showing connection changes and invariant `exp(iγ)`.
- Bulk–trivial interface spectral-flow diagram with ordinary boundary-state alternatives marked separately.
- Static occupied-projector/evidence ladder and TRS pairing diagrams.

Batches:

- A: plan, source map, orientation, objects, §§25.1–25.5, first two models.
- B: §§25.6–25.10, bulk/boundary evidence matrix, third model.
- C: exercises, references, accessibility and deterministic validation.
- D: full build, Actions, Pages and live deployment checks.

### Chapter 26 · Two-band models — printed pp. 531–545

Core derivations:

- `H=d_0 I+d·σ`, characteristic polynomial, `E_±=d_0±|d|`, projectors and normalized eigenvectors in two coordinate patches.
- Gap closure at `d=0`; `d_0` changes energies but not eigenvectors or topology.
- One-dimensional chiral/two-site model, `q(k)=d_x+i d_y`, integer winding, Zak phase and unit-cell/termination dependence.
- Shockley transition, edge-state recursion and localization length.
- Two-dimensional formula `C=(1/4π)∫ d̂·(∂_{k_x}d̂×∂_{k_y}d̂)d²k`.
- Thouless pump with `(k,t)` as a torus and `Q=eC` under adiabatic, gapped, full-cycle conditions.

Original visualizations: Bloch sphere, complex-plane winding, alternating chain and termination, edge decay, BZ-to-sphere map, Chern density, pump/Wannier-center flow, graphene ribbon termination.

### Chapter 27 · Topological insulators I: 2D — printed pp. 547–567

Core derivations:

- Chern-insulator Hall response `σ_xy=C e²/h` for a filled isolated manifold.
- Time-reversed spin sectors, cancellation of total Chern number, and the limits of a conserved-spin picture.
- Spinful time reversal, Kramers pairs and TRIM.
- Mod-two edge crossing and the two-dimensional Z2 invariant, with Wilson-loop and parity criteria explicitly labelled as supplemental computational forms and with their symmetry requirements.
- Martin's square-lattice model: spectrum, mass inversion, gap-closing boundaries and ribbon spectrum.
- Hg/CdTe low-energy model and thickness/mass control without identifying model parameters as ab initio data.
- Graphene/honeycomb sublattice, valley and spin–orbit masses.

Original visualizations: chiral versus helical edge flow, odd/even crossings, square-lattice phase diagram and ribbon spectrum, Hg/CdTe mass transition, valleys and competing honeycomb masses, optional Wilson-loop flow.

### Chapter 28 · Topological insulators II: 3D — printed pp. 569–580

Core derivations:

- Four indices `(ν_0;ν_1ν_2ν_3)` from time-reversal-invariant planes, including reciprocal-lattice and surface-orientation conventions.
- Martin's 3D tight-binding/Dirac model: gamma matrices, mass term, phase boundaries and surface solution.
- Separation of generic low-energy structure from material-specific orbital/SOC parameters for the Bi2Se3/Sb2Se3 discussion.
- Weyl Hamiltonian near a node, Berry curvature, enclosing-surface Chern number and chirality.
- Dirac node as symmetry-enforced coincidence of opposite-chirality Weyl sectors; allowed gap or splitting perturbations.
- Fixed-momentum 2D slices, changing Chern number, surface projection and the origin of Fermi arcs.

Original visualizations: TR-invariant planes, stacked weak phase, strong-TI surface cone, 3D phase diagram, Weyl flux sphere, node pairing, Dirac splitting, slice Chern numbers, projected nodes and Fermi-arc/slab spectral-function distinction.

## 4. Topological-claim evidence matrix

| Claim | Minimum bulk evidence | Symmetry/invariant evidence | Boundary evidence | Convergence and alternatives | Weaker evidence that is insufficient |
|---|---|---|---|---|---|
| Model topological transition | Full parameter-space gap tracked through the transition | Invariant evaluated on both gapped sides | Optional interface spectrum | Mesh/finite-size checks; identify symmetry change | Band inversion at one point |
| 2D Chern phase | Isolated occupied manifold over the full BZ | Converged integer Chern number with stated orientation | Chiral edge spectral flow consistent with `C` | k-mesh refinement, gauge test, ribbon width/termination | Local Berry-curvature hotspot or one edge-like band |
| 2D Z2 insulator | Direct gap and occupied Kramers manifold over the BZ | Applicable Z2 calculation; parity only with inversion | Odd partner switching/crossing under TRS | SOC, structure, functional, mesh and ribbon-width checks | SOC gap or band inversion alone |
| 3D strong TI | Direct gap on the required manifold over the 3D BZ | `(ν0;ν1ν2ν3)` with `ν0=1` by an applicable method | Surface spectrum for a stated orientation | 3D mesh, slab thickness, termination, hybridization | A single surface Dirac-looking crossing |
| Topological boundary state | Bulk phases on both sides and invariant mismatch | Protecting symmetry preserved at the interface | Localization and spectral flow distinguished from projected bulk bands | termination, disorder class and finite-size checks | Any in-gap Tamm/Shockley state |
| Weyl node | 3D node search, isolated twofold crossing | Nonzero enclosing-surface flux/chirality | Surface calculation optional for node identity | search resolution, enclosing sphere and partner nodes | Crossing on a high-symmetry path |
| Dirac node | Fourfold crossing in 3D | Explicit protecting symmetries and stability analysis | Surface response is secondary | off-path search and allowed perturbations | Two bands crossing on one plotted line |
| Fermi arc | Bulk Weyl nodes and their surface projections | Slice Chern-number change | Surface spectral function showing an open contour joining projected charges | slab/semi-infinite convergence, termination and broadening | Bulk path bands or an open-looking constant-energy contour alone |
| Reliable Wannier topology model | Target-band and symmetry fidelity to ab initio states | Invariant agrees with direct calculation or an independently checked representation | Boundary result stable to model details | windows, projections, interpolation error, symmetry and topology checks | Successful Wannierization or small RMS band error alone |

## 5. Connection to material calculations

The teaching sequence will use the following evidence-preserving path:

```text
relaxed crystal and magnetic structure
→ SOC/non-SOC Bloch calculation with a converged basis and k mesh
→ stable occupied or target band manifold
→ symmetry representations and/or a validated Wannier model
→ invariant on the full BZ or enclosing surface
→ slab or semi-infinite surface spectral calculation
→ finite-size, termination, broadening and mesh convergence
→ bounded physical interpretation
```

No universal cutoff, k mesh, Wannier window, slab thickness, broadening or node-search tolerance will be prescribed. A DFT gap, SOC-induced gap, band inversion, successful Wannier interpolation, or boundary-like band is an intermediate observation, not a topological classification by itself.

## 6. Parallel-work isolation

- Part VI owns `src/content/docs/part-06-electronic-structure-and-topology/`, `src/components/part06/`, `src/data/part06/`, `scripts/validate-part06-*`, and `docs/part06-*`.
- Open Part I–IV PRs were checked against `main`. Part I uses chapter-local components; Part III/IV currently contain only planning files. The paused Part II PR modifies `package.json`; Part VI will make any shared script change narrowly and rebase before merge.
- The Part V Chapter 19 branch is currently identical to `main`; no Chapter 23/24 or shared Berry/Wannier component exists on GitHub. Part VI therefore depends only on the PDF/source map and merged interfaces, not on unmerged Part V prose.
- Talos worktrees and mirror alignment are `【未知/待验证】` in this web session because no host-live tool is available. No local worktree state is inferred from GitHub branches.
- Shared CSS, Astro configuration, lockfile, navigation and generic components remain unchanged unless a concrete build/accessibility defect requires a separate minimal fix.

## 7. Copyright and source boundary

The public repository may contain bibliographic identity, section titles, printed-page locators, original summaries, independent derivations, original diagrams, original deterministic models, and original exercises. It must not contain the textbook PDF, scans, source figures, captions, exercise wording, answers, long translated passages, or copied paper graphics. External papers are used for exact attribution and later developments; they do not replace Martin's chapter order without an explicit label.
