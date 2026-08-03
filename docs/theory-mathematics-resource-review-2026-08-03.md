# Theory mathematics resource review — Batch A

Review date: 2026-08-03

Website baseline: `3fb0a47d9552cb1d836bf491c6233fcb61ef55ac`

Scope: Linear Algebra; Calculus and Analysis; Differential Equations; Fourier
Analysis; Functional Analysis and Variational Methods; Numerical Analysis; and
Probability and Statistics.

## Review method and boundary

Each accepted destination was opened at its named primary publisher, author, or
repository. The review checked named authors or course teams, visible outline or
repository structure, a specific knowledge-gap match, access and maintenance
conditions, and a limitation that prevents the resource being presented as a
universal replacement. Popularity, institutional name, and repository stars were
not selection criteria.

This batch does not seek exercise banks or solved-problem collections. Courses,
texts, and executable notebooks are included only where they add an explanatory,
language, or implementation role absent from the existing route. External
availability and future platform access can change; the review records what was
inspectable on the date above, not a permanent endorsement.

## Accepted resources and page mapping

| Theory page | Resource and primary destination | Distinct role and boundary |
| --- | --- | --- |
| Linear Algebra | University of Chinese Academy of Sciences, [Linear Algebra](https://www.icourse163.org/course/gucas-1207039810) | Chinese-language introductory course with an identifiable course team and a visible undergraduate outline. It supplies a first pass through elementary linear algebra; it does not replace spectral proofs or numerical algorithms. |
| Linear Algebra | Jim Hefferon, [Linear Algebra](https://hefferon.net/linearalgebra/) | Author-maintained free text covering systems, maps, determinants, and eigenvalues. It bridges computations to abstract spaces, but not sparse and generalized numerical eigenproblems. |
| Calculus and Analysis | East China Normal University, [Mathematical Analysis I](https://www.icourse163.org/course/detail.htm?cid=1450299616) | Chinese first segment of a visible three-part sequence through limits, continuity, differentiation, mean-value theorems, and completeness. It is not a full multivariable, measure-theoretic, or functional-analysis route. |
| Calculus and Analysis | Boelkins, Austin, and Schlicker, [Active Calculus](https://activecalculus.org/) | Open web/PDF calculus text connecting rate, accumulation, and local approximation. It repairs calculus concepts, not proof-level analysis. |
| Differential Equations | Jiří Lebl, [Notes on Diffy Qs](https://www.jirka.org/diffyqs/) | Open author-maintained text with ODEs, systems, Fourier/PDE material, eigenvalue problems, transforms, and optional interactive demonstrations. It does not establish general PDE existence or regularity theory. |
| Fourier Analysis | Julius O. Smith III, [Mathematics of the DFT](https://ccrma.stanford.edu/~jos/mdft/) | Author-hosted text deriving finite DFT structure, convolution, sampling, aliasing, and FFTs. Its signal-processing examples do not replace reciprocal-lattice or Brillouin-zone treatment. |
| Functional Analysis and Variational Methods | Schöberl and TU Wien colleagues, [iFEM](https://github.com/JSchoeberl/iFEM) | Transparent Jupyter-book repository with Sobolev, weak-form, finite-element, iterative, and multigrid material plus browser-launch options. It is a real-space numerical bridge, not a DFT course. |
| Numerical Analysis | Driscoll and Braun, [Fundamentals of Numerical Computation](https://fncbook.com/) | Free online text with Julia, MATLAB, and Python editions across linear/nonlinear systems, ODEs, Krylov methods, and PDE models. Pedagogical code is not production computational-science software. |
| Numerical Analysis | [Numerical Calculation Method](https://www.icourse163.org/course/detail.htm?cid=1002988004), China University MOOC | Chinese computational route with a visible scope from error to interpolation, quadrature, linear and nonlinear systems, eigenvalues, and ODEs. Session features may vary and it cannot identify code-specific electronic-structure controls. |
| Probability and Statistics | University of Electronic Science and Technology of China, [Probability Theory and Mathematical Statistics](https://www.icourse163.org/course/UESTC-1001590004) | Chinese engineering-oriented course with an identifiable course team and visible nine-chapter probability/statistics outline. It is a first route, not a treatment of correlated trajectories or research uncertainty analysis. |

## Rejected or deferred classes

- Third-party reuploads, download bundles, and unattributed mirrors, including
  mathematical course videos without a verifiable original publisher.
- Exam-preparation fragments and solved-problem collections: they are outside
  this batch's stated need.
- Repositories that demonstrate a single algorithm but have no maintained
  explanatory route, identifiable maintainer, or usable documentation.
- Software-only material whose current version, licence, or learning purpose
  could not be verified at the original destination.
- General signal-processing resources where the connection to Fourier structure
  was too narrow or where the route would blur a finite DFT with periodic-solid
  reciprocal-space concepts.

## Internal coverage matrix

The matrix is an editorial inventory, not a public coverage scorecard. `Reviewed`
means that the currently published page contains independently inspected study
routes; it does not imply that every possible learner background or language is
covered.

| Subject family | Current pages | Review status and next resource role to seek |
| --- | --- | --- |
| Mathematics | Linear Algebra; Calculus and Analysis; Differential Equations; Fourier Analysis; Functional Analysis and Variational Methods; Numerical Analysis; Probability and Statistics | Batch A reviewed. Remaining future value: carefully sourced Chinese explanations of Fourier and variational concepts, without turning pages into lists. |
| Symmetry and periodic matter | Crystallography; Group Theory and Symmetry; Solid-State Physics; Brillouin-Zone Sampling; Berry Phases and Electronic Topology | Existing reviewed routes; seek independently authored or Chinese crystallography/symmetry material with explicit conventions and topology boundaries. |
| Physical foundations | Classical Mechanics; Thermodynamics; Statistical Mechanics; Electromagnetism; Quantum Mechanics; Atomic and Molecular Physics; Many-Body Physics | Existing reviewed routes; seek accessible routes for ensembles, electrodynamic boundary conditions, and field/operator bridges. |
| Chemical foundations | General Chemistry; Physical Chemistry; Quantum Chemistry; Chemical Bonding and Molecular Structure; Inorganic Chemistry; Solid-State Chemistry; Surface and Interface Chemistry | Existing reviewed routes; seek source-clear chemistry teaching that distinguishes models from observables and does not distribute copyrighted text. |
| Electronic-structure core | Many-Electron Problem; Hartree and Hartree–Fock Theory; Density-Functional Theory Foundations; Kohn–Sham DFT; Exchange–Correlation Functionals and Approximations; Self-Consistent-Field Methods | Existing reviewed routes plus first diversified DFT material; seek transparent theory-first Chinese and open-source explanations without collapsing the six responsibilities. |
| Numerical representations | Discretization and Basis Representations; Plane-Wave and Real-Space Methods; Localized-Orbital Methods; Pseudopotentials/PAW/Core–Valence Treatments | Existing reviewed routes; iFEM now provides a cross-page real-space bridge. Future additions must retain code/version and observable-convergence limits. |
| Advanced response and relativity | Relativistic Electronic Structure/Spin/Magnetism; Linear Response and Excited States; Many-Body Perturbation Theory and Quasiparticles | Existing reviewed routes; seek source-clear material that distinguishes ground-state derivatives, neutral excitations, and charged quasiparticle energies. |

## First-edition handoff notes

The additions are intentionally compact. Their prose is sufficient for a reader to
choose a route, but the following may benefit from later editorial refinement:

- the Linear Algebra transition from elementary matrices to the coordinate-free
  viewpoint could gain a concrete electronic-structure example;
- the Calculus page may need a gentler explanation of why completeness matters
  before readers enter real analysis;
- the iFEM paragraph assumes the reader already knows why a weak formulation
  changes the space in which a problem is solved.

No unresolved copyright, privacy, licence, or authorship ambiguity was accepted
into the public pages. Reference remains intentionally unfilled.
