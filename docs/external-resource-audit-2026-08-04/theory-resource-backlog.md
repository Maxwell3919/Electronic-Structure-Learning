# Theory external-resource backlog

Baseline reviewed: `8906164574c88a6f76207c6b1cfe77a39de76b34`

This file lists **new candidates and alternatives**, not text to paste into the site. Before integrating any item, Talos must compare it with the current page, verify the destination, and decide whether it adds a distinct role. Existing anchors identified in [`README.md`](README.md) must not be duplicated.

Priority: **P1** high-value page-local candidate; **P2** specialist or alternative route; **P3** reference-only unless a page gap is demonstrated.

---

## Mathematical Foundations

### Linear Algebra

Current need: strengthen the transition from introductory linear algebra to conditioning, sparse eigensolvers, generalized eigenproblems, and numerical practice.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-LA-01 | [MIT 18.065 — Matrix Methods in Data Analysis, Signal Processing, and Machine Learning](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/) | Applied continuation through SVD, low-rank structure, least squares, and matrix factorizations. | Broader data-analysis framing; not an electronic-structure eigensolver course. | P1 |
| T-LA-02 | [MIT 18.335 — Introduction to Numerical Methods](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/) | Graduate numerical-linear-algebra bridge through stability, QR/SVD, iterative methods, eigenproblems, FFTs, and performance. | Assumes mathematical maturity and programming. | P1 |
| T-LA-03 | [Interactive Linear Algebra, Georgia Tech](https://textbooks.math.gatech.edu/ila/) | Open textbook alternative with interactive visual explanations and exercises. | Does not cover sparse large-scale electronic-structure solvers in depth. | P2 |
| T-LA-04 | [SLEPc tutorials](https://slepc.upv.es/release/documentation/tutorials/) | Implementation bridge for large sparse eigenvalue and singular-value problems. | Library-specific; a successful solver run does not establish physical or basis convergence. | P2 |

### Calculus and Analysis

Current need: provide a clean progression from multivariable calculus to rigorous convergence and function-space reasoning.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-CA-01 | [MIT 18.01SC — Single Variable Calculus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/) | Complete self-study route for limits, derivatives, integrals, series, and approximation. | Introductory; does not provide functional or numerical analysis. | P2 |
| T-CA-02 | [MIT 18.02SC — Multivariable Calculus](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/) | Vector calculus, multiple integrals, gradients, line/surface integrals, and coordinate systems. | Does not address operator domains or discretization error. | P1 |
| T-CA-03 | [MIT 18.100A — Real Analysis](https://ocw.mit.edu/courses/18-100a-real-analysis-fall-2020/) | Rigorous route through limits, continuity, differentiation, integration, and metric-space arguments. | Proof-intensive and not a first calculus course. | P2 |
| T-CA-04 | [Active Calculus](https://activecalculus.org/) | Open, readable alternative with exercises and interactive material. | Primarily introductory calculus. | P3 |

### Differential Equations

Current need: connect analytic ODE/PDE study with weak formulations and executable boundary-value problems.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-DE-01 | [MIT 18.03SC — Differential Equations](https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/) | Full ODE route through linear systems, transforms, stability, and qualitative dynamics. | Does not replace the existing PDE route. | P2 |
| T-DE-02 | [Fundamentals of Numerical Computation](https://fncbook.com/) | Open numerical route through initial-value, boundary-value, interpolation, nonlinear, and PDE problems. | Examples emphasize general numerical mathematics, not electronic-structure operators. | P1 |
| T-DE-03 | [FEniCSx tutorial](https://jsdokken.com/dolfinx-tutorial/) | Executable weak-form and finite-element bridge for Poisson, elasticity, and time-dependent PDEs. | FEniCSx-specific; mesh convergence and physical modelling remain separate. | P1 |

### Fourier Analysis

Current need: strengthen the distinction among continuous transforms, discrete transforms, FFT algorithms, sampling, and aliasing.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-FA-01 | [MIT 18.085 — Computational Science and Engineering I](https://ocw.mit.edu/courses/18-085-computational-science-and-engineering-i-fall-2008/) | Connect Fourier methods, convolution, differential operators, matrices, and computational models. | Broad computational course; not a plane-wave DFT implementation. | P1 |
| T-FA-02 | [Stanford EE261 — The Fourier Transform and Its Applications](https://see.stanford.edu/Course/EE261) | Long-form Fourier series/transform course with signal and PDE applications. | Older platform and engineering emphasis; access should be rechecked. | P2 |
| T-FA-03 | [SciPy FFT tutorial](https://docs.scipy.org/doc/scipy/tutorial/fft.html) | Small executable bridge for DFT conventions, spectra, frequency ordering, and transforms. | Library-specific; numerical output does not define physical Fourier conventions automatically. | P2 |
| T-FA-04 | [FFTW manual](https://www.fftw.org/fftw3_doc/) | Reference for practical multidimensional FFT planning, normalization, and performance. | Implementation reference, not a conceptual course. | P3 |

### Functional Analysis and Variational Methods

Current need: add a bridge from weak formulations to computational variational problems without repeating the existing MIT/NPTEL/iFEM routes.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-FV-01 | [FEniCSx tutorial — fundamentals](https://jsdokken.com/dolfinx-tutorial/chapter1/fundamentals.html) | Concrete progression from strong equations to weak forms and finite-dimensional spaces. | Does not prove DFT existence or variational representability. | P2 |
| T-FV-02 | [MIT 18.155 — Differential Analysis](https://ocw.mit.edu/courses/18-155-differential-analysis-fall-2004/) | Advanced continuation through distributions, Sobolev spaces, elliptic operators, and PDE analysis. | High prerequisite load; reference-level for most learners. | P3 |

### Numerical Analysis

Current need: this is one of the highest-value Theory expansion targets because it connects mathematical error language to actual solvers used throughout the site.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-NA-01 | [Fundamentals of Numerical Computation](https://fncbook.com/) | Open textbook with Julia/Python/MATLAB implementations covering conditioning, approximation, linear systems, eigenvalues, nonlinear equations, ODEs, and PDEs. | General numerical text; electronic-structure-specific error layers must be supplied by the page. | P1 |
| T-NA-02 | [MIT 18.335 — Introduction to Numerical Methods](https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/) | Rigorous numerical linear algebra, stability, iterative methods, FFTs, and performance. | Graduate level. | P1 |
| T-NA-03 | [PETSc tutorials](https://petsc.org/release/tutorials/) | Scalable nonlinear, linear, time-integration, and optimization solver examples. | PETSc-specific; solver tolerance is not observable convergence. | P2 |
| T-NA-04 | [SLEPc tutorials](https://slepc.upv.es/release/documentation/tutorials/) | Large-scale sparse eigenproblem and spectral-transformation bridge. | Library-specific and assumes PETSc familiarity. | P2 |
| T-NA-05 | [Templates for the Solution of Linear Systems](https://www.netlib.org/templates/) | Durable reference for Krylov methods and preconditioning. | Older presentation; reference rather than first course. | P3 |

### Probability and Statistics

Current need: distinguish statistical sampling uncertainty from deterministic numerical and model errors.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-PS-01 | [Harvard Stat 110 — Probability](https://stat110.hsites.harvard.edu/) | Accessible full course through conditional probability, random variables, expectation, limit theorems, and Markov chains. | Does not cover scientific-computing uncertainty by itself. | P1 |
| T-PS-02 | [MIT 6.041SC — Probabilistic Systems Analysis](https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/) | Structured self-study alternative with problem sets and applications. | Engineering probability emphasis. | P2 |
| T-PS-03 | [PyMBAR documentation](https://pymbar.readthedocs.io/en/master/) | Executable route for correlated samples, free-energy estimation, uncertainty, and effective sample size. | Specialized statistical-mechanics estimator; not a generic error bar generator. | P1 |
| T-PS-04 | [emcee documentation](https://emcee.readthedocs.io/) | Practical ensemble-MCMC bridge for posterior sampling and diagnostics. | Bayesian model assumptions and convergence diagnostics must be explicit. | P2 |

### Group Theory and Symmetry

Current need: advanced crystallographic, little-group, double-group, magnetic-group, and band-representation resources.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-GS-01 | [Bilbao Crystallographic Server tutorials](https://www.cryst.ehu.es/tutorials/) | Institutional route through space groups, representations, k vectors, magnetic groups, and symmetry tools. | Tool results require correct structure, setting, spin/SOC model, and interpretation. | P1 |
| T-GS-02 | [ISOTROPY Software Suite](https://iso.byu.edu/) | Symmetry-mode, subgroup, phase-transition, and distortion analysis. | Software output does not determine energetic stability. | P1 |
| T-GS-03 | [GTPack](https://gtpack.org/) | Mathematica-based group-theory and tight-binding tools with electronic-structure examples. | Requires Mathematica and should not become the page's only formal route. | P2 |
| T-GS-04 | [spglib documentation](https://spglib.readthedocs.io/) | Programmatic symmetry detection and standardization bridge. | Tolerance-dependent classification is not a proof of exact physical symmetry. | P2 |
| T-GS-05 | [Topological Quantum Chemistry](https://www.topologicalquantumchemistry.com/) | Band representations, symmetry indicators, and materials database bridge. | A database label or indicator is not a complete topology claim. | P1 |

---

## Physical Foundations

### Classical Mechanics

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-CM-01 | [MIT 8.01SC — Classical Mechanics](https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/) | Complete introductory route through forces, energy, momentum, rotation, and oscillations. | Introductory and not a molecular-dynamics validation guide. | P2 |
| T-CM-02 | [David Tong — Dynamics and Relativity](https://www.damtp.cam.ac.uk/user/tong/dynamics.html) | Concise analytical-mechanics continuation through Lagrangian and Hamiltonian methods. | Lecture notes, not computational mechanics. | P1 |
| T-CM-03 | [SymPy Mechanics tutorials](https://docs.sympy.org/latest/tutorials/physics/mechanics/index.html) | Executable symbolic mechanics and normal-mode bridge. | Symbolic derivation does not establish physical-model adequacy or numerical stability. | P2 |

### Electromagnetism

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-EM-01 | [MIT 8.02SC — Electricity and Magnetism](https://ocw.mit.edu/courses/8-02sc-physics-ii-electricity-and-magnetism-fall-2010/) | Full undergraduate electrostatics, magnetostatics, induction, circuits, and Maxwell route. | Does not focus on periodic Coulomb kernels or electronic-structure boundary conventions. | P2 |
| T-EM-02 | [The Feynman Lectures on Physics, Volume II](https://www.feynmanlectures.caltech.edu/II_toc.html) | Open conceptual companion for fields, potentials, polarization, and matter. | Not a systematic problem-solving or computational course. | P2 |
| T-EM-03 | [MEEP tutorials](https://meep.readthedocs.io/en/latest/Python_Tutorials/) | Executable Maxwell-equation and optical-response bridge. | Full-wave electrodynamics is distinct from static Poisson electrostatics and ground-state DFT. | P2 |

### Quantum Mechanics

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-QM-01 | [MIT 8.04 — Quantum Physics I](https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/) | First rigorous course through wave mechanics, operators, bound states, and approximation. | Needs sustained problem solving. | P1 |
| T-QM-02 | [MIT 8.05 — Quantum Physics II](https://ocw.mit.edu/courses/8-05-quantum-physics-ii-fall-2013/) | Formal continuation through Hilbert spaces, angular momentum, spin, and identical particles. | Advanced undergraduate level. | P1 |
| T-QM-03 | [MIT 8.06 — Quantum Physics III](https://ocw.mit.edu/courses/8-06-quantum-physics-iii-spring-2018/) | Approximation methods, scattering, and advanced quantum mechanics. | Not electronic-structure many-body theory by itself. | P2 |
| T-QM-04 | [David Tong — Quantum Mechanics](https://www.damtp.cam.ac.uk/user/tong/qm.html) | Compact open lecture-note spine. | Text-only route with limited executable practice. | P2 |
| T-QM-05 | [QuTiP tutorials](https://qutip.org/qutip-tutorials/) | Executable finite-dimensional quantum-dynamics and open-system bridge. | QuTiP models are not direct substitutes for continuum electronic-structure calculations. | P2 |

### Thermodynamics

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-TH-01 | [MIT 5.60 — Thermodynamics and Kinetics](https://ocw.mit.edu/courses/5-60-thermodynamics-kinetics-spring-2008/) | Chemistry-oriented route through thermodynamic potentials, equilibrium, mixtures, and kinetics. | Kinetics and equilibrium quantities must remain distinct. | P1 |
| T-TH-02 | [NIST Chemistry WebBook](https://webbook.nist.gov/chemistry/) | Evaluated thermochemical and spectroscopic reference data. | Coverage and uncertainty vary; database values must match phase and conditions. | P1 |
| T-TH-03 | [Cantera thermodynamics examples](https://cantera.org/stable/examples/python/thermo/index.html) | Executable chemical-potential, phase, and equilibrium bridge. | Uses declared thermochemical models, not first-principles electronic free energies. | P2 |
| T-TH-04 | [pycalphad examples](https://pycalphad.org/docs/latest/examples/) | Computational phase-equilibrium and CALPHAD bridge. | Depends on assessed thermodynamic databases and model forms. | P2 |

### Statistical Mechanics

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-SM-01 | [MIT 8.333 — Statistical Mechanics I](https://ocw.mit.edu/courses/8-333-statistical-mechanics-i-statistical-mechanics-of-particles-fall-2013/) | Graduate route through ensembles, quantum statistics, fluctuations, and interacting systems. | Advanced and not a simulation-protocol guide. | P1 |
| T-SM-02 | [ALPS tutorials](https://alps.comp-phys.org/documentation/tutorials/) | Executable lattice-model, Monte Carlo, exact-diagonalization, and quantum many-body examples. | Model Hamiltonians and finite-size results require separate physical justification. | P2 |
| T-SM-03 | [PyMBAR](https://pymbar.readthedocs.io/en/master/) | Free-energy and correlated-sampling analysis bridge. | Requires equilibrated, representative data and estimator diagnostics. | P1 |

### Atomic and Molecular Physics

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-AM-01 | [NIST Atomic Spectra Database](https://physics.nist.gov/asd) | Critically evaluated atomic levels, wavelengths, and transition data. | Experimental/compiled reference; not a computational method tutorial. | P1 |
| T-AM-02 | [NIST CCCBDB](https://cccbdb.nist.gov/) | Experimental and calculated thermochemistry, structures, vibrations, and comparison tools for small molecules. | Restricted chemical and size coverage; release metadata must be visible. | P1 |
| T-AM-03 | [HITRAN](https://hitran.org/) | Spectroscopic line-data reference for molecules and atmospheres. | Domain-specific data and licensing/access conditions must be checked. | P2 |
| T-AM-04 | [ExoMol](https://www.exomol.com/) | Extensive molecular line lists and spectral resources. | High-temperature/astrophysical scope is not universal molecular spectroscopy. | P2 |
| T-AM-05 | [ARC — Alkali Rydberg Calculator](https://arc-alkali-rydberg-calculator.readthedocs.io/) | Executable atomic levels, matrix elements, fields, and Rydberg-state calculations. | Alkali-focused model and data assumptions must be stated. | P2 |

### Solid-State Physics

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-SSP-01 | [Topocondmat](https://topocondmat.org/) | Interactive course through tight binding, Berry phases, topological phases, superconductivity, and Majorana models. | Model-level intuition; not a material-specific ab initio validation route. | P1 |
| T-SSP-02 | [Purdue — From Atoms to Materials](https://nanohub.org/courses/FATM) | Electronic structure, bonding, bands, transport, and predictive materials modelling with nanoHUB exercises. | nanoHUB access and course version should be rechecked. | P1 |
| T-SSP-03 | [国防科技大学《简明固体物理》](https://www.bilibili.com/video/BV1zE411X7tg/) | Chinese official-course route through crystal structure, lattice dynamics, free electrons, and band theory. | Introductory and does not replace advanced many-body or numerical methods. | P1 |
| T-SSP-04 | [PythTB tutorials](https://pythtb.readthedocs.io/en/latest/tutorials.html) | Executable tight-binding, Berry-phase, edge-state, and Wannier-center bridge. | Toy and fitted models require separate mapping to real materials. | P2 |

### Crystallography

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-CR-01 | [IUCr teaching pamphlets](https://www.iucr.org/education/pamphlets) | Open crystallography explanations covering symmetry, diffraction, reciprocal space, and structure determination. | Pamphlet coverage is modular rather than one continuous course. | P1 |
| T-CR-02 | [Bilbao Crystallographic Server](https://www.cryst.ehu.es/) | Space-group, subgroup, representation, k-vector, and magnetic-crystallography reference ecosystem. | Correct input setting and tolerance remain essential. | P1 |
| T-CR-03 | [Crystallography Open Database](https://www.crystallography.net/cod/) | Open experimental structure collection. | Deposited structures vary in quality and do not supply relaxed first-principles models automatically. | P1 |
| T-CR-04 | [spglib documentation](https://spglib.readthedocs.io/) | Programmatic symmetry, standardization, and primitive-cell bridge. | Tolerance-sensitive; no energetic or phase-stability conclusion follows. | P2 |
| T-CR-05 | [SeeK-path](https://seekpath.readthedocs.io/) | Standardized cells and reciprocal-space paths. | A standardized band path is not a Brillouin-zone integration mesh or full-zone search. | P1 |
| T-CR-06 | [AFLOW Prototype Encyclopedia](https://aflow.org/prototype-encyclopedia/) | Structure prototypes, labels, and crystallographic relations. | Prototype assignment is descriptive and not proof of stability or synthesis. | P2 |

### Many-Body Physics

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-MB-01 | [TRIQS tutorials](https://triqs.github.io/triqs/latest/tutorials.html) | Executable Green-function, impurity-model, and DMFT ecosystem bridge. | Advanced and framework-specific; impurity construction and convergence must be stated. | P1 |
| T-MB-02 | [ALPS tutorials](https://alps.comp-phys.org/documentation/tutorials/) | Monte Carlo, exact diagonalization, DMRG, and lattice-model examples. | Model Hamiltonians and finite-size studies do not directly validate ab initio materials. | P2 |
| T-MB-03 | [TeNPy documentation and examples](https://tenpy.readthedocs.io/) | Tensor-network and DMRG learning route. | Primarily low-dimensional model systems. | P2 |
| T-MB-04 | [ITensor tutorials](https://itensor.org/docs.cgi?page=tutorials) | Tensor-network implementation alternative. | Library-specific and requires careful truncation/error analysis. | P2 |
| T-MB-05 | [QuSpin documentation](https://quspin.github.io/QuSpin/) | Exact-diagonalization and dynamics notebooks for quantum many-body models. | System size and model mapping limit claims. | P2 |
| T-MB-06 | [cond-mat.de lecture collections](https://www.cond-mat.de/events/) | Durable archive of advanced correlated-electron and many-body schools. | Individual volumes vary by topic and access format; select page-locally. | P1 |

---

## Chemical Foundations

### General Chemistry

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-GC-01 | [OpenStax Chemistry 2e](https://openstax.org/details/books/chemistry-2e) | Open full textbook for stoichiometry, bonding, equilibrium, thermochemistry, kinetics, and electrochemistry. | General chemistry level; electronic-structure interpretations remain later topics. | P1 |
| T-GC-02 | [MIT 5.111SC — Principles of Chemical Science](https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/) | Structured self-study course with problems and demonstrations. | Broad foundation rather than computational chemistry. | P1 |
| T-GC-03 | [Chemistry LibreTexts](https://chem.libretexts.org/) | Large open collection for alternative explanations and topic lookup. | Quality and depth vary by book; recommend specific modules rather than the whole portal when possible. | P2 |

### Physical Chemistry

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-PC-01 | [Physical Chemistry, Yingbin Ge — Open Textbook Library](https://open.umn.edu/opentextbooks/textbooks/1955) | Open integrated text spanning thermodynamics, kinetics, quantum chemistry, spectroscopy, statistics, and computation. | Broad undergraduate route; verify edition and chapter numbering before citation. | P1 |
| T-PC-02 | [MIT 5.60 — Thermodynamics and Kinetics](https://ocw.mit.edu/courses/5-60-thermodynamics-kinetics-spring-2008/) | Rigorous thermodynamic and kinetic spine. | Does not replace quantum or spectroscopic modules. | P2 |
| T-PC-03 | [MolSSI Education](https://education.molssi.org/) | Programming, data analysis, molecular simulation, and computational-science best-practice hub. | Workshop-oriented and not one physical-chemistry course. | P1 |

### Quantum Chemistry

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-QC-01 | [Quantum Chemistry Jupyter Book](https://qchem.qc-edu.org/) | Open CC0 notebook-based course through quantum postulates, spectroscopy, Hückel theory, HF, and DFT. | Course emphasis and software environment should remain visible. | P1 |
| T-QC-02 | [eChem](https://kthpanor.github.io/echem/) | Interactive quantum-chemistry theory and workflow notebooks. | Advanced modules and software dependencies require version checks. | P1 |
| T-QC-03 | [MolSSI Quantum Mechanics Tools](https://education.molssi.org/qm-tools/) | Early-career hands-on route for molecular calculations, scans, geometry optimization, parsing, and plotting. | Workflow exercises do not establish method or basis accuracy. | P1 |
| T-QC-04 | [Psi4Education](https://psicode.org/posts/psi4education/) | Free computational chemistry laboratory notebooks across chemistry curricula. | Psi4/WebMO-specific and not a full theory course. | P2 |
| T-QC-05 | [PySCF user guide and examples](https://pyscf.org/user/) | Transparent Python implementation bridge from HF/DFT to correlated and periodic methods. | Code examples are not benchmark or convergence evidence. | P2 |

### Chemical Bonding and Molecular Structure

Current need: provide multiple interpretation frameworks while preventing users from treating any one partition as a unique observable.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-CB-01 | [Critic2](https://aoterodelaroza.github.io/critic2/) | Electron-density topology, critical points, basins, and periodic QTAIM analysis. | Density topology is one declared interpretation framework. | P1 |
| T-CB-02 | [LOBSTER](https://www.cohp.de/) | COHP/COOP, projected bonding, charges, and wavefunction reconstruction from plane-wave calculations. | Projection quality and basis reconstruction must be checked; COHP is not a unique bond observable. | P1 |
| T-CB-03 | [Multiwfn](http://sobereva.com/multiwfn/) | Broad wavefunction, density, orbital, population, ELF, NCI, and spectroscopy analysis. | Very broad tool; each analysis requires its own definition and validation. | P1 |
| T-CB-04 | [Chargemol / DDEC](https://sourceforge.net/projects/ddec/) | Density-derived atomic charge, bond-order, and related partitioning. | DDEC results depend on the declared version and partition model. | P2 |
| T-CB-05 | [Henkelman-group Bader analysis](https://theory.cm.utexas.edu/henkelman/code/bader/) | Widely used real-space basin partitioning implementation. | Grid and reference-density convergence matter; Bader charge is not formal oxidation state. | P2 |
| T-CB-06 | [NCIplot](https://github.com/aoterodelaroza/nciplot) | Reduced-density-gradient visualization of noncovalent interactions. | Qualitative surfaces do not provide interaction energies or unique bond classification. | P2 |

### Inorganic Chemistry

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-IC-01 | [MIT 5.03 — Principles of Inorganic Chemistry I](https://ocw.mit.edu/courses/5-03-principles-of-inorganic-chemistry-i-fall-2005/) | Symmetry, bonding, coordination, and transition-metal foundation. | Older course materials; verify link availability. | P2 |
| T-IC-02 | [Inorganic Chemistry LibreTexts](https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry) | Open alternatives for coordination chemistry, ligand fields, organometallics, and f-block chemistry. | Select a coherent book or module; portal quality is heterogeneous. | P1 |
| T-IC-03 | [CCDC educational resources](https://www.ccdc.cam.ac.uk/community/educationalresources/) | Crystal-structure and molecular-geometry teaching material. | Some tools/data may require registration or licensing. | P2 |

### Solid-State Chemistry

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-SSC-01 | [MIT 3.091SC — Introduction to Solid-State Chemistry](https://ocw.mit.edu/courses/3-091sc-introduction-to-solid-state-chemistry-fall-2010/) | Full beginner route through bonding, structures, defects, electronic properties, and materials chemistry. | Introductory; does not replace phase-diagram or defect calculations. | P1 |
| T-SSC-02 | [Materials Project phase-diagram documentation](https://docs.materialsproject.org/methodology/materials-methodology/thermodynamic-stability/phase-diagrams-pds) | Computed convex-hull and chemical-potential interpretation bridge. | Database methodology, corrections, and phase set determine conclusions. | P1 |
| T-SSC-03 | [pymatgen phase-diagram module](https://pymatgen.org/pymatgen.analysis.html#module-pymatgen.analysis.phase_diagram) | Executable composition, hull, and chemical-potential analysis. | Input energies and correction compatibility must be established first. | P2 |
| T-SSC-04 | [AFLOW Prototype Encyclopedia](https://aflow.org/prototype-encyclopedia/) | Structure-type and prototype reference. | Prototype similarity does not imply phase stability or identical chemistry. | P2 |
| T-SSC-05 | [Crystallography Open Database](https://www.crystallography.net/cod/) | Open experimental structure source. | Structure provenance and quality require checking before calculation. | P1 |

### Surface and Interface Chemistry

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-SI-01 | [ASE surface builders](https://wiki.fysik.dtu.dk/ase/ase/build/surface.html) | Executable slab, surface, adsorption-site, and interface construction bridge. | Builder output does not choose a converged slab, termination, coverage, or reservoir. | P1 |
| T-SI-02 | [GPAW surface tutorials](https://gpaw.readthedocs.io/tutorialsexercises/surface/) | Work functions, adsorption, surfaces, and electrostatic setup examples. | GPAW-specific examples and settings are not transferable defaults. | P1 |
| T-SI-03 | [pymatgen interfaces module](https://pymatgen.org/pymatgen.analysis.interfaces.html) | Grain-boundary, substrate matching, and interface construction tools. | Geometric matching does not establish thermodynamic or kinetic stability. | P2 |
| T-SI-04 | [Catalysis-Hub](https://www.catalysis-hub.org/) | Open calculated adsorption and surface-reaction data with APIs. | Dataset methods, surfaces, coverages, and references must match the claim. | P1 |
| T-SI-05 | [Open Catalyst Project](https://opencatalystproject.org/) | Large catalyst datasets, benchmarks, and models. | ML benchmarks and relaxed structures do not replace first-principles validation for a new system. | P2 |
| T-SI-06 | [CatMAP](https://catmap.readthedocs.io/) | Microkinetic modelling bridge from energetics to rates and coverages. | Requires a declared mechanism, thermochemistry, barriers, and kinetic assumptions. | P1 |

---

## Electronic Structure Theory

### The Many-Electron Problem

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-MEP-01 | [QMCPACK tutorials](https://qmcpack.readthedocs.io/en/develop/lab_qmc_basics.html) | Variational and diffusion Monte Carlo learning route for atoms, molecules, and solids. | Trial-wavefunction, finite-size, pseudopotential, and statistical errors remain. | P1 |
| T-MEP-02 | [NECI documentation](https://www.neci.readthedocs.io/) | FCIQMC and stochastic many-electron solver route. | Advanced, system-size-limited, and implementation-specific. | P2 |
| T-MEP-03 | [HANDE-QMC documentation](https://hande.readthedocs.io/) | FCIQMC, CCMC, and finite-temperature stochastic many-body examples. | Statistical and initiator/truncation errors must be analysed. | P2 |
| T-MEP-04 | [Dice](https://sanshar.github.io/Dice/) | Selected-CI and related high-accuracy wavefunction methods. | Selected-space and perturbative convergence must be demonstrated. | P2 |
| T-MEP-05 | [PySCF FCI examples](https://pyscf.org/user/ci.html) | Transparent small-system bridge to exact diagonalization in finite orbital spaces. | Exact only within the chosen finite basis and Hamiltonian. | P2 |

### Hartree and Hartree–Fock Theory

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-HF-01 | [Psi4NumPy](https://github.com/psi4/psi4numpy) | Readable reference implementations of HF and post-HF methods in NumPy. | Educational implementations are not production-performance or convergence prescriptions. | P1 |
| T-HF-02 | [Crawford Group Programming Projects](https://github.com/CrawfordGroup/ProgrammingProjects) | Stepwise computational quantum-chemistry implementation exercises. | Requires prior quantum chemistry, Python/C++, and careful version handling. | P1 |
| T-HF-03 | [PySCF SCF guide](https://pyscf.org/user/scf.html) | RHF/UHF/ROHF, convergence, stability, symmetry, and initial-guess implementation bridge. | Code settings do not establish determinant stability or basis convergence automatically. | P2 |
| T-HF-04 | [eChem Hartree–Fock modules](https://kthpanor.github.io/echem/) | Interactive derivation and executable notebook alternative. | Module dependencies and software versions must be checked. | P2 |

### Density Functional Theory: Foundations

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-DFT-01 | [DFT particle-in-a-box notebooks](https://github.com/tjz21/DFT_PIB_Code) | Pedagogical notebooks exposing density, functionals, KS iteration, and approximation ideas. | Toy models do not validate real materials or practical functionals. | P1 |
| T-DFT-02 | [DFTK introductory resources](https://docs.dftk.org/dev/guide/introductory_resources/) | Curated route linking DFT theory, numerical analysis, schools, and an inspectable implementation. | Julia and DFTK-specific implementation context. | P1 |
| T-DFT-03 | [Octopus tutorials](https://www.octopus-code.org/documentation/main/tutorial/) | Real-space ground-state and time-dependent DFT bridge with linked tutorial series. | Software tutorial; formulation and convergence remain problem-specific. | P2 |
| T-DFT-04 | [GPAW basic theory documentation](https://gpaw.readthedocs.io/documentation/basic.html) | Concise DFT/PAW implementation bridge. | Documentation is not a foundational proof or universal PAW prescription. | P2 |

### Kohn–Sham Density Functional Theory

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-KS-01 | [DFTK periodic problems and KS examples](https://docs.dftk.org/stable/guide/periodic_problems/) | Transparent route from periodic Schrödinger blocks to finite k grids and KS implementation. | Deliberately simple models and DFTK conventions. | P1 |
| T-KS-02 | [PySCF DFT guide](https://pyscf.org/user/dft.html) | Molecular and periodic KS-DFT implementation with explicit grids and functional choices. | Code execution does not validate functional or grid/basis convergence. | P2 |
| T-KS-03 | [Octopus ground-state tutorials](https://octopus-code.org/main/tutorials/) | Real-space alternative for density, orbitals, grids, and finite/periodic systems. | Version and boundary-condition choices must be declared. | P2 |

### Exchange–Correlation Functionals and Approximations

Current need: add durable implementation and benchmark resources without turning rankings into universal recommendations.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-XC-01 | [Libxc](https://libxc.gitlab.io/) | Maintained catalogue and implementation reference for exchange, correlation, and kinetic-energy functionals. | Availability in Libxc is not evidence of accuracy for a target system. | P1 |
| T-XC-02 | [DFT-D4 documentation](https://dftd4.readthedocs.io/) | Modern atom-pairwise dispersion correction implementation and parameter reference. | Dispersion correction must be matched to the parent functional and target property. | P1 |
| T-XC-03 | [libMBD](https://libmbd.github.io/) | Many-body-dispersion implementation and theory bridge. | MBD assumptions, damping, and electronic-structure coupling remain method-specific. | P2 |
| T-XC-04 | [GMTKN55](https://www.chemie.uni-bonn.de/pctc/mulliken-center/software/GMTKN/gmtkn55) | Broad molecular benchmark collection for main-group thermochemistry, kinetics, and noncovalent interactions. | Molecular benchmark rankings are not universal solid-state or transition-metal rankings. | P1 |
| T-XC-05 | [ACCDB](https://accdb.chem.pmf.unizg.hr/) | Curated computational-chemistry benchmark database and machine-readable data. | Dataset scope and reference level must be matched to the claim. | P2 |

### Self-Consistent Field Methods

Current need: one of the highest-priority additions because readers need fixed-point, dielectric, mixing, and failure-diagnosis resources rather than parameter recipes.

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-SCF-01 | [DFTK — Analysing SCF convergence](https://docs.dftk.org/stable/examples/analysing_scf_convergence/) | Direct explanation of Jacobians, dielectric operators, condition numbers, Kerker-like mixing, and preconditioning. | DFTK examples do not provide universal mixing parameters. | P1 |
| T-SCF-02 | [SIESTA SCF-cycle tutorial](https://docs.siesta-project.org/projects/siesta/en/stable/tutorials/basic/scf-convergence/) | Practical residual, mixer, and convergence behaviour in a localized-orbital code. | SIESTA keywords and examples are version-specific. | P1 |
| T-SCF-03 | [PySCF SCF guide](https://pyscf.org/user/scf.html) | Molecular SCF guesses, DIIS, Newton solvers, level shifts, stability analysis, and open-shell variants. | Molecular Gaussian-basis context differs from periodic plane-wave mixing. | P1 |
| T-SCF-04 | [CP2K — How to make an SCF run converge](https://manual.cp2k.org/trunk/methods/dft/scf.html) | GPW/local-basis convergence and solver guidance. | CP2K-specific; troubleshooting steps are not scientific validation. | P2 |
| T-SCF-05 | [Psi4 SCF documentation](https://psicode.org/psi4manual/master/scf.html) | Alternative molecular SCF implementation and convergence reference. | Version-specific and molecule-focused. | P2 |

### Discretization and Basis Representations

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-DB-01 | [Basis Set Exchange](https://www.basissetexchange.org/) | Versioned Gaussian basis metadata, references, and format conversion. | Named basis retrieval does not establish basis completeness. | P1 |
| T-DB-02 | [iFEM](https://jschoeberl.github.io/iFEM/) | Weak forms, finite elements, multigrid, and iterative-solver notebooks. | General PDE discretization rather than electronic structure. | P1 |
| T-DB-03 | [DFT-FE documentation](https://dftfe.org/) | High-order finite-element electronic-structure implementation bridge. | Software-specific and advanced. | P2 |
| T-DB-04 | [BigDFT Suite documentation](https://bigdft-suite.readthedocs.io/) | Wavelet basis, localization, workflows, and analysis. | Wavelet implementation does not remove basis and boundary convergence. | P2 |
| T-DB-05 | [MRChem documentation](https://mrchem.readthedocs.io/) | Multiwavelet molecular electronic-structure alternative. | Molecular focus and software-specific numerical controls. | P2 |

### Plane-Wave and Real-Space Methods

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-PW-01 | [Quantum ESPRESSO Learn](https://www.quantum-espresso.org/learn/) | Maintained gateway to hands-on tutorials, schools, and theoretical background. | Individual schools and syntax are version-bound. | P1 |
| T-PW-02 | [ABINIT tutorial overview](https://docs.abinit.org/tutorial/) | Structured progression from basic plane-wave DFT through DFPT, GW, DMFT, and parallelism. | ABINIT-specific input and workflow. | P1 |
| T-PW-03 | [GPAW tutorials](https://gpaw.readthedocs.io/tutorialsexercises/) | Grid, finite-difference, plane-wave, LCAO, PAW, response, and property examples. | GPAW-specific; mode agreement requires independent convergence. | P1 |
| T-PW-04 | [Octopus tutorials](https://octopus-code.org/main/tutorials/) | Real-space finite-system, periodic, optical-response, and time-dependent route. | Grid and boundary settings are problem-specific. | P1 |
| T-PW-05 | [SPARC](https://sparc-x.github.io/) | Real-space finite-difference DFT code and documentation. | Specialist implementation; confirm current tutorial depth. | P2 |
| T-PW-06 | [JDFTx tutorials](https://jdftx.org/1.7.0/Tutorials.html) | Plane-wave DFT, continuum solvation, surfaces, and advanced properties. | Versioned documentation; examples are not transferable defaults. | P2 |
| T-PW-07 | [BigDFT Suite](https://bigdft-suite.readthedocs.io/) | Wavelet and localized real-space alternative. | Different representation and convergence behaviour must remain explicit. | P2 |

### Localized-Orbital Methods

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-LO-01 | [SIESTA tutorials](https://docs.siesta-project.org/projects/siesta/en/stable/tutorials/) | Comprehensive basis, grid, SCF, magnetism, phonon, TDDFT, Wannier, NEB, and transport route. | SIESTA-specific; basis labels and cutoff radii are not portable. | P1 |
| T-LO-02 | [FHI-aims tutorials](https://fhi-aims-club.gitlab.io/tutorials/tutorials-overview/) | All-electron numeric-atomic-orbital route from basics to surfaces, response, GW/BSE, transport, and workflows. | Code access and version-specific settings must be stated. | P1 |
| T-LO-03 | [FHI-aims Tutorial Series 2021](https://fhi-aims.org/useful-things/fhi-aims-tutorial-series-2021) | Keynote-plus-hands-on route emphasizing accuracy, efficiency, and reproducibility. | Event-specific environment and code version. | P1 |
| T-LO-04 | [CP2K DFT documentation](https://manual.cp2k.org/trunk/methods/dft/index.html) | Gaussian-and-plane-wave representation, basis/potential pairs, grids, SCF, hybrids, and constraints. | CP2K-specific GPW/GAPW conventions. | P2 |
| T-LO-05 | [DFTB+ Recipes](https://dftbplus-recipes.readthedocs.io/) | Executable density-functional tight-binding route. | DFTB parameter sets and transferability are separate scientific inputs. | P2 |

### Pseudopotentials, PAW, and Core–Valence Treatments

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-PP-01 | [PseudoDojo](https://www.pseudo-dojo.org/) | Generation inputs, grading, convergence hints, and validation reports for ONCV pseudopotentials. | Dojo grades cover declared tests, not every system or observable. | P1 |
| T-PP-02 | [ONCVPSP documentation](https://oncvpsp.github.io/oncvpsp/) | Official generator implementation and test-suite route. | Generation requires atomic and scattering expertise; successful generation is not transferability proof. | P1 |
| T-PP-03 | [SSSP](https://www.materialscloud.org/discover/sssp/table/efficiency) | Curated precision/efficiency pseudopotential verification tables. | Covered tests and target code/version must remain visible. | P1 |
| T-PP-04 | [PSlibrary](https://dalcorso.github.io/pslibrary/) | Quantum ESPRESSO PAW/ultrasoft generation library and source inputs. | Dataset quality and recommended cutoffs remain system-dependent. | P2 |
| T-PP-05 | [GBRV pseudopotential library](https://www.physics.rutgers.edu/gbrv/) | Broad ultrasoft/PAW verification reference. | Older generation choices and functional scope must be stated. | P2 |
| T-PP-06 | [SG15 ONCV potentials](http://quantum-simulation.org/potentials/sg15_oncv/) | Alternative norm-conserving library and generation lineage. | Verify current hosting and relativistic/functional coverage. | P2 |
| T-PP-07 | [SIESTA generation and testing tutorial](https://docs.siesta-project.org/projects/siesta/en/stable/tutorials/advanced/pseudopotentials/) | Pedagogical route through pseudopotential generation and testing. | SIESTA/PSML context and school version must be retained. | P1 |

### Brillouin-Zone Sampling

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-BZ-01 | [SeeK-path](https://seekpath.readthedocs.io/) | Standard cells and conventional high-symmetry paths. | Band paths are not integration meshes or full-zone searches. | P1 |
| T-BZ-02 | [spglib](https://spglib.readthedocs.io/) | Symmetry reduction and standardized reciprocal-cell bridge. | Tolerance-dependent symmetry and magnetic/SOC validity must be checked. | P2 |
| T-BZ-03 | [sumo k-point tools](https://smtg-bham.github.io/sumo/) | Practical k-path generation, band/DOS plotting, and convergence-support utilities. | Post-processing conventions do not validate the underlying mesh or calculation. | P2 |
| T-BZ-04 | [pymatgen HighSymmKpath](https://pymatgen.org/pymatgen.symmetry.html#module-pymatgen.symmetry.bandstructure) | Programmatic path conventions and structure transformations. | Different conventions can yield different labelled paths; none is a BZ quadrature. | P2 |
| T-BZ-05 | [AFLOW standard paths](https://aflow.org/aflow-online/aflow-standard/) | Alternative crystallographic standardization and band-path reference. | Must not be mixed silently with another cell convention. | P3 |

### Relativistic Electronic Structure, Spin, and Magnetism

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-RM-01 | [exciting tutorials](https://exciting-code.org/home/tutorials) | All-electron LAPW route through SOC, magnetism, response, BSE, and properties using executable notebooks. | Code-specific and all-electron numerical convergence remains. | P1 |
| T-RM-02 | [FLEUR](https://www.flapw.de/) | Full-potential LAPW magnetism, SOC, spin textures, and response ecosystem. | Select a maintained tutorial page before integration. | P2 |
| T-RM-03 | [TB2J documentation](https://tb2j.readthedocs.io/) | Extract magnetic exchange interactions from Wannier/local-orbital Hamiltonians. | Mapping to a spin Hamiltonian, reference state, and interaction range must be validated. | P1 |
| T-RM-04 | [Spirit](https://spirit-code.github.io/) | Atomistic spin-dynamics and magnetic-texture simulation bridge. | Requires a justified spin Hamiltonian; not an ab initio ground-state solver. | P2 |
| T-RM-05 | [UppASD](https://uppasd.github.io/UppASD-manual/) | Atomistic spin dynamics, thermodynamics, and magnetic excitations. | Parameters and coarse-graining determine applicability. | P2 |
| T-RM-06 | [Magnopy](https://magnopy.readthedocs.io/) | Magnetic-model analysis and spin-Hamiltonian utilities. | Model construction and parameter provenance remain separate. | P2 |

### Linear Response and Excited States

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-LR-01 | [ABINIT DFPT topic and tutorials](https://docs.abinit.org/topics/DFPT/) | Structured phonon, dielectric, Born charge, elastic, nonlinear, and electron–phonon response route. | ABINIT workflow and response implementation are version-specific. | P1 |
| T-LR-02 | [Quantum ESPRESSO Learn](https://www.quantum-espresso.org/learn/) | Gateway to PHonon, DFPT, electron–phonon, and advanced schools. | Select a current school/tutorial rather than citing the portal alone where possible. | P1 |
| T-LR-03 | [GPAW response documentation](https://gpaw.readthedocs.io/documentation/response/) | Dielectric response, optical spectra, susceptibilities, and related implementations. | GPAW-specific approximations and convergence. | P1 |
| T-LR-04 | [Octopus optical-response tutorials](https://octopus-code.org/main/tutorials/) | Real-time and linear-response TDDFT route. | Finite-time, grid, boundary, broadening, and functional choices remain. | P1 |
| T-LR-05 | [exciting tutorials](https://exciting-code.org/home/tutorials) | All-electron optics, TDDFT/BSE, and response alternative. | Software-specific and advanced. | P2 |
| T-LR-06 | [WEST documentation](https://west-code.org/doc/West/latest/) | Large-scale perturbative spectral and response calculations. | Specialist code and HPC workflow. | P2 |

### Many-Body Perturbation Theory and Quasiparticles

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-GW-01 | [GPAW GW and BSE tutorials](https://gpaw.readthedocs.io/tutorialsexercises/opticalresponse/) | Accessible Python-based quasiparticle and optical-response implementation route. | GPAW-specific basis, response, and convergence choices. | P1 |
| T-GW-02 | [ABINIT many-body tutorials](https://docs.abinit.org/tutorial/) | Structured GW, BSE, screening, and convergence examples. | ABINIT versions and datasets must be visible. | P1 |
| T-GW-03 | [WEST](https://west-code.org/) | Large-scale GW, dielectric, and spectral calculations without explicit empty-state sums in selected methods. | Specialist algorithms; not interchangeable with all GW variants. | P2 |
| T-GW-04 | [exciting tutorials](https://exciting-code.org/home/tutorials) | Full-potential all-electron GW/BSE route with executable notebooks. | Advanced and code-specific. | P2 |
| T-GW-05 | [FHI-aims Tutorial Series — Beyond DFT](https://fhi-aims.org/useful-things/fhi-aims-tutorial-series-2021) | RPA, GW, and BSE lectures plus molecule/solid hands-on material. | Event and code version boundary. | P1 |
| T-GW-06 | [GW100](https://gw100.wordpress.com/) | Molecular GW benchmark and cross-code comparison reference. | Molecular benchmark scope does not determine solid-state or low-dimensional accuracy. | P1 |

### Berry Phases and Electronic Topology

| ID | Resource | Recommended role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| T-BT-01 | [PythTB tutorials](https://pythtb.readthedocs.io/en/latest/tutorials.html) | Executable Berry phase, curvature, hybrid-Wannier, edge-state, and model-topology route. | Model Hamiltonians require a justified mapping to materials. | P1 |
| T-BT-02 | [Z2Pack](https://z2pack.greschd.ch/) | Hybrid-Wannier-center computation for model, tight-binding, and ab initio systems. | Convergence, occupied subspace, gap, symmetry, and interface correctness remain. | P1 |
| T-BT-03 | [WannierTools tutorials](https://www.wanniertools.org/tutorials/) | Wilson loops, surface states, Weyl/Dirac points, spin texture, and tight-binding analysis. | Quality of the Wannier Hamiltonian and selected subspace must be established first. | P1 |
| T-BT-04 | [WannierBerri tutorials](https://tutorial.wannier-berri.org/) | Berry curvature, anomalous Hall, orbital magnetization, nonlinear and transport observables. | Dense-mesh interpolation and symmetry settings require convergence. | P1 |
| T-BT-05 | [Topological Quantum Chemistry](https://www.topologicalquantumchemistry.com/) | Band representations, symmetry indicators, and materials lookup. | Indicators and database classifications do not replace invariant and gap checks. | P1 |
| T-BT-06 | [irvsp](https://github.com/zjwang11/irvsp) | Irreducible-representation extraction for selected electronic-structure outputs. | Version/interface, symmetry setting, SOC, magnetism, and band ordering must be checked. | P2 |
| T-BT-07 | [qeirreps](https://github.com/giovannipizzi/qeirreps) | Quantum ESPRESSO representation-analysis bridge. | Tool compatibility and numerical degeneracy handling must be verified. | P2 |

---

## Suggested Theory integration waves

1. **Numerics wave:** Numerical Analysis, SCF, Discretization, Plane-Wave/Real-Space, Localized Orbitals, Pseudopotentials, BZ Sampling.
2. **Chemistry interpretation wave:** Quantum Chemistry, Chemical Bonding, Inorganic, Solid-State Chemistry, Surfaces/Interfaces.
3. **Response and advanced methods wave:** Linear Response, GW/BSE, Many-Body, Berry/Topology, Relativistic/Magnetism.
4. **Foundation diversity wave:** add Chinese or interactive alternatives only where they provide a genuinely distinct learning role.

For each page, prefer no more than one new resource of each role: rigorous course, accessible/Chinese route, executable bridge, official implementation, benchmark/reference.
