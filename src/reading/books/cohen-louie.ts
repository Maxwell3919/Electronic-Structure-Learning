export type CohenLouiePart = {
  id: string;
  slug: string;
  number: string;
  title: string;
  route: string;
  question: string;
  overview: string;
  synthesis: string;
  chapterSlugs: string[];
};

export type CohenLouieChapter = {
  id: string;
  slug: string;
  number: string;
  title: string;
  route: string;
  partSlug: string;
  contribution: string;
  coreIdea: string;
  overview: string;
};

const chapter = (
  number: number,
  title: string,
  part: number,
  contribution: string,
  coreIdea: string,
  overview: string,
): CohenLouieChapter => {
  const padded = String(number).padStart(2, '0');
  return {
    id: `cohen-louie-ch${padded}`,
    slug: `chapter-${padded}`,
    number: String(number),
    title,
    route: `/reading/books/cohen-louie/chapter-${padded}/`,
    partSlug: `part-${['i', 'ii', 'iii', 'iv'][part - 1]}`,
    contribution,
    coreIdea,
    overview,
  };
};

export const cohenLouieChapters: CohenLouieChapter[] = [
  chapter(1, 'Concept of a solid: qualitative introduction and overview', 1,
    'Introduces two complementary pictures of a solid—interacting constituents and elementary excitations—and connects each excitation to the probes that can reveal it.',
    'A useful account of a solid must name both the microscopic constituents and the emergent excitations through which the solid stores and transfers energy, momentum, charge, and spin.',
    'The chapter starts from macroscopic classifications, then replaces a static collection of atoms by a catalog of quasiparticles and collective modes. Dispersion relations and interaction diagrams become the grammar used throughout the book.'),
  chapter(2, 'Electrons in crystals', 1,
    'Builds a controlled ladder from the electron–nuclear Hamiltonian to a periodic one-particle problem and derives the translation labels used in crystals.',
    'Bloch states are not a consequence of a particular electronic-structure method; they follow when an effective one-particle Hamiltonian has lattice-translation symmetry.',
    'The source removes nuclear motion, replaces interacting electrons by a one-particle field, and imposes periodicity. Only then do lattices, reciprocal lattices, the Brillouin zone, and Bloch characters enter.'),
  chapter(3, 'Electronic energy bands', 1,
    'Uses free-electron, nearly-free-electron, and tight-binding limits to explain gaps, dispersion, velocity, effective mass, state counting, and real-material band plots.',
    'A band is the continuous spectrum of a periodic one-particle problem indexed by crystal momentum; different models explain different features without defining all materials by one model.',
    'Reduced and extended zones expose repeated labels, the nearly-free model opens gaps at Bragg planes, and tight binding broadens local levels. The chapter then turns those spectra into velocities, occupations, sums over states, and selected-path plots.'),
  chapter(4, 'Lattice vibrations and phonons', 1,
    'Turns small nuclear displacements into a harmonic eigenproblem, quantizes its normal modes, and connects the mode spectrum to heat capacity and vibrational density of states.',
    'A phonon is a quantum of a collective normal mode, not an arbitrary atom moving on its own.',
    'The chapter moves from force constants to a mass-weighted dynamical matrix, uses one-dimensional chains to interpret acoustic and optical branches, and then reorganizes the modes through occupation, heat capacity, and density of states.'),
  chapter(5, 'Electron dynamics in crystals', 2,
    'Constructs effective one-band dynamics, Wannier functions, effective masses, and Berry geometry for slowly varying perturbations.',
    'A band can act as an effective Hamiltonian only while the perturbation stays within the chosen band or subspace; Berry quantities then track how the basis changes across momentum space.',
    'Localized Wannier and extended Bloch pictures are related by a transform. The source uses that bridge to treat shallow impurities and semiclassical motion before exposing geometric phases and anomalous velocity.'),
  chapter(6, 'Many-electron interactions: the homogeneous interacting electron gas and beyond', 2,
    'Uses jellium, Hartree–Fock, pair correlations, and the exchange–correlation hole to make missing many-body structure visible.',
    'Exchange follows from fermionic antisymmetry; correlation describes additional joint avoidance relative to a declared reference, and neither is merely a fitted correction.',
    'The electron gas supplies a tunable density scale. Hartree–Fock reveals exact exchange and its limitations, while pair-correlation functions and the hole sum rule convert an abstract many-body error into a spatial object.'),
  chapter(7, 'Density functional theory (DFT)', 2,
    'Moves from the interacting ground-state problem through Hohenberg–Kohn foundations to the Kohn–Sham construction, pseudopotentials, and representative material calculations.',
    'Exact ground-state DFT, the auxiliary Kohn–Sham system, an exchange–correlation approximation, and a numerical representation are distinct layers.',
    'The chapter presents the density as a ground-state variable, introduces a same-density noninteracting system, and then closes the practical equations with approximate exchange–correlation and core treatments. Its applications show what this stack can calculate, not what the theorems alone prove.'),
  chapter(8, 'The dielectric function for solids', 2,
    'Develops nonlocal linear response, dielectric matrices, screening, the independent-particle response, and RPA before applying them to metals and insulators.',
    'Screening is a response relation between an applied perturbation and an induced field; in a crystal it is generally a matrix in reciprocal-lattice components, not one universal scalar constant.',
    'The chapter begins with a two-point response kernel, introduces microscopic local-field coupling, and builds a self-consistent screening equation. Electron-gas limits then make Thomas–Fermi screening, Friedel oscillations, plasmons, and loss spectra concrete.'),
  chapter(9, 'Electronic transitions and optical properties of solids', 3,
    'Connects measured reflection and absorption to current response, intraband motion, interband transitions, matrix elements, and electron–hole attraction.',
    'An optical peak needs both a neutral excitation energy and a transition matrix element; a joint density of states alone cannot determine brightness.',
    'After classical optical constants and the Drude limit, the source builds independent-particle absorption and then shows how an excited electron and the hole it leaves behind reorganize the neutral spectrum into excitons.'),
  chapter(10, 'Electron–phonon interactions', 3,
    'Derives coupling from the change of the electronic potential under a phonon displacement and uses metals, polar crystals, deformation potentials, and polarons to interpret it.',
    'An electron–phonon matrix element is a derivative of the electronic problem along a normal-mode displacement, evaluated between specified electronic states.',
    'A rigid-ion expansion supplies the coupling operator and momentum selection. The source then contrasts short-range, long-range polar, and deformation-potential limits before following weak coupling into energy shifts, mass enhancement, and a phonon-dressed polaron.'),
  chapter(11, 'Dynamics of crystal electrons in a magnetic field', 3,
    'Moves from Landau quantization to semiclassical orbits and quantum oscillations that map extremal Fermi-surface cross sections.',
    'A magnetic field changes both the allowed quantum spectrum and the motion along a band; which picture is useful depends on field, density, and the observable.',
    'Free electrons establish Landau levels and their degeneracy. Crystal-band dynamics then turn constant-energy contours into real-space cyclotron orbits, while oscillations periodic in inverse field expose extremal Fermi-surface areas.'),
  chapter(12, 'Fundamentals of transport phenomena in solids', 3,
    'Separates band motion, occupation, scattering, magnetic deflection, and thermal driving in Hall, quantum Hall, and Boltzmann transport.',
    'Transport is not fixed by a band plot alone: velocities, occupations, scattering, boundary conditions, and the measured current all enter.',
    'The chapter begins with one- and two-carrier magnetotransport, uses the integer quantum Hall effect to show the quantum limit, and then follows a nonequilibrium distribution through the Boltzmann equation to electrical and thermal currents.'),
  chapter(13, 'Using many-body techniques', 4,
    'Introduces occupation-number language, field operators, one-particle Green functions, spectral weight, self-energy, Dyson equations, and diagrams.',
    'The one-particle Green function records the amplitudes for charged addition and removal; its poles and spectral weight describe interacting quasiparticles and satellites rather than auxiliary Kohn–Sham levels.',
    'Second quantization first makes particle statistics and changing occupations economical. Time-ordered propagation then connects the exact N-electron ground state to N±1 sectors, while self-energy and diagrammatic resummation organize interaction effects.'),
  chapter(14, 'Superconductivity', 4,
    'Connects defining experiments to London and Ginzburg–Landau descriptions, then develops BCS pairing, quasiparticles, tunneling, spectroscopy, and more general gap kernels.',
    'Superconductivity is a collective broken-symmetry state with a paired excitation spectrum; an attractive pairing channel is necessary input, not by itself proof of a transition in a real material.',
    'The source starts from zero resistance and flux expulsion, moves through electrodynamic and order-parameter scales, and then constructs the BCS state. Later sections test that state through thermodynamics, tunneling, and spectroscopy before relaxing the simplest gap kernel.'),
  chapter(15, 'Magnetism', 4,
    'Builds orbital and spin responses, localized exchange models, collective spin waves, itinerant magnetism, and magnetic-impurity screening.',
    'Magnetism can arise from different degrees of freedom and approximations; a local moment, an ordered phase, and a converged spin-polarized calculation are not interchangeable claims.',
    'Diamagnetism and paramagnetism set single-particle baselines. Localized-spin exchange then explains ferro- and antiferromagnetic order, while itinerant and impurity sections show how band filling, interactions, and screening create different magnetic regimes.'),
  chapter(16, 'Reduced-dimensional systems and nanostructures', 4,
    'Uses confinement, reservoirs, transmission, Coulomb charging, and graphene-family band geometry to explain nanoscale spectra, conductance, and optical response.',
    'Reducing dimension changes the allowed states, screening, contacts, and interactions; a small object is not simply a bulk band structure drawn in a smaller box.',
    'Discrete level structure leads to ballistic channels, Landauer conductance, and Coulomb blockade. Graphene, nanotubes, nanoribbons, and monolayers then show how symmetry, boundary quantization, spin–orbit coupling, and enhanced electron–hole attraction reshape electronic and optical properties.'),
];

export const cohenLouieParts: CohenLouiePart[] = [
  {
    id: 'cohen-louie-part-i', slug: 'part-i', number: 'I', title: 'Basic concepts: electrons and phonons', route: '/reading/books/cohen-louie/part-i/',
    question: 'What are the elementary states and excitations from which the rest of condensed-matter physics is built?',
    overview: 'Part I moves from two pictures of a solid to periodic electron states, electronic bands, and quantized lattice vibrations. It establishes the k-space language shared by electrons and phonons without identifying their wavevectors or physical meanings.',
    synthesis: 'Read this Part as a construction of the book’s vocabulary: constituents become periodic eigenstates; spectra become bands and branches; occupations turn spectra into a state; and collective lattice motion becomes the phonon basis needed by later interactions.',
    chapterSlugs: ['chapter-01','chapter-02','chapter-03','chapter-04'],
  },
  {
    id: 'cohen-louie-part-ii', slug: 'part-ii', number: 'II', title: 'Electron interactions, dynamics, and responses', route: '/reading/books/cohen-louie/part-ii/',
    question: 'How do interactions and perturbations change the one-particle picture without making it useless?',
    overview: 'Part II develops effective band dynamics, the interacting electron gas, density-functional theory, and dielectric response. Each chapter introduces a reduced object—an effective Hamiltonian, pair correlation, density, or response kernel—whose scope must remain explicit.',
    synthesis: 'The common move is not to deny the many-body problem but to ask which reduced object answers the present question. The resulting models are powerful precisely because their domain, approximation, and observable are stated.',
    chapterSlugs: ['chapter-05','chapter-06','chapter-07','chapter-08'],
  },
  {
    id: 'cohen-louie-part-iii', slug: 'part-iii', number: 'III', title: 'Optical and transport phenomena', route: '/reading/books/cohen-louie/part-iii/',
    question: 'How do electronic and vibrational states respond, scatter, carry current, and appear to external probes?',
    overview: 'Part III follows optical transitions, electron–phonon coupling, magnetic-field dynamics, and transport. It repeatedly separates a state spectrum from the matrix elements, occupations, scattering processes, and experimental geometry that convert that spectrum into an observable.',
    synthesis: 'A calculated dispersion is only one layer of a response or transport prediction. Coupling matrix elements select transitions, scattering supplies lifetimes, fields redirect motion, and a measurement defines which current or spectrum is observed.',
    chapterSlugs: ['chapter-09','chapter-10','chapter-11','chapter-12'],
  },
  {
    id: 'cohen-louie-part-iv', slug: 'part-iv', number: 'IV', title: 'Many-body effects, superconductivity, magnetism, and lower-dimensional systems', route: '/reading/books/cohen-louie/part-iv/',
    question: 'Which new objects become necessary when interactions reorganize spectra, order, and dimensionality?',
    overview: 'Part IV introduces Green functions and self-energy before applying collective and many-body reasoning to superconductivity, magnetism, nanoscale transport, graphene, nanotubes, and atomically thin materials.',
    synthesis: 'The Part’s unifying lesson is that emergent behavior requires the right interacting object: spectral functions for charged propagation, anomalous pairing amplitudes for superconductivity, order and spin correlations for magnetism, and contact- plus screening-aware descriptions in reduced dimensions.',
    chapterSlugs: ['chapter-13','chapter-14','chapter-15','chapter-16'],
  },
];

export const cohenLouieReadingSlugs = [
  ...cohenLouieParts.map((entry) => entry.slug),
  ...cohenLouieChapters.map((entry) => entry.slug),
];
