# Theory electronic-structure core resource review — Batch E

Review date: 2026-08-04

Website baseline: `0e7ffce18311c66fa842273193b592751bf95eb0`

## Scope and review method

This review covers the Many-Electron Problem; Hartree and Hartree–Fock Theory;
Density-Functional Theory Foundations; Kohn–Sham DFT; Exchange–Correlation
Functionals and Approximations; and Self-Consistent-Field Methods. Each accepted
source was opened at the course provider, official project documentation, or
original publisher. Review checked a named instructor, author, or project;
visible content and technical level; learning role; access/licence boundary; and
what the resource cannot establish. This scope excludes exercise and solution
routes.

## Accepted routes

| Page | Resource and source | Learning role and boundary |
| --- | --- | --- |
| Many-Electron Problem | MIT OCW 3.021J, Jeffrey Grossman, “From Many-Body to Single-Particle” | Compact undergraduate video and notes connecting the many-body problem with Hartree, Hartree–Fock, DFT, and plane-wave SCF. It orients rather than supplies a rigorous correlation or representability derivation. |
| Hartree and Hartree–Fock | Psi4 official Hartree–Fock tutorial | Open executable molecular RHF/UHF bridge with charge, multiplicity, Gaussian basis, energy, and optimization context. Defaults and thresholds remain Psi4- and example-specific. |
| DFT Foundations | École Polytechnique / Coursera, Francesco Sottile and Lucia Reining, *Density Functional Theory* | Advanced multi-module route from many-body observables and Hohenberg–Kohn theory onward. Public syllabus is inspectable, but access can require enrolment or paid options. |
| Kohn–Sham DFT | École Polytechnique / Coursera module two | Guided sequence through the auxiliary system, XC potential, Kohn–Sham equations, and Hartree relation. It does not validate eigenvalue interpretations. |
| XC Functionals | MIT OCW 8.511, Patrick Lee, Kohn–Sham DFT lecture | Graduate conceptual note contrasting Thomas–Fermi and Kohn–Sham treatment and exposing an LDA limitation. It is not a modern functional-selection guide. |
| SCF Methods | DFTK *Self-consistent field methods* | Maintained mathematical documentation of fixed points, density mixing, dielectric preconditioning, and long-wavelength convergence. Julia examples and parameters do not transfer as universal defaults. |

## Deferred sources and limits

- Personal notebook mirrors and GitHub/GitLab projects that could not expose their
  author, rendered notebook, maintenance state, or licence clearly were deferred.
- A historical primary paper and commercial texts remain useful page references,
  but were not misrepresented as a practical tutorial or open replacement.
- Software manuals not explaining the relevant theory, and command-only examples,
  were not accepted as complete learning routes.
- Platform enrolment, pricing, course availability, software releases, and links
  require later rechecks.

## Page mapping and remaining gaps

All routes remain on their relevant Theory pages; the Theory index remains
concise, Reference remains unfilled, and Methods is unchanged. Remaining gaps
include a source-clear Chinese DFT theory route that separates foundations,
Kohn–Sham construction, and numerical SCF rather than treating them as one
black-box workflow, plus an open advanced route on functional-error diagnosis.
Prose handoff points are a more intuitive explanation of noninteracting
representability and a concrete illustration of why an SCF residual and an
observable-convergence claim differ.
