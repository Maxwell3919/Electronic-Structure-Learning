export const shollSteckelCanonicalSource = {
  href: 'https://doi.org/10.1002/9780470447710',
  label: 'Wiley record for the book',
};

export type ShollSteckelSourceFigureGuide = {
  locator: string;
  section: string;
  reading: string;
  boundary: string;
};

const sourceFigures: Record<string, ShollSteckelSourceFigureGuide[]> = {
  'chapter-01': [
    {
      locator: 'Tables 1.1–1.2',
      section: '§1.6 · method and basis comparisons for CH₄',
      reading: 'Read across each row before comparing rows. Table 1.1 changes the electronic method at one stated basis; Table 1.2 holds the B3LYP approximation fixed while enlarging the localized basis. Their different axes of change are the lesson.',
      boundary: 'The timings and errors belong to one small molecule and 2009 implementations. They do not define a universal cost or accuracy ranking.',
    },
    {
      locator: 'Figs. 1.1–1.2',
      section: '§1.6.1 · localized and periodic functions',
      reading: 'Compare what each representation makes easy: atom-centered functions concentrate resolution near nuclei, while periodic functions match extended boundary conditions. Treat the drawings as representation choices, not different physical theories.',
      boundary: 'A localized basis is not synonymous with empirical chemistry, and a plane-wave basis is not synonymous with DFT.',
    },
  ],
  'chapter-02': [
    {
      locator: 'Figs. 2.1–2.4',
      section: '§§2.1–2.3 · energy landscapes for candidate crystals',
      reading: 'In each panel, find the minimum only after identifying which structural degrees of freedom were varied. The hcp panel adds a second coordinate through c/a and therefore exposes why a one-parameter scan does not generalize.',
      boundary: 'A minimum is conditional on the chosen structure, functional, representation, and candidate set; it is not an unrestricted crystal prediction.',
    },
    {
      locator: 'Fig. 2.5',
      section: '§2.5 · pressure-induced transformation',
      reading: 'Follow the common tangent between two energy–volume branches. At each contact its derivative obeys dE/dV = −p, so the same pressure makes the two enthalpies equal; the contact volumes need not be the zero-pressure minima.',
      boundary: 'The construction omits finite-temperature entropy unless free-energy contributions are added explicitly.',
    },
  ],
  'chapter-03': [
    {
      locator: 'Fig. 3.2 and Tables 3.2–3.3',
      section: '§3.1.3 · k-point convergence and symmetry',
      reading: 'Separate the density of the full Brillouin-zone mesh from the number of irreducible points actually evaluated. Then compare absolute energies with the structurally matched energy differences; cancellation is empirical evidence here, not a theorem.',
      boundary: 'Neither an even/odd grid pattern nor one converged total energy transfers automatically to another cell, material, or observable.',
    },
    {
      locator: 'Figs. 3.3–3.4',
      section: '§§3.1.4–3.2 · metallic occupations and plane-wave cutoff',
      reading: 'Fig. 3.3 shows a sharp occupation boundary being regularized; Fig. 3.4 shows an independent basis-size limit. Read them as two distinct approximations that must be tested separately.',
      boundary: 'A smearing width is not automatically a physical electronic temperature, and cutoff convergence does not validate the pseudopotential or exchange–correlation model.',
    },
    {
      locator: 'Figs. 3.5–3.6',
      section: '§3.3 · local numerical optimization',
      reading: 'Compare the update geometry and error decay of the two one-dimensional methods. The figures motivate why an algorithm, initial state, and stopping rule jointly determine which local solution is reached.',
      boundary: 'Fast convergence to a stationary point does not establish a global minimum or physical stability.',
    },
  ],
  'chapter-04': [
    {
      locator: 'Figs. 4.1–4.3',
      section: '§4.2 · the periodically repeated slab',
      reading: 'Start with one cell, then follow its replicas. The apparent vacuum is part of a three-dimensionally periodic model, and the slab has two terminations even when only one is of interest.',
      boundary: 'Vacuum thickness alone does not remove electrostatic image interactions or make an asymmetric slab equivalent to an isolated semi-infinite surface.',
    },
    {
      locator: 'Fig. 4.11 and Tables 4.1–4.2',
      section: '§§4.5–4.6 · relaxation and surface-energy convergence',
      reading: 'Use the schematic to identify constrained and relaxed layers, then use the tables to ask whether the target property is stable with slab thickness. Structural convergence and energy convergence need not occur at the same rate.',
      boundary: 'The tested Cu slabs support those reported observables; they do not supply a universal layer or vacuum prescription.',
    },
    {
      locator: 'Fig. 4.12',
      section: '§4.7 · symmetric and asymmetric slabs',
      reading: 'Use the mirror plane to identify the paired surfaces and see why their normal dipoles cancel. Then compare the number of relaxed layers on both faces with the one-sided asymmetric construction.',
      boundary: 'Dipole cancellation does not establish vacuum or slab-thickness convergence, and a dipole correction cannot repair the wrong termination or lateral adsorbate interactions.',
    },
    {
      locator: 'Fig. 4.16 and Tables 4.3–4.4',
      section: '§§4.9–4.10 · adsorption sites, references, and coverage',
      reading: 'First distinguish a symmetry-fixed stationary geometry from a tested local minimum. Then compare the two adsorption references and finally the periodically repeated coverages. Each change answers a different physical question.',
      boundary: 'A negative adsorption energy does not identify kinetics, finite-temperature coverage, or the globally preferred surface phase.',
    },
  ],
  'chapter-05': [
    {
      locator: 'Table 5.1 and Fig. 5.1',
      section: '§5.1 · finite-difference displacement',
      reading: 'Look for the plateau between the large-displacement anharmonic error and the small-displacement numerical-noise error. The useful displacement is determined by both limits, not by making the step as small as possible.',
      boundary: 'The plateau belongs to this molecule, numerical setup, and observable; its displacement range is not a universal input value.',
    },
    {
      locator: 'Tables 5.2–5.3',
      section: '§§5.2–5.3 · normal modes in gas phase and on a surface',
      reading: 'Read an eigenvector together with its frequency. Rigid translations and rotations should be zero for an isolated molecule, while adsorption converts them into frustrated motions and a surface bond stretch.',
      boundary: 'Small residual imaginary frequencies in nominal zero modes may be numerical, but an unstable mode cannot be dismissed without a convergence and symmetry analysis.',
    },
    {
      locator: 'Fig. 5.3 and Table 5.4',
      section: '§5.4 · zero-point and thermal vibrational contributions',
      reading: 'Compare the electronic energy ordering with the zero-point-corrected ordering before following its temperature dependence. Light-atom confinement changes the mode frequencies and therefore the correction.',
      boundary: 'Harmonic vibrational free energies omit anharmonicity and do not by themselves establish complete finite-temperature phase stability.',
    },
  ],
  'chapter-06': [
    {
      locator: 'Figs. 6.2–6.5',
      section: '§6.1 · energy surface, saddle, and rate sensitivity',
      reading: 'Move from the two-dimensional surface to the one-dimensional minimum-energy path, locate the first-order saddle, and then compare how a small barrier change moves the predicted rate by orders of magnitude.',
      boundary: 'The minimum-energy path and harmonic prefactor are ingredients of transition-state theory; they do not prove that recrossing, tunneling, or alternative mechanisms are negligible.',
    },
    {
      locator: 'Figs. 6.6–6.9',
      section: '§§6.3.1–6.3.3 · elastic-band and NEB paths',
      reading: 'Follow how spring forces distribute images, then how NEB removes the force component that would cut across the path. Compare initial interpolations to see why an image chain can converge to different path families.',
      boundary: 'NEB is a local path optimizer between declared endpoints, not a global search over all reaction mechanisms.',
    },
    {
      locator: 'Figs. 6.10–6.12',
      section: '§6.4 · competing surface-diffusion mechanisms',
      reading: 'Compare direct hopping and exchange as different atomic rearrangements before comparing their barriers. The lower reported barrier identifies the faster harmonic-TST channel only under comparable prefactor assumptions.',
      boundary: 'The lowest mechanism found is not proof that a still-lower untested mechanism does not exist.',
    },
  ],
  'chapter-07': [
    {
      locator: 'Figs. 7.1–7.3',
      section: '§7.1 · grand potentials and bulk oxidation',
      reading: 'Read each line as one candidate phase with a composition-dependent slope in oxygen chemical potential. The lower envelope selects the equilibrium candidate; converting the horizontal variable to pressure and temperature adds a reservoir model.',
      boundary: 'The diagram is conditional on the candidate phases, DFT energies, gas model, and omitted solid free-energy terms.',
    },
    {
      locator: 'Fig. 7.4',
      section: '§7.1.1 · configurational entropy and vacancies',
      reading: 'Follow how oxygen pressure enters the vacancy concentration through the reservoir chemical potential. The exponential dependence is the combined result of a defect energy and a dilute configurational-entropy model.',
      boundary: 'The dilute, noninteracting-vacancy approximation is not a defect phase diagram at arbitrary concentration or charge state.',
    },
    {
      locator: 'Figs. 7.5–7.6',
      section: '§7.2 · surface phases in an oxygen reservoir',
      reading: 'Use the structures to identify what differs between candidate surfaces, then locate the pressure–temperature region where the surface oxide lies on the lower envelope. The figure sequence makes the candidate-structure problem visible.',
      boundary: 'Equilibrium preference neither identifies the active catalytic state under turnover nor supplies a formation rate.',
    },
  ],
  'chapter-08': [
    {
      locator: 'Figs. 8.1–8.6',
      section: '§8.1 · total density of states',
      reading: 'Compare occupied and unoccupied weight around the chosen energy zero, then ask how dense the k sampling was and which integration treatment generated the curve. The Si and Ag₂O examples show that geometry and spectral classification can have different approximation errors.',
      boundary: 'DOS integrates over k and is not a band path, a photoemission spectrum, or a proof that an approximate Kohn–Sham gap equals an experimental gap.',
    },
    {
      locator: 'Figs. 8.7–8.8',
      section: '§8.2 · local and angular-momentum projections',
      reading: 'Compare the total DOS with the O- and Si-centered contributions while keeping the chosen sphere radii in view. The projections help assign character but do not uniquely divide the density into atoms.',
      boundary: 'Projected weights and Bader charges are named interpretation frameworks, not unique observables or formal oxidation states.',
    },
    {
      locator: 'Figs. 8.9–8.10',
      section: '§8.3 · magnetic branches',
      reading: 'Treat each spin pattern as a different initialized branch, then compare its relaxed energy curve. The large shift between non-spin-polarized and ferromagnetic Fe shows that spin is part of the physical model, not a plotting option.',
      boundary: 'Convergence of one collinear branch does not prove the global magnetic ground state or include noncollinearity and spin–orbit coupling.',
    },
  ],
  'chapter-09': [
    {
      locator: 'Fig. 9.1',
      section: '§9.2 · Car–Parrinello versus Born–Oppenheimer motion',
      reading: 'Compare the smooth Born–Oppenheimer surface with the nearby electronic trajectory. The fictitious electronic dynamics are meant to keep the nuclei near the ground-state surface while avoiding a separate full minimization at every step.',
      boundary: 'The fictitious electronic motion is not a prediction of real electron dynamics.',
    },
    {
      locator: 'Figs. 9.2–9.4',
      section: '§9.3.1 · liquid and amorphous InP',
      reading: 'Read the imposed temperature history before the energy curve, then inspect partial radial distribution functions for structural changes. The claimed amorphous model is a product of a finite cell and extremely rapid simulated quench.',
      boundary: 'One trajectory and one quench protocol do not establish equilibrium sampling, a unique glass structure, or experimental cooling-rate behavior.',
    },
    {
      locator: 'Figs. 9.5–9.6',
      section: '§9.3.2 · Pt₁₃ energy-landscape exploration',
      reading: 'Compare hand-built symmetric minima with structures harvested from a hot trajectory, then follow the energy trace to see where candidate snapshots were selected for relaxation.',
      boundary: 'High-temperature AIMD can generate new candidates but does not enumerate every minimum or assign equilibrium populations without further sampling.',
    },
  ],
  'chapter-10': [
    {
      locator: 'Fig. 10.1',
      section: '§10.1 · two meanings of accuracy',
      reading: 'Follow the two separate distances: finite numerical work to the exact solution of the chosen approximate equations, and that model solution to the target physical quantity. Improving the first distance need not shrink the second.',
      boundary: 'The diagram is a conceptual decomposition; each observable has its own numerical and model-discrepancy evidence.',
    },
    {
      locator: 'Fig. 10.2',
      section: '§10.2 · Jacob’s ladder',
      reading: 'Use the ladder to identify which density ingredients enter a functional, then resist reading vertical position as a universal score. Constraint satisfaction, empirical fitting, cost, system class, and observable all remain relevant.',
      boundary: 'A higher rung is not automatically more accurate for every material or property, and hybrid/generalized-Kohn–Sham calculations are not merely semilocal DFT with a numerical switch.',
    },
  ],
};

export const getShollSteckelSourceFigures = (slug: string) => sourceFigures[slug] ?? [];
