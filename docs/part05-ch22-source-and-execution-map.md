# Part V Chapter 22 source and execution map

## Source locator

Primary source: Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., Chapter 22, printed pp. 465–479. Source exercises begin on printed p. 479 and are not copied.

| Section | Martin title | Printed page | Website ownership |
|---|---|---:|---|
| 22.1 | Overview | 465 | Dimensional reduction; surface/interface versus intrinsic low-dimensional material; ordinary and bulk-connected boundary states |
| 22.2 | Potential at a Surface or Interface | 466 | Vacuum reference, surface dipole, work function, equilibrium Fermi level, band bending and interface lineup |
| 22.3 | Surface States: Tamm and Shockley | 467 | Boundary-potential bound states, projected bulk gaps, Shockley band-character exchange, surface band versus resonance |
| 22.4 | Shockley States on Metals: Gold (111) Surface | 470 | Projected bulk continuum, Au(111) surface localization, Rashba splitting and continuum merger |
| 22.5 | Surface States on Semiconductors | 471 | Dangling bonds, reconstruction/passivation, bulk-gap error and surface-state assignment |
| 22.6 | Interfaces: Semiconductors | 472 | Nonpolar interfaces, strain, potential lineup, bulk band-edge terms and valence/conduction offsets |
| 22.7 | Interfaces: Oxides | 474 | Polar discontinuity, electrostatic buildup, compensation mechanisms, STO orbital subbands and evidence ambiguity |
| 22.8 | Layer Materials | 477 | Interlayer hybridization, bulk-to-monolayer changes, vacuum-referenced levels and van der Waals stacks |
| 22.9 | One-Dimensional Systems | 478 | Curvature-induced orbital mixing, nanotube band changes and dimensional DOS/screening boundaries |

Supplementary practical source: Sholl–Steckel, Chapter 4 · *DFT Calculations for Surfaces of Solids*, printed pp. 83–112. It supplies slab/supercell, k-point dimensionality, Miller-index, relaxation, surface-energy, symmetric/asymmetric slab, reconstruction, adsorption and coverage practice. It does not replace Martin’s surface-state and interface organization.

Supporting Martin dependencies:

- Chapter 4: Bloch bands and projected bulk continua;
- Chapters 13–15: periodic supercells, plane-wave/local-orbital implementations and forces;
- Appendix F: surface/interface dipoles and long-range periodic electrostatics;
- Appendix O: spin–orbit and Rashba coupling;
- Chapters 23–24: localized representations and polarization when needed later;
- Chapters 25–28: topology; Chapter 22 must not pre-empt their invariant/classification content.

## Object hierarchy

The chapter will keep these objects distinct:

1. bulk electrostatic reference, surface/vacuum reference and arbitrary potential zero;
2. work function, electron affinity, ionization threshold and semiconductor Fermi-level position;
3. planar average, macroscopic average and local microscopic potential;
4. surface-localized eigenstate, interface-localized eigenstate, surface resonance and projected bulk state;
5. Tamm mechanism, Shockley bulk-band transition and symmetry/topology-protected boundary connectivity;
6. slab eigenvalue, layer projection, decay length and semi-infinite spectral function;
7. bulk band-edge term, interface lineup term, strain correction and total band offset;
8. formal layer charge, self-consistent mobile charge, defect charge and static charge partition;
9. isolated monolayer level, stacked-layer hybridized band and arbitrary-vacuum supercell reference;
10. one-, two- and three-dimensional DOS and screening laws.

## Core derivations

- work function `Phi = V_vac - E_F` with a declared electron-energy convention;
- planar and macroscopic averaging and why an asymmetric slab produces a residual field under periodic boundary conditions;
- dipole-sheet potential step and finite-cell image interaction scaling;
- surface-energy formulas for symmetric and asymmetric slabs and their chemical-potential boundary;
- one-dimensional boundary Green-function/Tamm-state condition;
- projected bulk continuum and localization/resonance criterion;
- one-dimensional two-band Shockley/SSH-like boundary model without completing the Part VI invariant classification;
- semiconductor interface lineup decomposition `Delta E_v = Delta E_v^bulk + Delta V_lineup`;
- polar-layer electrostatic buildup and compensating half-charge teaching limit;
- low-dimensional DOS exponents and the distinction between k-grid dimensionality and physical dimensionality.

## Original teaching models

1. **Slab/vacuum/work-function explorer** — planar potential with symmetric/asymmetric dipoles, vacuum thickness and finite-cell residual field.
2. **Surface-state/localization explorer** — finite chain with adjustable boundary onsite term and termination; displays Tamm bound state, projected continuum and localization length.
3. **Interface-lineup explorer** — two bulk band-edge references plus interface dipole and strain; separates intrinsic and lineup contributions.
4. **Polar-discontinuity capacitor model** — alternating charged planes, thickness-dependent potential buildup and compensating charge.
5. **Dimensional-DOS explorer** — ideal parabolic 1D/2D/3D DOS near a band edge with explicit broadening and normalization boundary.

Each model will have deterministic inputs, an analytic/known limit, keyboard controls, a no-JavaScript fallback, units/convention statements and a claim ceiling.

## Evidence matrix

| Claim | Minimum direct evidence | Required convergence | Insufficient evidence |
|---|---|---|---|
| Work function is reliable | Vacuum plateau and converged Fermi level for a declared termination | slab thickness, vacuum, dipole treatment, k mesh, cutoff, relaxation | one local potential value or bulk eigenvalue reference |
| State is surface localized | wavefunction/spectral weight decays into bulk and lies outside or within declared projected continuum | slab thickness, opposite-surface splitting, projection and energy resolution | slab band drawn inside a bulk gap without localization |
| State is a surface resonance | enhanced surface spectral weight while overlapping a projected bulk continuum | slab/semi-infinite spectral convergence and projection stability | a broadened surface DOS peak alone |
| Tamm mechanism is supported | state appears/disappears with a local boundary-potential change at fixed bulk topology | boundary potential and finite-size scan | any gap state called “Tamm” |
| Shockley connectivity is supported | bulk character exchange/gap closure path plus boundary state in projected gap | full relevant momentum path and termination robustness boundary | local band inversion at one point |
| Interface band offset is reliable | matched strained bulk band-edge references plus self-consistent interface lineup | layer thickness, strain, atomic relaxation, electrostatic plateau, functional/gap treatment | isolated vacuum levels or layer PDOS only |
| Polar compensation mechanism is identified | charge, defects, stoichiometry and potential profile discriminate candidate mechanisms | thickness, defect concentration, electrostatics and carrier-density checks | metallic interface band or formal charge counting alone |
| Monolayer/stack band alignment is reliable | consistent vacuum reference and method across relaxed structures | vacuum, dipole, k mesh, SOC, quasiparticle/functional sensitivity | arbitrary supercell eigenvalue zeros |
| Ordinary state is topological | converged bulk invariant plus boundary spectral connectivity under stated symmetry | full BZ, gap, occupied manifold, surface termination and finite-size checks | surface localization, Rashba splitting or band inversion alone |

## Parallel isolation

Chapter 22 substantive files will remain in:

- `src/components/part05/ch22/`;
- `src/data/part05/ch22*`;
- the Chapter 22 route;
- `docs/part05-ch22-*`;
- `scripts/validate-part05-ch22.mjs` and `scripts/smoke-part05-ch22.py`.

Shared `package.json`, CI and Pages registration will be added only after a fresh current-main synchronization. No Part I–IV, Part VI–VII body page, dependency, lockfile, Astro configuration or global style will be changed during substantive drafting.

## Copyright and data boundary

Only bibliographic identity, section titles and printed-page locators are retained from sources. Public prose, derivations, exercises, diagrams and numerical kernels are original. The repository will not contain textbook PDFs/scans/figures/captions/exercises/answers, licensed material, credentials, private records or raw/restart/wavefunction calculation outputs.

## Validation history

- `site-ci` run `30661191191` installed the locked dependencies and passed smoke-script syntax plus every deterministic validator, including all twelve Chapter 22 model/content groups.
- The same run failed during Astro/MDX assembly at `Chapter22SurfaceStates.mdx:323` because a Markdown list was nested inside raw HTML in the final bilingual callout. This failure is retained as a failure, not reclassified as a pass.
- The list was converted to explicit `<ul>/<li>` markup without changing the scientific content, acceptance conditions, or other Parts. A full combined rerun is required before readiness.
