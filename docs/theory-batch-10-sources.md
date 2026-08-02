# Theory batch 10 source review

Reviewed: 2026-08-03

Scope:

- Probability and Statistics
- Classical Mechanics
- Thermodynamics

This record identifies the role and limitations of the sources used to delimit the three public pages. It does not reproduce textbook content, figures, tables, lecture transcripts, or exercise solutions and does not constitute an exhaustive comparison of every course or book.

## Planning source

### Electronic Structure Atlas Theory systematic-review report

Role: classification, dependency, Tier-3 priority, candidate-resource, and scope review.

The report assigns:

- Probability and Statistics to random variables, expectation, variance, conditional probability, sampling, uncertainty, Monte Carlo, Markov chains, bootstrap, and benchmark statistics;
- Classical Mechanics to energy, generalized coordinates, oscillations, normal modes, Lagrangian/Hamiltonian structure, classical nuclei, molecular dynamics, and Born–Oppenheimer/phonon connections;
- Thermodynamics to laws, state variables, entropy, free energies, equilibrium, chemical potentials, phase stability, and finite-temperature interpretation.

The report explicitly warns that MIT 18.175 is too advanced to serve as the default beginner probability course and requires a separately screened introductory resource. It also classifies Classical Mechanics as background rather than a strict prerequisite for ordinary Kohn–Sham DFT, and requires Thermodynamics to avoid identifying zero-temperature total-energy rankings with complete stability.

## Probability and Statistics

### MIT OpenCourseWare 18.05 — Introduction to Probability and Statistics

Official destination: <https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/>

Role: preferred introductory resource for probability models, random variables, distributions, expectation, variance, conditional probability, Bayesian and frequentist inference, confidence intervals, regression, simulation, and bootstrap methods.

Use in this page: closes the introductory-resource gap recorded in the report and supports the page's minimum route from probability distributions to finite-sample estimates and uncertainty statements.

Boundary: the course is a general introduction rather than an electronic-structure-specific treatment. It does not prescribe a quantum Monte Carlo estimator, molecular-dynamics sampling protocol, benchmark dataset, uncertainty-propagation model, or scientific acceptance criterion.

### MIT OpenCourseWare 18.175 — Theory of Probability

Official destination: <https://ocw.mit.edu/courses/18-175-theory-of-probability-spring-2014/>

Role: advanced continuation in measure-theoretic probability and stochastic processes.

Boundary: it requires real-analysis preparation and is not the default starting point for an electronic-structure learner. It is retained only for readers who need a rigorous probability foundation beyond the Atlas core intersection.

## Classical Mechanics

### MIT OpenCourseWare 8.01SC — Classical Mechanics

Official destination: <https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/>

Role: first-course foundation in forces, energy, momentum, angular momentum, torque, and conservation laws.

Use in this page: supplies the minimum Newtonian and conservation-law background before generalized coordinates, forces on nuclei, and trajectory integration.

Boundary: the course is broader than the electronic-structure route and includes topics that are not prerequisites for DFT. It does not establish the validity of classical nuclei, Born–Oppenheimer dynamics, a particular integrator, thermostat, or force calculation.

### MIT OpenCourseWare 8.223 — Classical Mechanics II

Official destination: <https://ocw.mit.edu/courses/8-223-classical-mechanics-ii-january-iap-2017/>

Role: advanced bridge through Lagrangian mechanics, conserved quantities, small oscillations, Hamiltonian mechanics, Poisson brackets, and canonical transformations.

Use in this page: supports the variational trajectory principle, generalized coordinates, Hamiltonian phase-space structure, and normal-mode formulation.

Boundary: a formal mechanics course does not validate electronic forces, time steps, constraints, thermostats, trajectory sampling, or the Born–Oppenheimer approximation for a particular system.

### Supplied electronic-structure texts

Role: the supplied Sholl–Steckel material connects the classical harmonic oscillator and normal modes to DFT vibrational calculations and zero-point energy. The supplied electronic-structure references connect force constants, dynamical matrices, Born–Oppenheimer assumptions, and phonon normal modes.

Boundary: the public page uses original prose and MathML. No pages, figures, tables, or exercise solutions from the supplied books are copied. The harmonic and adiabatic approximations are stated rather than treated as universally valid.

## Thermodynamics

### MIT OpenCourseWare 8.044 — Statistical Physics I

Official destination: <https://ocw.mit.edu/courses/8-044-statistical-physics-i-spring-2013/>

Role: physics route through probability, thermodynamic laws, state variables, equilibrium, entropy, and introductory statistical mechanics.

Use in this page: provides the macroscopic thermodynamic foundation and a bridge to the separate Statistical Mechanics page.

Boundary: 8.044 combines thermodynamics and statistical mechanics in one course, but the Atlas keeps their responsibilities separate. The course does not choose a material-specific free-energy decomposition or phase set.

### MIT OpenCourseWare 5.60 — Thermodynamics & Kinetics

Official destination: <https://ocw.mit.edu/courses/5-60-thermodynamics-kinetics-spring-2008/>

Role: chemistry route through state functions, entropy, Gibbs free energy, chemical potential, chemical and phase equilibrium, and reaction kinetics.

Use in this page: supports chemical-potential, phase-equilibrium, and open-system reasoning relevant to defects, surfaces, adsorption, and materials stability.

Boundary: the kinetic half extends beyond this page's equilibrium responsibility. It does not prescribe reservoirs, defect corrections, finite-temperature contributions, phase candidates, or a synthesis criterion for a particular calculation.

## Cross-source synthesis used by the public pages

The accepted page boundaries are:

- Probability and Statistics: probability models, expectation, conditional probability, finite and correlated sampling, Monte Carlo estimators, inference, benchmark metrics, and uncertainty categories; not a substitute for deterministic convergence or method validation.
- Classical Mechanics: generalized coordinates, Lagrangian/Hamiltonian dynamics, Born–Oppenheimer forces, harmonic normal modes, numerical integration, and ensemble-aware trajectories; not a claim that classical nuclei, harmonic dynamics, or one trajectory is universally adequate.
- Thermodynamics: state functions, laws, Legendre transforms, thermodynamic potentials, chemical potentials, phase equilibrium, convexity, and free-energy ingredients; not an identification of zero-temperature electronic energy with complete stability or of favorability with kinetic accessibility.

## Verification boundary

Official destinations and high-level source roles were checked on 2026-08-03. This review does not independently verify every scientific statement in the sources, inspect every lecture and exercise, establish regional access for every user, or validate a specific estimator, trajectory, thermostat, free-energy model, phase diagram, or stability conclusion.
