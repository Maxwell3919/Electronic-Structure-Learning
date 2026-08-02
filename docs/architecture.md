# Electronic Structure Atlas architecture

Electronic Structure Atlas is a small, static, content-first website. Its public information architecture has five entries:

```text
Home
Theory
Methods
Computational Tools
Reference
```

The implementation uses Plain Astro pages, one shared layout, and one global stylesheet. It has no Starlight layer, content registry, search index, client hydration, packaged fonts, interactive runtime, backend, account system, or database.

## Theory

Theory connects mathematical, physical, chemical, and electronic-structure foundations. Its directory remains organized at two subject levels:

```text
Theory
├── Mathematical Foundations
├── Physical Foundations
├── Chemical Foundations
├── Electronic Structure Theory
│   ├── The Many-Electron Problem
│   ├── Hartree and Hartree–Fock Theory
│   ├── Density Functional Theory: Foundations
│   ├── Kohn–Sham Density Functional Theory
│   ├── Exchange–Correlation Functionals and Approximations
│   ├── Self-Consistent Field Methods
│   ├── Discretization and Basis Representations
│   ├── Plane-Wave and Real-Space Methods
│   ├── Localized-Orbital Methods
│   ├── Pseudopotentials and Projector-Augmented Waves
│   ├── Brillouin-Zone Sampling
│   ├── Linear Response and Excited States
│   └── Berry Phases and Electronic Topology
└── Learning Map
```

The first three reviewed batches add Linear Algebra, Calculus and Analysis, Numerical Analysis, Quantum Mechanics, Solid-State Physics, Quantum Chemistry, The Many-Electron Problem, Hartree and Hartree–Fock Theory, and Density Functional Theory: Foundations.

The fourth batch completes the Tier-1 explanatory loop with Kohn–Sham Density Functional Theory, Exchange–Correlation Functionals and Approximations, Self-Consistent Field Methods, and Discretization and Basis Representations. The responsibility chain is explicit:

```text
interacting many-electron problem
→ density-functional foundations
→ auxiliary Kohn–Sham system
→ exchange–correlation approximation
→ nonlinear SCF solution
→ finite numerical representation
```

These pages share navigation, source discipline, mathematical presentation, and review boundaries, but they do not follow a mandatory public section template. Kohn–Sham orbitals are not presented as general quasiparticle states; functional selection is observable-specific; SCF convergence is separated from representation and scientific convergence; basis, quadrature, grids, boundary conditions, core treatment, and Brillouin-zone sampling remain distinct numerical layers.

Mathematics is authored as native MathML inside the static Astro source. Display equations use a shared scroll-contained wrapper, while inline expressions remain part of the prose. Every expression carries a TeX annotation inside MathML `<semantics>` for source readability and downstream reuse. The site does not load MathJax, KaTeX, packaged math fonts, or client-side equation scripts.

Books, course websites, resource evaluations, and detailed concept graphs are added only as separately reviewed content. Broken external resources are removed when their official destination cannot be verified. The Learning Map expresses relationships between detailed concepts and does not prescribe one fixed course sequence.

Methods discusses scientific methods rather than paper-reading records. Computational Tools keeps commands and file semantics inside their software and program context. Reference accepts resources only after source, license, scope, and recommendation reasons are checked.

The site defaults to English and system serif fonts. Pages use white space and typographic hierarchy rather than cards, dashboards, reading modes, status badges, or decorative interaction.

The former source-aligned course, practice cross-reference, learning paths, labs, cases, literature layer, interactive components, and their validation system are not part of the current build. They remain recoverable from Git history and the tag documented in `docs/legacy-site.md`; their former URLs are intentionally unsupported.

Future content is added manually, one reviewed responsibility at a time. A successful build or browser smoke verifies only the declared structural and runtime behavior, not scientific acceptance or learning effectiveness.
