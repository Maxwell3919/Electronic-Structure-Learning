# Theory community resource expansion — Batch 5

Review date: 2026-08-04

Website baseline: `2e99d4665b29e2dbbdaa75be92aee5467e257af9`

Scope: page-local additions for Electromagnetism and Self-Consistent Field Methods. Methods and Reference remain outside this batch.

## Review method

Social-platform recommendations and current official documentation were used for discovery. Public inclusion required a primary or clearly creator-uploaded destination, an inspectable sequence or documentation structure, a distinct page-specific role, and an explicit limitation. Popularity, play count, institutional reputation, and software availability were not treated as scientific validation.

## Accepted additions

| Theory page | Resource | Role and boundary |
| --- | --- | --- |
| Electromagnetism | VASP Wiki, [Charged systems with density functional theory](https://vasp.at/wiki/Charged_systems_with_density_functional_theory) and [Electrostatics](https://vasp.at/wiki/Category:Electrostatics) | A current official implementation bridge from electrostatic boundary conditions to 0D/2D Coulomb-kernel truncation, charged cells, dipole corrections, potential references, and dimensionality-specific controls. The documentation is VASP- and version-specific, not a general electrodynamics course or a transferable correction prescription. |
| Self-Consistent Field Methods | 拜访北极熊, [密度泛函理论（DFT）速训班](https://www.bilibili.com/video/BV1fZ421h7dp/) | A self-produced Chinese sequence of eight sessions covering prerequisites, DFT foundations, Wannier functions, DFT+U, algorithm implementation, programming practice, Linux, and software use. The algorithm session gives a longer Chinese orientation than isolated short clips, but the mixed-scope course does not replace fixed-point theory, dielectric preconditioning, competing-state searches, or observable-specific convergence checks. |

## Deferred or rejected candidates

- DFT clips under a few minutes were not accepted as primary learning routes when they only named plane waves, pseudopotentials, or SCF steps without enough derivation or algorithmic context.
- Reuploaded university or workshop videos without a verifiable publication chain were excluded.
- Software tutorials that reduce electrostatics to one input switch without explaining dimensionality, periodic images, potential references, or convergence boundaries were excluded.
- Commercial training pages and parameter recipes were not treated as theory resources.

## Version and source boundaries

The VASP electrostatics pages are current implementation documentation and can change with releases. The review checked the published dimensionality and Coulomb-truncation structure on 2026-08-04; users must still inspect the documentation and known-issues page for the exact installed version. The Bilibili course was checked at its creator-uploaded course page and is linked rather than reproduced.

## Validation boundary

This review verifies source identity, visible scope, and the stated learning role of each destination on the date above. It does not independently validate every lecture statement, software implementation, version-specific result, subtitle, example, or future revision. Neither resource replaces system-, model-, and observable-specific electronic-structure validation.
