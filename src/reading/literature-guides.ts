import type { SourceVisualId } from './source-media';

export type LiteratureGuideSection = {
  heading: string;
  paragraphs: string[];
  source?: string;
};

export type LiteratureGuideContent = {
  lede: string;
  why: string;
  chain: { label: string; text: string }[];
  sections: LiteratureGuideSection[];
  established: string[];
  notEstablished: string[];
  whatToRead: string[];
  visualNote: string;
  visual?: SourceVisualId;
  visualAfter?: string;
};

export const literatureGuideContent: Record<string, LiteratureGuideContent> = {
  'lieb-1983': {
    lede: 'Lieb recasts density-functional theory as a problem in convex analysis: the energy as a function of an external potential and the universal functional of a density are linked by variational conjugacy, while the admissible density domain is treated as part of the theorem rather than an afterthought.',
    why: 'The paper is the rigorous bridge between the early density-functional papers and the modern Levy–Lieb language used when one needs a well-defined density domain, lower bounds, or ensemble states.',
    chain: [
      { label: 'Previous problem', text: 'The Hohenberg–Kohn and Levy constructions establish a variational idea, but leave questions about the domain, convexity, and closure of the universal functional.' },
      { label: 'This paper', text: 'Lieb defines the energy and density functionals on convex sets and derives the dual relation that makes the variational structure mathematically stable.' },
      { label: 'Afterwards', text: 'This framework supports ensemble DFT, rigorous bounds, and later discussions of differentiability and representability without pretending that every trial density is physical.' },
    ],
    sections: [
      { heading: 'The domain is part of the result', paragraphs: [
        'A density-functional expression has two distinct questions: what value should the functional assign, and for which densities is that value finite and physically admissible? Lieb treats them together. The relevant set is not the collection of all nonnegative functions with the right integral; it is the set on which the interacting kinetic and Coulomb terms can be controlled.',
        'That shift matters for reading later DFT claims. A variational minimum can be meaningful even when the minimizing state is not represented by a single smooth potential in the naive way. The paper makes the closure and convexity of the domain visible instead of hiding them behind notation.'
      ], source: 'Source: Lieb, Sections 2–3, on the universal density functional and its domain.' },
      { heading: 'Convex duality organizes the energy', paragraphs: [
        'The ground-state energy as a function of the external potential is concave: taking the lowest expectation value over states produces the lower envelope of affine potential-energy contributions. The universal density functional is the corresponding convex variational object. The two are related by variational transforms rather than by a guessed local potential.',
        'Read this as a statement about optimization geometry. It does not supply an efficient numerical representation of the exact functional. It does explain why ensemble densities and lower-semicontinuous envelopes are natural when pure-state representability is too narrow for a stable variational theory.'
      ], source: 'Source: Lieb, the energy–potential variational relations and convexity discussion.' },
      { heading: 'What becomes possible', paragraphs: [
        'The framework lets later authors state existence and bound results without changing the physical Hamiltonian from one trial density to the next. It also clarifies why a subgradient or supporting potential can replace an ordinary functional derivative when the functional has a kink or a nonunique minimizing state.',
        'For an Atlas reader, this is the right place to separate exact mathematical structure from computational practice. Kohn–Sham equations, approximate exchange–correlation forms, and finite-basis algorithms all need additional choices after the universal functional has been defined.'
      ], source: 'Source: Lieb, Sections 4–6 and the concluding remarks.' },
    ],
    established: [
      'A convex-analytic formulation of the Coulomb density-functional problem with an explicit admissible domain.',
      'Variational duality between the external-potential energy and the universal density functional.',
    ],
    notEstablished: [
      'A closed exact exchange–correlation functional, a unique Kohn–Sham potential for every density, or a finite-basis convergence theorem for every observable.',
    ],
    whatToRead: ['The definition of the admissible density set.', 'The convexity and lower-semicontinuity arguments.', 'The variational relation between the energy as a function of the potential and the universal functional.'],
    visualNote: 'No separately necessary paper figure was identified: the contribution is a variational and convex-analytic construction, so equations and domain statements carry the evidence.',
  },
  'ceperley-alder-1980': {
    lede: 'Ceperley and Alder use stochastic many-body calculations to obtain benchmark ground-state energies for the homogeneous electron gas, giving density-functional approximations a numerical correlation-energy reference that was not available from the exact theorems alone.',
    why: 'This paper enters the Atlas at the point where “uniform electron gas” changes from a formal reference system into a quantified many-body benchmark used by local and semilocal functionals.',
    chain: [
      { label: 'Previous problem', text: 'Thomas–Fermi and density-functional constructions need information about exchange and correlation, but the interacting uniform gas is not analytically solved at all densities.' },
      { label: 'This paper', text: 'A stochastic projection method estimates the ground-state energy and correlation energy of the electron gas across density regimes and examines magnetic behavior.' },
      { label: 'Afterwards', text: 'The tabulated and parameterized correlation data become part of the empirical and constraint-based foundation of LDA and later functional development.' },
    ],
    sections: [
      { heading: 'The benchmark is a many-body calculation', paragraphs: [
        'The system is deliberately simple in external structure: a homogeneous electron gas with a neutralizing background. The difficulty is entirely in the interacting fermions. Ceperley and Alder use a stochastic method based on imaginary-time propagation to approach the ground state from a trial state and estimate energies for finite simulation cells.',
        'The paper reports correlation energies rather than presenting a universal material model. Finite-size corrections, statistical uncertainty, density parameter, and the chosen spin state belong to the result. When this work is later used to motivate an LDA, those conditions remain part of the evidence.'
      ], source: 'Source: Ceperley and Alder, abstract and opening discussion; the reported calculation is for the homogeneous electron gas.' },
      { heading: 'What the numbers change', paragraphs: [
        'Exchange energy is known for the uniform gas, but correlation energy is the difference between the interacting value and the reference pieces. A reliable numerical benchmark therefore supplies the missing input needed to fit or interpolate a local energy density as a function of density.',
        'The reported magnetic transition information is a second lesson: even a translationally invariant reference system has competing many-body states. A functional built from its data inherits a physical model of that reference system; it does not become exact for inhomogeneous systems merely because the reference calculation was accurate.'
      ], source: 'Source: Ceperley and Alder, reported ground-state energies, correlation energies, and magnetic transition discussion.' },
      { heading: 'How to use the benchmark', paragraphs: [
        'Read the paper as a data-generating calculation, not as a derivation of a density functional. The later functional author must decide how to interpolate the data, how to combine it with exact exchange constraints, and how to extend a homogeneous energy density to a spatially varying density.',
        'That separation is useful in practice. Agreement with the uniform-gas benchmark tests one ingredient of an approximation. It does not by itself test band gaps, localized electrons, dispersion, forces, response functions, or a material-specific phase ordering.'
      ], source: 'Source: Ceperley and Alder, conclusion and comparison of the calculated gas properties.' },
    ],
    established: ['A stochastic ground-state benchmark for the correlation energy of the homogeneous electron gas.', 'Numerical evidence for density-dependent magnetic behavior in the reference gas.'],
    notEstablished: ['A general inhomogeneous exchange–correlation functional or a material-independent accuracy guarantee for LDA.'],
    whatToRead: ['The description of the stochastic ground-state method.', 'The density parameter and finite-cell treatment used for the reported energies.', 'The correlation-energy and magnetic-transition results.'],
    visualNote: 'No paper figure is needed for the Atlas guide: the teaching evidence is the reported benchmark data and its method assumptions, while the original tables are best read in the source record.',
  },
  'perdew-zunger-1981': {
    lede: 'Perdew and Zunger identify the self-interaction error in common density-functional approximations and construct an orbital-density correction designed to remove the spurious interaction of an electron with its own density.',
    why: 'The paper gives the Atlas a canonical example of an approximation paper: start from a physical constraint, write the correction explicitly, test its consequences, and keep the new orbital dependence visible.',
    chain: [
      { label: 'Previous problem', text: 'Local and gradient approximations treat each electron through a total density and therefore do not exactly cancel an electron’s own Hartree contribution with its own exchange–correlation contribution.' },
      { label: 'This paper', text: 'Subtract the one-electron self-interaction error orbital by orbital and apply the resulting functional to atoms, molecules, and solids.' },
      { label: 'Afterwards', text: 'Self-interaction, localization, piecewise linearity, and orbital-dependent functional design become explicit diagnostic themes rather than hidden failures of a generic LDA.' },
    ],
    sections: [
      { heading: 'The exact constraint is simple', paragraphs: [
        'For a one-electron density, the exact Hartree and exchange–correlation contributions must cancel. A semilocal approximation generally satisfies neither cancellation exactly because its local energy density is built for a many-electron uniform reference. Perdew and Zunger turn that observation into a correction defined from the occupied orbital densities.',
        'The important reading move is to distinguish the total density from an orbital density. The correction is not a new universal local function of the total density; it depends on the chosen orbital representation and therefore changes the variational problem.'
      ], source: 'Source: Perdew and Zunger, opening constraint discussion and the self-interaction correction construction.' },
      { heading: 'Correction and cost are linked', paragraphs: [
        'The corrected energy subtracts the self-Hartree and self-exchange–correlation contribution for each occupied orbital. Variation then produces orbital-dependent effective potentials. This removes a named error mechanism, but it also makes the equations more involved than a multiplicative density-only potential.',
        'The paper’s applications are therefore not just a scorecard. They show which qualitative effects are sensitive to localization and asymptotic behavior. Read the examples alongside the exact constraint and do not turn an improvement in one atom, molecule, or solid into a universal ranking.'
      ], source: 'Source: Perdew and Zunger, correction equations and application sections.' },
      { heading: 'What the paper does not settle', paragraphs: [
        'A correction can remove self-interaction in the selected orbital decomposition while leaving other approximation errors, symmetry breaking, derivative discontinuity issues, and orbital-localization choices. The paper does not make all eigenvalues exact or replace the need to validate the observable being studied.',
        'Its lasting value is methodological: an approximation can be audited against a physical limit before its benchmark results are discussed. That pattern reappears in GGA, hybrid, DFT+U, and nonlocal-correlation development.'
      ], source: 'Source: Perdew and Zunger, discussion of the correction’s scope and applications.' },
    ],
    established: ['An explicit orbital-density self-interaction correction for density-functional approximations.', 'A set of atomic, molecular, and solid-state tests showing the practical consequences of the correction.'],
    notEstablished: ['A unique orbital choice, a universally improved functional for all observables, or a proof that every residual error is due to self-interaction.'],
    whatToRead: ['The one-electron cancellation condition.', 'The definition of the orbital-by-orbital correction.', 'The application sections where localization and asymptotic behavior are compared.'],
    visualNote: 'No separate figure is necessary: the contribution is an explicit functional construction and its equations; the tables and application comparisons are best interpreted with the stated orbital and parameter choices.',
  },
  'perdew-burke-ernzerhof-1996': {
    lede: 'Perdew, Burke, and Ernzerhof construct a generalized-gradient approximation by imposing exact constraints while retaining the practical semilocal form, yielding the PBE functional that became a standard reference for ground-state calculations.',
    why: 'This is the canonical source for the difference between “adds a gradient” and “builds a GGA under a declared constraint set.”',
    chain: [
      { label: 'Previous problem', text: 'LDA uses only the local density, while naive gradient expansions can violate known limits or behave poorly outside slowly varying densities.' },
      { label: 'This paper', text: 'Choose an enhancement form that depends on density and reduced gradient while satisfying a selected set of exact constraints and recovering the uniform-gas limit.' },
      { label: 'Afterwards', text: 'PBE becomes a widely used semilocal baseline against which meta-GGA, hybrid, dispersion, and material-specific corrections are compared.' },
    ],
    sections: [
      { heading: 'Constraints are the design input', paragraphs: [
        'The paper does not begin by fitting a large collection of material energies. It begins with the known behavior of exchange and correlation: uniform scaling, bounds, spin dependence, the slowly varying limit, and the requirement that the energy density remain well behaved for large gradients.',
        'The reduced gradient is the bridge between local information and spatial variation. It lets the functional respond to inhomogeneity without introducing an explicitly nonlocal density integral. The price is that rapidly varying, long-range, and strongly localized situations are represented only through that semilocal summary.'
      ], source: 'Source: Perdew, Burke, and Ernzerhof, constraint discussion and construction of the GGA enhancement factors.' },
      { heading: 'Why “simple” is not “uncontrolled”', paragraphs: [
        'PBE’s compact final form hides a sequence of choices. Exchange and correlation are built with related but distinct constraints and parameters; the uniform electron gas is recovered at zero gradient; and the large-gradient behavior is bounded rather than extrapolated from a low-order gradient series.',
        'Read the equations with the constraint list beside them. The functional is practical because it is local enough for self-consistent calculations, not because the constraints remove all model discrepancy. Its predicted structure, energy, force, gap, dispersion, or magnetic ordering still belongs to a chosen approximation stack.'
      ], source: 'Source: PBE, equations defining the exchange–correlation GGA and the accompanying constraint discussion.' },
      { heading: 'The correct modern comparison', paragraphs: [
        'PBE is often treated as a default, but its historical role is more precise: it is a nonempirical semilocal construction that satisfies a stated set of conditions. Comparisons with other functionals should name the changed physical ingredient, not merely report that one curve is lower.',
        'The paper also illustrates why an approximation guide should say what it targets. PBE targets a broad ground-state energy functional; it is not a quasiparticle correction, a dispersion theory, a dynamical response kernel, or a universal remedy for self-interaction.'
      ], source: 'Source: PBE, abstract and concluding comparison with earlier gradient approximations.' },
    ],
    established: ['The PBE generalized-gradient exchange–correlation functional and its constraint-based construction.', 'A semilocal route that recovers the uniform-gas limit while avoiding selected gradient-expansion failures.'],
    notEstablished: ['Exact band gaps, long-range dispersion, universally correct localization, or observable-independent superiority over every other functional.'],
    whatToRead: ['The list of exact constraints used in the design.', 'The exchange and correlation enhancement-factor equations.', 'The comparison with the earlier gradient approximation and uniform-gas limit.'],
    visualNote: 'No standalone figure is required: the scientific evidence is the functional form, its limits, and the constraint argument rather than a fixed experimental or calculated plot.',
  },
  'vanderbilt-1990': {
    lede: 'Vanderbilt relaxes norm conservation in pseudopotentials and replaces it with additional localized projectors, producing soft self-consistent potentials that reduce plane-wave cost while retaining a generalized eigenvalue formulation.',
    why: 'The paper is a compact source for how a numerical representation changes the cost of a first-principles calculation without changing the stated electronic problem by fiat.',
    chain: [
      { label: 'Previous problem', text: 'Norm-conserving pseudopotentials can require large plane-wave cutoffs because the pseudo-wavefunction must reproduce several near-core constraints.' },
      { label: 'This paper', text: 'Allow the pseudo charge norm to vary, add projector terms, and solve a generalized eigenvalue problem whose overlap and Hamiltonian corrections remain separable and localized.' },
      { label: 'Afterwards', text: 'Ultrasoft pseudopotentials become a practical route to lower cutoffs, especially for first-row and transition-metal systems, with augmentation-related observables treated explicitly.' },
    ],
    sections: [
      { heading: 'Softness comes from changing the representation', paragraphs: [
        'The pseudopotential replaces the strongly oscillating valence wavefunction near a core with a smoother object. Vanderbilt observes that norm conservation is a major source of hardness and relaxes that condition in a controlled way. The missing information is not discarded; it is represented through localized projector and overlap terms.',
        'The resulting basis problem is generalized because the smooth states are not orthonormal under the ordinary overlap alone. That algebraic detail is the evidence that the representation changed. It should not be hidden behind the phrase “lower cutoff.”'
      ], source: 'Source: Vanderbilt, abstract and construction of soft self-consistent pseudopotentials.' },
      { heading: 'Separable projectors make the method usable', paragraphs: [
        'The nonlocal correction is written in separable form. A plane-wave code can therefore apply the potential through a small number of projector overlaps instead of storing a dense nonlocal operator. This is the computational idea that turns the relaxed norm condition into a practical method.',
        'The method’s benefit is observable- and dataset-dependent. Forces, stress, augmentation charges, overlap operators, and charge-density reconstruction must all use the same pseudopotential definition. A low cutoff alone does not certify transferability.'
      ], source: 'Source: Vanderbilt, separable nonlocal form and generalized eigenvalue discussion.' },
      { heading: 'Read the paper as an input-method paper', paragraphs: [
        'The paper supplies a construction, not a universal library standard. Reference configurations, angular channels, scattering behavior, nonlinear core effects, and the target chemical environments remain part of validation. Later ultrasoft implementations also add conventions that are not contained in this short original article.',
        'This is why the Atlas places the guide beside pseudopotential foundations rather than presenting it as a numerical trick. The representation determines what the code must reconstruct and what convergence tests are needed.'
      ], source: 'Source: Vanderbilt, conclusions and stated applications to plane-wave calculations.' },
    ],
    established: ['A soft, self-consistent pseudopotential construction with relaxed norm conservation.', 'A separable projector form and generalized eigenvalue problem suited to plane-wave calculations.'],
    notEstablished: ['Transferability of every later ultrasoft dataset, convergence of every observable at a nominal cutoff, or equivalence to PAW in all implementations.'],
    whatToRead: ['The motivation for relaxing norm conservation.', 'The projector and overlap construction.', 'The separable form and the examples of cutoff reduction.'],
    visualNote: 'No fixed figure is needed: the contribution is an operator and representation construction. The generalized eigenvalue and projector equations are the primary evidence.',
  },
  'blochl-1994': {
    lede: 'Blöchl’s projector augmented-wave method uses a linear transformation between smooth auxiliary states and all-electron-like states, combining the efficiency of pseudopotential ideas with an explicit reconstruction of core-region information.',
    why: 'The paper is the canonical source for the conceptual separation between a smooth calculation state, atom-centred augmentation, and the reconstructed wavefunction or density used for observables.',
    chain: [
      { label: 'Previous problem', text: 'Pseudopotentials smooth core-region behavior for efficiency, while all-electron methods retain the rapidly varying wavefunction at a higher computational cost.' },
      { label: 'This paper', text: 'Introduce a linear transformation, partial waves, and projector functions so that the smooth problem can be corrected in atom-centred augmentation regions.' },
      { label: 'Afterwards', text: 'PAW supplies a general framework used by later datasets and plane-wave implementations, with accuracy determined by the supplied partial waves, projectors, and cutoffs.' },
    ],
    sections: [
      { heading: 'The transformation is the central object', paragraphs: [
        'The PAW method does not claim that the smooth auxiliary state is itself the all-electron state. Instead, an operator maps the auxiliary state to a reconstructed state. Outside augmentation spheres the two descriptions agree; inside them, atom-centred partial waves and projector coefficients restore the missing rapid structure.',
        'That distinction matters when reading a code output. A smooth pseudo-density, an on-site augmentation contribution, and an all-electron reconstructed quantity are different representations of related physical information.'
      ], source: 'Source: Blöchl, abstract and the linear-transformation construction.' },
      { heading: 'Partial waves and projectors carry local detail', paragraphs: [
        'The projector functions extract coefficients from the smooth state, while partial waves provide the local basis used to rebuild the corresponding all-electron behavior. The compensation-charge construction makes electrostatic multipoles consistent outside the augmentation region.',
        'The result resembles both pseudopotential and linearized-augmented-plane-wave ideas, but its bookkeeping is distinct. The method’s flexibility comes from keeping the transformation explicit rather than declaring the core contribution absent.'
      ], source: 'Source: Blöchl, partial-wave, projector, and compensation-charge sections.' },
      { heading: 'Dataset quality remains a scientific input', paragraphs: [
        'The formal PAW equations do not validate an arbitrary dataset. The number and energy range of partial waves, augmentation radii, compensation functions, reference configurations, and plane-wave cutoffs determine how well the transformation works for a given system and observable.',
        'Read the method as a contract between representation and reconstruction. A converged total energy with one dataset does not, by itself, validate a magnetic moment, stress, phonon, band edge, or response quantity.'
      ], source: 'Source: Blöchl, discussion of accuracy and practical implementation choices.' },
    ],
    established: ['The projector augmented-wave linear transformation and atom-centred augmentation construction.', 'A unified representation that retains smooth efficiency while reconstructing all-electron-like quantities.'],
    notEstablished: ['Accuracy of later PAW datasets without dataset-specific tests or equivalence of every PAW observable to an all-electron result.'],
    whatToRead: ['The linear transformation between auxiliary and reconstructed states.', 'The partial-wave/projector expansion.', 'The compensation-charge and expectation-value construction.'],
    visualNote: 'No standalone visual is necessary: the transformation, projectors, and augmentation terms are the scientific object being taught.',
  },
  'baroni-2001': {
    lede: 'Baroni, de Gironcoli, Dal Corso, and Giannozzi review density-functional perturbation theory as a systematic route from first-order changes in the self-consistent density to phonons, dielectric properties, Born effective charges, strain response, and electron–phonon-related quantities.',
    why: 'This review is the Atlas entry point for response calculations because it keeps the perturbation, induced density, self-consistency, and observable-specific derivatives in one source-aligned chain.',
    chain: [
      { label: 'Previous problem', text: 'Finite-displacement calculations can estimate force constants, but repeated displaced ground states obscure the response equation and become expensive for long wavelengths, metals, or macroscopic fields.' },
      { label: 'This paper', text: 'Differentiate the Kohn–Sham self-consistency problem and solve for the first-order density and potential directly.' },
      { label: 'Afterwards', text: 'DFPT becomes a common framework for phonon dispersions, dielectric tensors, effective charges, elastic response, and electron–phonon matrix elements.' },
    ],
    sections: [
      { heading: 'A response is a derivative of a converged problem', paragraphs: [
        'The perturbation may be an atomic displacement, an electric field, a strain, or a long-wavelength modulation. The first-order wavefunction and density respond through a linearized Kohn–Sham equation. The induced Hartree and exchange–correlation potentials feed back into that response, so the calculation is itself self-consistent.',
        'This is the conceptual difference between a derivative and an arbitrary small change. The reference ground state, perturbing operator, boundary conditions, and response solver all define the observable.'
      ], source: 'Source: Baroni et al., Sections I–III and the DFPT linear-response construction.' },
      { heading: 'Phonons are second derivatives of energy', paragraphs: [
        'A phonon dynamical matrix is built from force constants, which are second derivatives of the total energy with respect to atomic displacements. DFPT obtains the first-order density response to one displacement and contracts it with the derivative of the potential to form the force response.',
        'The acoustic sum rule, translational invariance, long-range electrostatics, and nonanalytic small-q terms are not cosmetic post-processing. They are tests of whether the chosen representation and boundary conditions are consistent with the physical perturbation.'
      ], source: 'Source: Baroni et al., phonon and macroscopic-field sections.' },
      { heading: 'The review reaches beyond phonons', paragraphs: [
        'The same response machinery yields dielectric tensors, Born effective charges, piezoelectric and elastic coefficients, and higher-order derivatives. Metals require a different treatment of occupations and Fermi-surface terms; finite electric fields require attention to polarization and boundary conditions.',
        'The review is therefore useful as a map, not as a universal convergence recipe. A smooth phonon curve does not validate a dielectric constant, electron–phonon coupling, or superconducting transition without the corresponding observable-specific sampling and numerical tests.'
      ], source: 'Source: Baroni et al., sections on metals, macroscopic fields, strain, and higher-order response.' },
    ],
    established: ['A first-principles linear-response framework for lattice dynamics and related crystal properties.', 'The connection between first-order self-consistent responses and force, dielectric, strain, and coupling observables.'],
    notEstablished: ['Numerical convergence for a particular material, a unique treatment of metals and electric fields, or scientific acceptance of a phonon/EPC result from one run.'],
    whatToRead: ['The linearized Kohn–Sham response equation.', 'The derivation of force constants and the dynamical matrix.', 'The macroscopic-field, metallic, and higher-order response sections.'],
    visualNote: 'No one figure is necessary for this guide: the review’s central evidence is a family of derivative equations and boundary-condition cases rather than one canonical plot.',
  },
  'runge-gross-1984': {
    lede: 'Runge and Gross extend the density-functional mapping idea to time-dependent systems: under stated analyticity and initial-state conditions, a time-dependent density determines the external potential up to a purely time-dependent function.',
    why: 'The paper marks the point where the Atlas must separate a ground-state variational theorem from a time-dependent mapping theorem and from the later practical approximations used for spectra.',
    chain: [
      { label: 'Previous problem', text: 'Ground-state DFT gives no direct theorem for a driven system whose density and potential change in time.' },
      { label: 'This paper', text: 'Use the time-dependent Schrödinger equation and a Taylor expansion in time to establish a one-to-one density–potential mapping for a fixed initial state.' },
      { label: 'Afterwards', text: 'Time-dependent Kohn–Sham theory and linear-response TDDFT become possible, while the unknown time-dependent exchange–correlation functional remains the practical bottleneck.' },
    ],
    sections: [
      { heading: 'The initial state is part of the data', paragraphs: [
        'Unlike a ground-state theorem, the time-dependent problem cannot be specified by a density alone at one instant. The initial many-body state and the external potential determine the subsequent evolution. Runge and Gross therefore compare systems with the same initial state and potentials that are analytic in time.',
        'The proof uses the first time derivative at which two potentials differ. The difference in the potential generates a difference in the acceleration of the density, so the two densities cannot remain identical. The allowed gauge freedom is a spatially constant function of time.'
      ], source: 'Source: Runge and Gross, theorem statement and time-Taylor-series proof.' },
      { heading: 'A mapping theorem is not a spectrum', paragraphs: [
        'The theorem says that a density history contains enough information, in principle, to identify the external potential for the stated class of systems. It does not give a closed functional for the action, a practical memory kernel, or an exact finite-dimensional propagation algorithm.',
        'This is why later TDDFT calculations must name the time-dependent exchange–correlation approximation, initial state, propagation scheme, time step, and observable. The existence of a mapping does not validate an adiabatic approximation or a particular excitation peak.'
      ], source: 'Source: Runge and Gross, discussion following the theorem and the three proposed schemes.' },
      { heading: 'The route to linear response', paragraphs: [
        'For a weak perturbation, the density response is described by a causal response function. The Kohn–Sham version introduces a noninteracting reference system with the same time-dependent density, while the difference between interacting and reference responses is carried by the exchange–correlation kernel.',
        'The original paper opens this route but does not contain the complete modern computational TDDFT toolbox. Read the historical construction first, then keep later kernels, Casida equations, real-time propagation, and oscillator-strength claims explicitly labeled as later developments.'
      ], source: 'Source: Runge and Gross, proposed time-dependent schemes and closing discussion.' },
    ],
    established: ['A time-dependent density–potential mapping under the paper’s initial-state and analyticity assumptions.', 'The formal foundation for a time-dependent Kohn–Sham construction.'],
    notEstablished: ['An exact practical time-dependent exchange–correlation kernel, arbitrary initial-state representability, or direct validation of an excitation spectrum.'],
    whatToRead: ['The theorem’s assumptions.', 'The first-different-derivative argument in the proof.', 'The proposed schemes and the closing statement of what remains unknown.'],
    visualNote: 'No fixed figure is needed: the theorem, assumptions, and proof structure are the visual evidence of this short letter.',
  },
  'marzari-vanderbilt-1997': {
    lede: 'Marzari and Vanderbilt turn the gauge freedom of a composite set of Bloch bands into a localization problem: choose k-dependent unitary rotations that minimize the total quadratic spread of the resulting generalized Wannier functions.',
    why: 'The paper is the source-aligned bridge from abstract band subspaces to localized orbitals, interpolation, chemical interpretation, and real-space matrix elements.',
    chain: [
      { label: 'Previous problem', text: 'Wannier functions are not unique for a composite band manifold; arbitrary phases and band mixing can produce poorly localized or chemically unhelpful orbitals.' },
      { label: 'This paper', text: 'Define a spread functional and minimize it over unitary rotations on a discrete k mesh, with a practical gradient algorithm and initial-guess strategy.' },
      { label: 'Afterwards', text: 'Maximally localized Wannier functions become a standard representation for interpolation, polarization, chemical bonding, and tight-binding-like analysis.' },
    ],
    sections: [
      { heading: 'Gauge freedom is the computational variable', paragraphs: [
        'A Bloch eigenstate can be multiplied by a k-dependent phase without changing the physical projector. For isolated bands, phases are the freedom; for composite bands, occupied or selected states can also be mixed by a unitary matrix at each k. The real-space Wannier functions change even though the subspace does not.',
        'Marzari and Vanderbilt choose the gauge by minimizing a spread functional. The objective is not “make an orbital look chemical” by eye; it is a stated localization criterion whose value and convergence can be inspected.'
      ], source: 'Source: Marzari and Vanderbilt, Sections II–III on the spread functional and gauge transformations.' },
      { heading: 'The discrete algorithm preserves the subspace', paragraphs: [
        'On a finite k mesh the spread can be written through overlaps between neighboring cell-periodic Bloch states. The gradient with respect to infinitesimal unitary rotations gives a practical minimization route. The algorithm changes the representation within the selected subspace, not the underlying band energies.',
        'That distinction is essential for interpolation. A smooth localized gauge can make matrix elements and derivatives converge efficiently, but it cannot restore bands that were excluded from the subspace or remove entanglement that was never disentangled.'
      ], source: 'Source: Marzari and Vanderbilt, discrete k-space overlap formulas and minimization algorithm.' },
      { heading: 'Localization has a purpose and a boundary', paragraphs: [
        'The paper relates Wannier centres and spreads to polarization and chemical interpretation. Later work uses the same representation for electron–phonon interpolation, Berry quantities, and model Hamiltonians. Each use adds its own subspace, mesh, and convergence requirements.',
        'A small spread is not a topological invariant and is not proof that a selected subspace is physically complete. In a topological obstruction, exponentially localized symmetry-respecting Wannier functions may be impossible under the requested constraints.'
      ], source: 'Source: Marzari and Vanderbilt, applications and discussion of localization and Wannier centres.' },
    ],
    established: ['A spread-minimization construction for maximally localized generalized Wannier functions.', 'A practical discrete-k mesh algorithm based on neighboring Bloch-state overlaps.'],
    notEstablished: ['A unique gauge for every band manifold, a topological classification, or observable convergence independent of the chosen subspace and mesh.'],
    whatToRead: ['The definition and decomposition of the spread functional.', 'The overlap-matrix representation on a k mesh.', 'The minimization algorithm and initial-guess discussion.'],
    visualNote: 'No single source figure is required: the gauge, spread, and overlap equations define the method; a generic orbital drawing would hide the subspace and minimization choices.',
  },
  'king-smith-vanderbilt-1993': {
    lede: 'King-Smith and Vanderbilt show that the physically meaningful change in a crystal’s polarization can be computed from the evolution of occupied Bloch states along an insulating adiabatic path, or equivalently from the motion of Wannier centres.',
    why: 'This paper is the source for the modern polarization route used when a bulk polarization is multivalued but a finite change, pumped charge, or response coefficient is well defined.',
    chain: [
      { label: 'Previous problem', text: 'A bulk dipole moment per cell depends on the choice of cell, surface termination, and electronic position branch, so an absolute polarization cannot be treated like a local dipole in an infinite crystal.' },
      { label: 'This paper', text: 'Express the change along an adiabatic insulating path through Berry phases of occupied Bloch states and show the equivalent Wannier-centre interpretation.' },
      { label: 'Afterwards', text: 'Modern polarization, piezoelectric response, charge pumping, and Berry-phase implementations acquire a gauge-invariant finite-change formulation.' },
    ],
    sections: [
      { heading: 'The quantity is a change, not a unique origin', paragraphs: [
        'The electronic contribution to polarization is represented by the centres of occupied Wannier functions. Moving a centre by a lattice vector changes the reported branch by a polarization quantum, so the absolute value is not unique. A continuous insulating path selects a branch continuously and makes the difference meaningful.',
        'The ions contribute a corresponding point-charge term in the chosen structural convention. Read the paper’s result as a bulk statement with a branch structure, not as a claim that one bulk calculation determines every surface charge.'
      ], source: 'Source: King-Smith and Vanderbilt, introduction and Wannier-centre formulation.' },
      { heading: 'Berry phase replaces arbitrary centres', paragraphs: [
        'On a k mesh, the Berry phase is obtained from overlaps of occupied states at neighboring k points. Under a gauge change the phase can shift by a branch, but the change between two adiabatically connected insulating states is stable when the path and mesh are handled consistently.',
        'The same derivative gives response coefficients. The paper illustrates the method with the piezoelectric tensor of GaAs, connecting a formal bulk phase to a measurable change rather than treating a raw eigenstate phase as an observable.'
      ], source: 'Source: King-Smith and Vanderbilt, Berry-phase formula and GaAs piezoelectric application.' },
      { heading: 'The gap and path are part of the claim', paragraphs: [
        'The construction requires an insulating path. If the gap closes, occupied and unoccupied subspaces can exchange and the branch tracking no longer describes the same adiabatic polarization change. k-point discretization, occupied-manifold selection, ionic reference charges, and structural interpolation therefore belong in any numerical claim.',
        'This is the conceptual predecessor of later Berry-curvature and topological-invariant work, but polarization itself is not a Chern number. The observables and their gauge freedoms must remain distinct.'
      ], source: 'Source: King-Smith and Vanderbilt, assumptions and discussion of the polarization quantum.' },
    ],
    established: ['A Berry-phase/Wannier-centre formulation of polarization changes in insulating crystals.', 'A first-principles route to the piezoelectric response along an adiabatic path.'],
    notEstablished: ['A unique absolute polarization branch, a metallic polarization formula, or a topological invariant for every Berry phase.'],
    whatToRead: ['The discussion of the polarization quantum.', 'The overlap-product Berry-phase expression.', 'The GaAs piezoelectric application.'],
    visualNote: 'No fixed figure is needed: the branch, path, overlap product, and response coefficient are the evidence-bearing objects.',
  },
  'fu-kane-mele-2007': {
    lede: 'Fu, Kane, and Mele construct a three-dimensional time-reversal topological classification that does not require inversion symmetry, identifying four Z2 invariants and distinguishing strong from weak topological insulator phases.',
    why: 'The paper gives the Atlas a canonical warning against inferring topology from band inversion or one surface crossing without naming the symmetry, gap, occupied subspace, and invariant.',
    chain: [
      { label: 'Previous problem', text: 'The quantum spin Hall effect in two dimensions needs a robust bulk characterization, while inversion-based shortcuts do not apply to crystals without inversion symmetry.' },
      { label: 'This paper', text: 'Use time-reversal structure and a Z2 formulation to classify 3D insulating phases, including one strong and three weak indices.' },
      { label: 'Afterwards', text: 'Strong topological insulators, surface Dirac states, and symmetry-aware bulk calculations become part of the standard electronic-structure vocabulary.' },
    ],
    sections: [
      { heading: 'The invariant belongs to a gapped symmetry class', paragraphs: [
        'The paper considers a time-reversal-invariant band insulator with spin–orbit coupling and no inversion symmetry. The occupied states define a bundle over the Brillouin zone. Time reversal constrains that bundle, but it does not make individual energy-ordered phases globally smooth or unique.',
        'The Z2 indices distinguish bundles that cannot be smoothly deformed into an atomic insulator without closing the bulk gap or breaking the protecting symmetry. This is a statement about the occupied subspace, not about one orbital or one avoided crossing.'
      ], source: 'Source: Fu, Kane, and Mele, abstract and invariant construction for 3D time-reversal-invariant insulators.' },
      { heading: 'Strong and weak indices mean different boundary behavior', paragraphs: [
        'The three weak indices can be associated with layered quantum spin Hall structure, while the strong index detects a genuinely three-dimensional obstruction to an atomic limit under the stated symmetries. The paper enumerates the sixteen combinations of four Z2 labels and discusses their surface-state consequences.',
        'A surface spectrum is therefore a boundary manifestation of a bulk classification, not the definition by itself. Surface termination, disorder, finite size, and projection can alter how the states appear without changing the bulk invariant when the gap and symmetry assumptions remain.'
      ], source: 'Source: Fu, Kane, and Mele, classification of phases and discussion of surface states.' },
      { heading: 'How to read a modern calculation', paragraphs: [
        'Start by recording the Hamiltonian: dimensionality, filling, spin, spin–orbit coupling, magnetic order, and protecting symmetry. Then verify the bulk gap and compute the selected invariant on a converged mesh or equivalent Wilson-loop construction. Only afterward use a boundary calculation as supporting evidence.',
        'The paper’s contribution is not a generic label for band inversion. It is a symmetry- and gap-conditioned obstruction. Later topological materials work adds material-specific methods and interactions that must be kept separate from this original classification.'
      ], source: 'Source: Fu, Kane, and Mele, assumptions, invariant discussion, and boundary-state interpretation.' },
    ],
    established: ['Four Z2 invariants for 3D time-reversal-invariant insulators without inversion symmetry.', 'The strong/weak distinction and its relation to surface-state structure.'],
    notEstablished: ['Topology from one band inversion, one surface crossing, or one unverified numerical interpolation; the invariant still requires the stated bulk model and gap.'],
    whatToRead: ['The time-reversal and no-inversion assumptions.', 'The construction of the four Z2 invariants.', 'The strong/weak phase classification and surface-state discussion.'],
    visualNote: 'No single paper figure is needed: the invariant and symmetry conditions are the evidence. An Atlas diagram would be conceptual, not a substitute for a source result.',
  },
  'onida-reining-rubio-2002': {
    lede: 'Onida, Reining, and Rubio review the route from ground-state density-functional theory to electronic excitations: GW replaces a static exchange–correlation potential with a nonlocal, energy-dependent self-energy, while the Bethe–Salpeter equation treats correlated electron–hole pairs.',
    why: 'This review is the source-aligned map for the excitation boundary in the Atlas. It lets a reader separate Kohn–Sham eigenvalues, quasiparticle energies, optical spectra, and electron–hole effects before opening a GW or BSE paper.',
    chain: [
      { label: 'Previous problem', text: 'Ground-state DFT is efficient for densities and total-energy derivatives, but its auxiliary eigenvalues are not a general theory of charged addition/removal or neutral optical excitations.' },
      { label: 'This paper', text: 'Organize many-body Green-function, GW, BSE, and time-dependent approaches around their physical objects, approximations, and connections.' },
      { label: 'Afterwards', text: 'The review remains a navigation point for quasiparticle corrections, optical spectra, excitons, and the limits of comparing different excitation formalisms.' },
    ],
    sections: [
      { heading: 'The self-energy changes the physical question', paragraphs: [
        'A one-particle Green function contains poles and spectral weights associated with adding or removing a particle. Its equation of motion contains a self-energy that is nonlocal in space and time, so it cannot generally be represented by the static local potential of a ground-state Kohn–Sham calculation.',
        'The GW approximation replaces the full vertex structure with a screened-interaction construction, commonly written schematically as a product of a Green function and a screened Coulomb interaction. The approximation is not one number: the starting orbitals, screening, frequency treatment, self-consistency, and convergence controls define the calculation.'
      ], source: 'Source: Onida, Reining, and Rubio, sections on Green functions, self-energy, and the GW approximation.' },
      { heading: 'Quasiparticles and optical excitations are different', paragraphs: [
        'A quasiparticle calculation targets charged addition and removal energies, reflected in poles of a one-particle propagator. An optical experiment creates a neutral electron–hole pair. A band-gap correction can therefore be necessary without being sufficient for an optical spectrum.',
        'The Bethe–Salpeter equation adds the electron–hole interaction and its exchange terms to the two-particle response. Bound excitons and continuum absorption are properties of that neutral sector, not of a scissor shift alone.'
      ], source: 'Source: Onida, Reining, and Rubio, GW, BSE, and optical-response sections.' },
      { heading: 'The review’s enduring use', paragraphs: [
        'The paper compares many-body Green-function and time-dependent density-functional routes and explains where their approximations differ. Read it as a map of physical sectors and approximation layers rather than as a current software manual.',
        'Later implementations add plasmon-pole models, frequency-dependent kernels, vertex corrections, finite-size treatments, and specialized Coulomb truncations. The review’s central warning survives: a converged spectrum is only meaningful after the target sector, starting point, and model assumptions are stated.'
      ], source: 'Source: Onida, Reining, and Rubio, comparison of GW, BSE, and TDDFT approaches and concluding perspective.' },
    ],
    established: ['A source-aligned synthesis of Green functions, GW quasiparticles, BSE electron–hole excitations, and TDDFT.', 'The distinction between charged spectral quantities and neutral optical response.'],
    notEstablished: ['A universal GW starting point, an exact vertex, or equivalence between a quasiparticle gap and an optical excitation energy.'],
    whatToRead: ['The Green-function and self-energy introduction.', 'The GW approximation and quasiparticle sections.', 'The BSE optical-response discussion and comparison with TDDFT.'],
    visualNote: 'No single source figure is required for this guide: the review’s value is its equations and physical-sector map. The existing Hedin guide carries the original diagrammatic visual evidence.',
  },
  'zhong-vanderbilt-rabe-1995': {
    lede: 'Zhong, Vanderbilt, and Rabe build an effective Hamiltonian from first-principles calculations and use statistical sampling to model the finite-temperature ferroelectric phase transitions of BaTiO3, connecting microscopic energy surfaces to experimentally observed phase behavior.',
    why: 'This is the Atlas’s representative application guide: it shows how a first-principles electronic-structure calculation becomes an effective lattice model and how the model’s predicted transitions are compared with experiment without confusing the two evidence layers.',
    chain: [
      { label: 'Previous problem', text: 'A direct finite-temperature simulation of all electronic and ionic degrees of freedom is expensive, while a purely empirical model may not retain the material-specific first-principles energy landscape.' },
      { label: 'This paper', text: 'Fit an effective Hamiltonian to first-principles local-density and ultrasoft-pseudopotential calculations, then sample it with Monte Carlo to obtain BaTiO3 phase behavior.' },
      { label: 'Afterwards', text: 'First-principles effective-Hamiltonian methods become a route to finite-temperature structural transitions, provided the fitted variables, training range, and omitted modes are made explicit.' },
    ],
    sections: [
      { heading: 'The electronic calculation is a model-building stage', paragraphs: [
        'The paper first constructs the local structural degrees of freedom and their interactions from first-principles calculations. The effective Hamiltonian includes local soft-mode amplitudes, homogeneous strain, and couplings needed to represent the low-energy ferroelectric distortions of the perovskite.',
        'This is not the same object as a direct Born–Oppenheimer molecular-dynamics trajectory. The electronic calculation supplies coefficients for a reduced model; the subsequent finite-temperature sampling explores that reduced model.'
      ], source: 'Source: Zhong, Vanderbilt, and Rabe, abstract and effective-Hamiltonian construction from first-principles calculations.' },
      { heading: 'Monte Carlo exposes the phase sequence', paragraphs: [
        'The effective Hamiltonian is sampled at finite temperature. The calculated sequence of cubic, tetragonal, orthorhombic, and rhombohedral phases, together with transition temperatures, latent heats, and polarization behavior, is compared with experimental observations.',
        'The comparison is valuable because it tests more than one relaxed structure: it tests the shape of a reduced energy landscape and the thermal statistics generated from it. Agreement remains conditional on the chosen degrees of freedom and coefficient fit.'
      ], source: 'Source: Zhong, Vanderbilt, and Rabe, Monte Carlo results and comparison with BaTiO3 experiments.' },
      { heading: 'What the comparison can and cannot say', paragraphs: [
        'The reported transitions are evidence that the selected effective variables capture important low-energy physics of BaTiO3. They are not a universal validation of LDA, ultrasoft pseudopotentials, Monte Carlo, or effective-Hamiltonian truncation for another perovskite.',
        'Read the paper’s numerical result together with the construction and the comparison table. A phase-transition temperature is a model-dependent observable with finite-size, sampling, and parameterization sensitivity, not a direct output of one ground-state DFT calculation.'
      ], source: 'Source: Zhong, Vanderbilt, and Rabe, conclusions and stated limits of the effective-Hamiltonian approach.' },
    ],
    established: ['A first-principles-derived effective Hamiltonian for BaTiO3 low-energy distortions.', 'Monte Carlo phase behavior that reproduces the reported qualitative sequence and several experimental trends.'],
    notEstablished: ['A direct all-electron finite-temperature result, universal transferability to other materials, or exact agreement independent of the reduced model and sampling choices.'],
    whatToRead: ['The definition of local modes, strain, and effective-Hamiltonian terms.', 'The first-principles fitting strategy.', 'The Monte Carlo phase sequence and experiment comparison.'],
    visualNote: 'The source table is shown at the point where the phase-transition comparison is discussed. It preserves the simulation-cell columns, experimental column, units, uncertainty marks, and phase labels; it is not a re-plotted or recomputed dataset.',
    visual: 'zhong-table-iii',
    visualAfter: 'Monte Carlo exposes the phase sequence',
  },
};
