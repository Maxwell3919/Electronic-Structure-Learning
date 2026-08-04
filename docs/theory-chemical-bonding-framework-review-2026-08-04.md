# Chemical Bonding framework review — 2026-08-04

## Scope

This Theory batch adds one explicit real-space interpretation route to `/theory/chemical-bonding-and-molecular-structure/`. It does not define a universal bond metric or turn the page into an analysis-software directory.

## Accepted route

| Destination | Local teaching role | Access and maintenance | Boundary retained on the page |
| --- | --- | --- | --- |
| [Critic2](https://aoterodelaroza.github.io/critic2/) | Open implementation route for QTAIM-style density topology, critical points, basins, ELF, delocalization indices, and NCI plots in molecules and periodic solids. | GPLv3 project page, current manual/examples, and source repository; page updated 2026-07-24. The official page states that the development version has the newest features and that the stable version is seriously outdated. | Record exact version and scalar-field provenance. A topology, basin, or derived index is one declared interpretation framework, not a unique bond observable or energy decomposition. |

The destination was opened on 2026-08-04. It has a distinct role from the page’s conceptual chemistry texts: it exposes the computational objects needed to make a density-topology claim inspectable.

## Deferred routes

| Candidate | Disposition | Reason |
| --- | --- | --- |
| Henkelman-group Bader code | Deferred | The primary destination returned 403 in this review environment. |
| LOBSTER | Deferred | The primary destination timed out in this review environment. |
| Multiwfn and DDEC | Deferred | Useful alternatives, but adding several overlapping analysis packages in one page-local batch would make the page a tool list rather than preserve framework distinctions. |

## Evidence boundary

The route supports transparent use of a named analysis framework. It does not independently validate the electronic-structure calculation, grid convergence, charge reference, chemical interpretation, or a scientific bonding claim.
