export type GiustinoUnit = {
  id: string;
  slug: string;
  kind: 'chapter' | 'appendix';
  number: string;
  label: string;
  title: string;
  route: string;
  contribution: string;
  coreIdea: string;
  overview: string;
};

const unit = (
  kind: GiustinoUnit['kind'],
  number: string,
  title: string,
  contribution: string,
  coreIdea: string,
  overview: string,
): GiustinoUnit => {
  const slug = kind === 'chapter' ? `chapter-${number.padStart(2, '0')}` : `appendix-${number.toLowerCase()}`;
  const label = `${kind === 'chapter' ? 'Chapter' : 'Appendix'} ${number}`;
  return {
    id: `giustino-${slug}`,
    slug,
    kind,
    number,
    label,
    title,
    route: `/reading/books/giustino/${slug}/`,
    contribution,
    coreIdea,
    overview,
  };
};

export const giustinoUnits: GiustinoUnit[] = [
  unit('chapter', '1', 'Computational materials modelling from first principles',
    'Uses structural, superconducting, geophysical, fracture, and catalyst examples to show what first-principles calculations contribute—and where larger-scale models and experimental interpretation remain necessary.',
    'First-principles modelling is an approximation stack anchored to quantum mechanics, not a promise that one DFT calculation directly predicts every material property.',
    'The source starts with density-functional calculations in practice, moves through five applications of increasing scale, and ends by asking why DFT became useful and why emergent behavior still exceeds a direct atom-by-atom description.'),
  unit('chapter', '2', 'Many-body Schrödinger equation',
    'Builds the interacting electron–nuclear problem and then introduces clamped nuclei, independent particles, antisymmetry, Hartree, Hartree–Fock, and a heuristic route to Kohn–Sham equations.',
    'Useful one-particle equations arise by restricting or reorganizing the many-electron problem; they do not show that the physical electrons have stopped interacting.',
    'The chapter moves from Coulomb interactions to a joint many-body wavefunction, quantifies the scale of the direct problem, and develops a controlled ladder of approximations before Chapter 3 supplies the rigorous density-functional foundation.'),
  unit('chapter', '3', 'Density functional theory',
    'Connects the ground-state density to total energy, introduces Hohenberg–Kohn reasoning, constructs Kohn–Sham equations, specializes to LDA, and closes the nonlinear density cycle.',
    'The density can determine the interacting ground-state energy in principle, while the Kohn–Sham construction and an exchange–correlation approximation are the separate steps that make calculations possible.',
    'The source asks how density can replace the wavefunction, how one-particle equations return, and how the total energy is evaluated. Its electron-gas examples lead to LDA and its self-consistent cycle, followed by a remit discussion that requires modern interpretation boundaries.'),
  unit('chapter', '4', 'Equilibrium structures of materials: fundamentals',
    'Turns fixed-nuclei electronic energies into an adiabatic potential-energy surface, forces, the Hellmann–Feynman theorem, and iterative searches for stationary structures.',
    'Electronic structure predicts equilibrium geometry because changing nuclear coordinates changes the electronic Hamiltonian and therefore the energy surface whose gradient is the force.',
    'The chapter restores nuclear motion, separates fast electronic adjustment from slower nuclear motion, defines the Born–Oppenheimer surface, and follows its derivatives into atomic forces and local geometry optimization.'),
  unit('chapter', '5', 'Equilibrium structures of materials: calculations vs. experiment',
    'Applies the energy-and-force picture to molecules, crystals, and surfaces, then compares calculated structures with rotational spectroscopy, X-ray diffraction, and STM.',
    'A structure calculation and an experiment meet through a declared observable and model: bond lengths, diffraction intensities, and tunnelling maps are related but not interchangeable evidence.',
    'The source proceeds from N₂ binding to crystalline silicon and graphite, then introduces diffraction and surface reconstruction. Its examples reveal reference-state, spin, periodic-image, candidate-structure, and measurement-model choices behind apparently simple geometry comparisons.'),
  unit('chapter', '6', 'Elastic properties of materials',
    'Develops strain, stress, elastic tensors, total-energy curvature, the stress theorem, and pressure-dependent comparisons from simple computer experiments.',
    'Elastic constants are second derivatives of a declared energy surface with respect to strain, so they describe local response around a chosen state rather than global stability.',
    'The chapter begins with intuitive deformations, formalizes strain and stress, extracts symmetry-reduced elastic constants from energy curves, and closes with stress-based calculations and high-pressure phase comparisons.'),
  unit('chapter', '7', 'Vibrations of molecules and solids',
    'Expands the energy surface about equilibrium, constructs mass-weighted normal modes, and extends them from molecules to wavevector-dependent crystal vibrations.',
    'A vibration is a collective eigenvector of the mass-weighted curvature matrix; in a crystal, translation symmetry organizes those eigenvectors by a phonon wavevector q.',
    'N₂ provides the harmonic limiting case before the source builds the force-constant and dynamical matrices. Finite differences and linear response then become two ways to obtain the same harmonic object in crystals.'),
  unit('chapter', '8', 'Phonons, vibrational spectroscopy and thermodynamics',
    'Quantizes normal modes, connects them to Raman and neutron measurements, reorganizes them through the phonon DOS, and uses their free-energy contribution in phase diagrams.',
    'A calculated phonon frequency becomes an experimental line only through a scattering matrix element and selection rule, while its thermodynamic role enters through mode occupation and free energy.',
    'The chapter moves from vibrational spectroscopy to vibrons and phonons, then from discrete modes to a DOS and finally to partition functions, entropy, pressure, and Gibbs-energy comparisons.'),
  unit('chapter', '9', 'Band structures and photoelectron spectroscopy',
    'Relates periodic Kohn–Sham eigenproblems to Bloch-labelled bands, occupations, Fermi surfaces, ARPES, and the limitations of approximate eigenvalue gaps.',
    'Kohn–Sham bands inherit Bloch structure from a periodic one-particle Hamiltonian; their usefulness does not make every eigenvalue a measured charged excitation.',
    'The source first explores what Kohn–Sham eigenvalues can mean, then uses Bloch theory to calculate bands, reads copper and photoemission examples, and closes with metal–insulator classification and the band-gap problem.'),
  unit('chapter', '10', 'Dielectric function and optical spectra',
    'Builds polarizability and a complex dielectric function from a driven quantum model, then connects absorption to Kohn–Sham transitions and identifies missing electron–hole and phonon-assisted physics.',
    'Optical response depends on how a perturbation couples states and how the induced polarization evolves; an energy difference alone cannot determine an optical spectrum.',
    'A driven hydrogen model supplies resonance, damping, polarizability, and dissipation. The source then generalizes to solids, constructs an independent-particle DFT spectrum, and names the many-body and phonon processes required beyond it.'),
  unit('chapter', '11', 'Density functional theory and magnetic materials',
    'Introduces spin from the Dirac equation, separates charge and spin densities, develops spin-DFT, and compares itinerant iron with localized antiferromagnetic MnO.',
    'Magnetic calculations require an explicit spin and relativistic model plus competing magnetic states; one converged spin-polarized solution is only one branch of that problem.',
    'The source moves from one-electron spinors to many-electron exchange, then promotes spin density to a functional variable. Fe and MnO show why itinerant and localized magnetism require different reduced models and why small magnetic energy scales are demanding.'),
  unit('appendix', 'A', 'Derivation of the Hartree–Fock equations',
    'Derives the orbital equations by minimizing the interacting Hamiltonian over normalized single-determinant states and exposes direct and nonlocal exchange terms.',
    'Hartree–Fock keeps electron–electron repulsion but restricts the many-electron trial space to one determinant.',
    'The two-electron determinant makes direct and exchanged orbital products visible. Orthonormality constraints lead through Lagrange multipliers to canonical Fock equations, after which the source indicates the N-electron and spin generalizations.'),
  unit('appendix', 'B', 'Derivation of the Kohn–Sham equations',
    'Uses constrained variation of the Kohn–Sham energy decomposition to obtain auxiliary orbital equations and the density that closes them.',
    'Kohn–Sham orbitals re-enter density-functional theory because they provide a tractable representation of the auxiliary kinetic energy and density, not because the physical interacting state is one determinant.',
    'The appendix rewrites the functional in orbital variables, imposes orthonormality, differentiates each energy term, and diagonalizes the multiplier matrix to recover canonical Kohn–Sham equations.'),
  unit('appendix', 'C', 'Numerical solution of the Kohn–Sham equations',
    'Shows how boundary conditions and finite real-space, plane-wave, or atomic-orbital representations turn continuous Kohn–Sham equations into matrix problems inside an SCF loop.',
    'A representation decides how continuous functions become finite arrays; it is distinct from the exchange–correlation model, core treatment, and nonlinear solver.',
    'The appendix fixes a computational domain, discretizes derivatives on a grid, expands periodic functions in plane waves, and forms a generalized eigenproblem in overlapping localized orbitals. Each route produces finite coefficients and an updated density.'),
  unit('appendix', 'D', 'Reciprocal lattice and Brillouin zone',
    'Connects direct translations to reciprocal-lattice vectors, the first Brillouin zone, equivalent k labels, and selected-path band plots.',
    'Reciprocal vectors G define translation-phase redundancy, whereas k labels Bloch states; a plotted path is only a slice through one nonredundant reciprocal cell.',
    'The appendix constructs primitive direct and reciprocal cells, uses their duality to explain periodic Fourier factors, and then distinguishes full-zone band information from the line plots used for visualization.'),
  unit('appendix', 'E', 'Pseudopotentials',
    'Explains core–valence separation, frozen cores, smooth pseudo-wavefunctions, angular-momentum channels, nonlocality, and the need for transferability tests.',
    'A pseudopotential is a versioned physical approximation and numerical input that replaces explicit core states while preserving selected valence behavior outside a chosen core region.',
    'Silicon radial functions reveal why all-electron oscillations are expensive. The source smooths valence functions, inverts an atomic equation to construct channel potentials, de-screens them, and assembles a nonlocal ionic operator for materials calculations.'),
];

export const giustinoReadingSlugs = giustinoUnits.map((entry) => entry.slug);
