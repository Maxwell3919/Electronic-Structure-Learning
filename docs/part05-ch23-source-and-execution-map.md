# Part V Chapter 23 · Wannier Functions — source and execution map

Baseline: `Maxwell3919/Electronic-Structure-Learning@6e2e3a2110c0064d069146dc6377fef0015f3f44`

Primary source: Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., Chapter 23, printed pp. 481–496. The supplied PDF was checked page by page. The source exercises begin on p. 496 and will not be copied. Public prose, derivations, diagrams, deterministic kernels and exercises will be original.

## Verified source boundary

| Section | Martin title | Printed page | Equation/figure boundary | Website responsibility |
|---|---|---:|---|---|
| 23.1 | Definition and Properties | 481 | Eqs. (23.1)–(23.13); Fig. 23.1 | Bloch gauge freedom, periodic gauge, Bloch–Wannier transforms, composite-band unitary rotations, orthonormality, centers and second moments; state the localization/topology existence boundary without completing Part VI. |
| 23.2 | Maximally Projected Wannier Functions | 485 | projection construction; Fig. 23.2 | Phase/projection choice, atom- and bond-centred trial orbitals, order-N interpretation and the silicon bond-centred example; distinguish a useful projected choice from a variationally optimal one. |
| 23.3 | Maximally Localized Wannier Functions | 487 | Eqs. (23.14)–(23.31); Fig. 23.3 | Spread functional, gauge-invariant and gauge-dependent pieces, projectors, overlap matrices on a discrete k mesh, translationally covariant complex-log formulas, steepest descent and real-space/disordered-system forms. |
| 23.4 | Nonorthogonal Localized Functions | 491 | Eqs. (23.32)–(23.35); Fig. 23.4 | Nonsingular nonunitary transformations, overlap/nonorthogonality, normalized functions, generalized spread and rank constraint; explain shorter range versus orthogonal tails. |
| 23.5 | Wannier Functions for Entangled Bands | 492 | energy-window constructions; Fig. 23.5 | Isolated versus entangled bands, reduced subspaces, orbital projection/downfolding, energy-window-dependent subspace selection and the boundary of interpolation validity. |
| 23.6 | Hybrid Wannier Functions | 494 | Eqs. (23.36)–(23.37) | One-direction Fourier transform, transverse crystal momentum as a parameter, hybrid centers and the surface/interface connection; defer topological classification to Part VI. |
| 23.7 | Applications | 495 | application survey | Wannier interpolation, fine band features, localized large-scale methods, hybrid-functional exchange, transport and interacting-model parameterization; require explicit validation of every target observable and matrix element. |
| Exercises | — | 496 | source exercises | Add a separate original problem set; do not reproduce source wording or answers. |

Source figures 23.1–23.5 and their captions are inspected only to understand the organization and examples; they will not be reproduced.

## Chapter object hierarchy

The chapter will preserve the following distinctions:

```text
Bloch eigenvectors at each k
→ selected band subspace P(k)
→ gauge/frame U(k) within that subspace
→ Fourier-transformed localized functions
→ real-space centers, spreads and Hamiltonian matrix elements
→ interpolation or reduced model
→ target-observable validation
→ scientific interpretation
```

A band subspace and a gauge are different objects. Changing the unitary frame inside a fixed isolated subspace preserves the projector and exact represented bands but changes individual Wannier shapes, centers modulo lattice vectors, spreads and real-space matrix elements. Entangled-band constructions additionally change the selected subspace and therefore require an energy-window and fidelity contract.

## Core derivation plan

1. Derive the single-band Bloch–Wannier transform and inverse transform with a declared normalization convention.
2. Prove lattice translation and orthonormality from discrete or continuous Brillouin-zone orthogonality.
3. Extend to composite bands with a k-dependent unitary matrix and show projector invariance.
4. Derive Wannier centers and second moments from k derivatives and state the Berry-connection/branch boundary.
5. Decompose the quadratic spread into gauge-invariant and gauge-dependent positive pieces and interpret the `Q r P` fluctuation term.
6. Derive discrete overlap matrices `M_mn(k,b)` and explain why complex-log expressions restore lattice-translation covariance on a finite mesh.
7. Explain anti-Hermitian generators, unitary updates and steepest-descent minimization without presenting one software implementation as the definition.
8. Formulate nonorthogonal localized functions with a nonsingular transformation and explicit overlap/rank conditions.
9. Define an entangled-band target subspace, outer and frozen/inner windows as a supplemental implementation connection, and separate subspace selection from subsequent localization.
10. Derive hybrid Wannier functions and centers as one-dimensional transforms parameterized by transverse momentum.
11. Derive real-space Hamiltonian matrix elements and inverse Fourier interpolation; connect hopping decay to interpolation range and error.

## Planned original teaching models

1. **Gauge-to-localization explorer** — a finite one-dimensional band whose k-dependent phase controls the Wannier centre and spread while leaving the band energy unchanged.
2. **Composite-subspace rotation explorer** — two isolated bands with a k-dependent unitary frame; visualize projector invariance and redistribution between atom- and bond-centred Wannier functions.
3. **Discrete-overlap and branch explorer** — overlap products on a k loop, centre modulo a lattice vector, mesh refinement and phase-unwrapping/branch boundaries.
4. **Disentanglement-window explorer** — an avoided-crossing model with outer and frozen windows; quantify subspace fidelity inside the target window and failure outside it.
5. **Interpolation/locality explorer** — truncate real-space hoppings and compare the interpolated band with the exact target, reporting maximum and RMS errors over a declared validation mesh.
6. **Hybrid-centre explorer** — localized direction plus transverse momentum parameter, used only to prepare the Chapter 24/Part VI connection.

The chapter will retain 3–5 of these in the final page according to teaching value and mobile/browser complexity.

## Scientific claim ceilings

- A generated Wannier file does not establish a reliable low-energy model.
- A small total spread does not prove that the selected orbitals are chemically unique, transferable or symmetry faithful.
- Agreement along one high-symmetry path does not validate interpolation over the full target Brillouin-zone region.
- Band-energy agreement does not validate velocities, Berry connections, optical/EPC matrix elements, Fermi-surface topology or transport.
- Trial projections and localization minima can yield different gauges within the same subspace; entangled-band windows can yield different subspaces.
- A finite outer window defines where the reduced space is allowed to differ from omitted bands; no conclusion is supported outside the validated window.
- Orthonormal Wannier functions may have longer tails than nonorthogonal localized functions; shorter range does not remove overlap-matrix bookkeeping.
- A hybrid Wannier centre flow is not by itself a topological classification unless the required bulk gap, symmetry, occupied subspace and invariant contract are supplied.
- Topological obstruction to exponentially localized symmetry-respecting Wannier functions is stated as a boundary and deferred to Part VI/Section 25.8.

## Practical software connection

Current software syntax and behavior will be checked against official documentation before publication. The practical route may connect to Wannier90 and compatible DFT interfaces, but the website will separate:

```text
Bloch-state generation
→ overlap/projection matrices
→ isolated or disentangled subspace selection
→ localization
→ Hamiltonian/matrix-element interpolation
→ independent validation mesh
→ target observable
```

The chapter will not provide universal projection choices, energy windows, k meshes or convergence thresholds.

## Parallel isolation

At branch creation, current open substantive work is outside Part V: Part IV Chapter 16 and Part VII Appendix J. Chapter 23 substantive work will remain under:

```text
src/components/part05/ch23/
src/data/part05/
src/content/docs/part-05-properties-of-matter/chapter-23-wannier-functions.mdx
scripts/validate-part05-ch23.mjs
scripts/smoke-part05-ch23.py
docs/part05-ch23-*
```

Shared `package.json`, CI and Pages workflow registration will be deferred until the chapter-local content and validator are complete and a fresh `main` synchronization has been performed. Dependencies, lockfile, Astro configuration and global CSS are not planned for modification.

Talos worktree/mirror alignment is `【未知/待验证】` because this web session has no host-live access.
