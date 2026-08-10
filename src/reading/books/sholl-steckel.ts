export type ShollSteckelChapter = {
  id: string;
  slug: string;
  number: string;
  title: string;
  route: string;
  contribution: string;
  coreIdea: string;
  overview: string;
};

const chapter = (
  number: number,
  title: string,
  contribution: string,
  coreIdea: string,
  overview: string,
): ShollSteckelChapter => {
  const padded = String(number).padStart(2, '0');
  return {
    id: `sholl-steckel-ch${padded}`,
    slug: `chapter-${padded}`,
    number: String(number),
    title,
    route: `/reading/books/sholl-steckel/chapter-${padded}/`,
    contribution,
    coreIdea,
    overview,
  };
};

export const shollSteckelChapters: ShollSteckelChapter[] = [
  chapter(
    1,
    'What Is Density Functional Theory?',
    'Establishes the book’s practical level, motivates DFT through applications, and separates the density-functional idea from basis choice and higher-level wavefunction methods.',
    'The chapter gives a working map of DFT: an interacting ground-state problem is represented through the density, made calculable with Kohn–Sham orbitals, and closed only after an exchange–correlation approximation is chosen.',
    'Three research vignettes motivate the method before the chapter moves from the many-electron Schrödinger problem to density, Kohn–Sham equations, exchange–correlation, localized and periodic representations, and the limits of a 2009 practical introduction.',
  ),
  chapter(
    2,
    'DFT Calculations for Simple Solids',
    'Turns total-energy calculations into comparisons of lattice parameters, candidate structures, and pressure-dependent phases.',
    'A DFT energy curve becomes physically meaningful only after the geometry, reference, candidate set, and thermodynamic conditions have been declared.',
    'The chapter begins with periodic cells and fractional coordinates, develops energy–volume reasoning for simple cubic, fcc, and hcp structures, and closes by showing why ranking a chosen set of structures is not unrestricted crystal-structure prediction.',
  ),
  chapter(
    3,
    'Nuts and Bolts of DFT Calculations',
    'Introduces the main numerical layers of a plane-wave calculation and the local nature of electronic and structural optimization.',
    'Numerical convergence asks whether a finite calculation solves the chosen mathematical model; it does not ask whether that model is physically adequate.',
    'Reciprocal-space quadrature, metallic occupations, plane-wave cutoff, core treatment, iterative Kohn–Sham closure, and geometry optimization are introduced as distinct numerical responsibilities rather than one generic accuracy setting.',
  ),
  chapter(
    4,
    'DFT Calculations for Surfaces of Solids',
    'Shows how a periodic slab encodes a surface and how that model controls relaxation, surface energies, adsorption, reconstruction, and coverage.',
    'A surface calculation is defined as much by termination, slab, vacuum, coverage, and reference state as by the electronic method used to solve it.',
    'The chapter builds the slab model from three-dimensional periodic boundary conditions, then adds surface orientation, structural relaxation, surface and adsorption energies, reconstruction, and periodically repeated adsorbate overlayers.',
  ),
  chapter(
    5,
    'DFT Calculations of Vibrational Frequencies',
    'Uses energy curvature and finite differences to construct molecular normal modes, surface vibrations, zero-point corrections, and the bridge to phonons.',
    'Vibrations are eigenvectors of a mass-weighted curvature problem, so their reliability depends on both the physical harmonic approximation and the numerical quality of the derivatives.',
    'A diatomic stretch supplies the one-dimensional picture; the chapter then forms the Hessian for many coordinates, interprets normal modes and zero modes, adds zero-point energy, and extends the reasoning toward collective crystal vibrations.',
  ),
  chapter(
    6,
    'Calculating Rates of Chemical Processes Using Transition State Theory',
    'Connects minimum-energy paths and saddle points to harmonic transition-state rates, NEB searches, competing mechanisms, and kinetic models.',
    'A DFT barrier is an ingredient in a rate model, not a rate by itself; the transition-state assumptions and the catalog of possible mechanisms remain separate responsibilities.',
    'The chapter follows an adatom from a local minimum across a saddle point, derives the exponential sensitivity of a harmonic TST rate, introduces NEB as a path-finding method, and shows why long-time dynamics require a complete event model.',
  ),
  chapter(
    7,
    'Equilibrium Phase Diagrams from Ab Initio Thermodynamics',
    'Combines DFT energies with chemical potentials and entropy models to compare bulk, defective, and surface phases.',
    'Ab initio thermodynamics is a model stack: electronic energies supply state-specific inputs, while reservoirs, entropy terms, and the candidate phase set define the equilibrium question.',
    'The chapter moves from metal/oxide competition to grand potentials, gas chemical potentials, configurational entropy, vacancy concentrations, surface phases, and the boundary between equilibrium diagrams and kinetics.',
  ),
  chapter(
    8,
    'Electronic Structure and Magnetic Properties',
    'Reads DOS, projected information, charge partitions, and spin-polarized branches while exposing their interpretive limits.',
    'Electronic-structure plots reorganize calculated states; they do not automatically become measured spectra, unique atomic charges, or proof of a global magnetic ground state.',
    'Examples in metals, semiconductors, oxides, impurity supercells, quartz, and iron show how k-space resolution, exchange–correlation choice, projection conventions, and initial magnetic order affect the conclusions available from a calculation.',
  ),
  chapter(
    9,
    'Ab Initio Molecular Dynamics',
    'Builds from classical equations of motion to Born–Oppenheimer and Car–Parrinello dynamics, then uses trajectories to explore disordered phases and complex energy landscapes.',
    'Ab initio molecular dynamics repeatedly couples classical nuclear motion to electronic forces; the trajectory is useful only within its ensemble, time-step, equilibration, and sampling limits.',
    'The chapter introduces Verlet integration and thermostats before replacing a fitted potential by on-the-fly electronic energies and forces. Liquid/amorphous InP and Pt clusters then illustrate both ensemble sampling and structure-search uses of trajectories.',
  ),
  chapter(
    10,
    'Accuracy and Methods beyond “Standard” Calculations',
    'Separates numerical accuracy from observable-specific physical accuracy and places functional choice, dispersion, DFT+U, and larger-scale methods in that distinction.',
    'A converged calculation is only a precise answer to the model that was posed; scientific support also requires an adequate physical model and evidence tied to the target observable.',
    'The closing chapter returns to every earlier approximation, asks what can be converged and what must instead be validated, surveys several 2009-era correction strategies, and ends by locating plane-wave DFT within a larger modeling toolbox.',
  ),
];

export const shollSteckelReadingSlugs = shollSteckelChapters.map((entry) => entry.slug);
