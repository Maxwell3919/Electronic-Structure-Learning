export const cohenLouieCanonicalSource = {
  href: 'https://www.cambridge.org/9780521513319',
  label: 'Cambridge record for the book',
};

export type CohenLouieSourceFigureGuide = {
  locator: string;
  section: string;
  reading: string;
  boundary: string;
  visual?: 'pairing-gap';
};

const sourceFigures: Record<string, CohenLouieSourceFigureGuide[]> = {
  'chapter-01': [
    { locator: 'Figs. 1.1 and 1.3–1.4', section: '§§1.2–1.6 · two pictures and their dispersions', reading: 'Begin with the core-and-valence sketch, then compare the electronic and collective dispersion panels. Identify what carries charge, what is a hole, and which curves describe collective motion rather than a single electron.', boundary: 'The curves are conceptual examples. They do not imply that every measured excitation is a bare particle or that one static band plot contains all interacting spectra.' },
    { locator: 'Figs. 1.5–1.8', section: '§§1.7–1.8 · interactions as processes', reading: 'Read each line as a propagating object and each meeting point as a process that changes states. Follow energy and momentum labels before interpreting the physical event.', boundary: 'These diagrams organize perturbative processes; a drawn vertex is not evidence that the process is strong, observable, or accurately described at lowest order.' },
  ],
  'chapter-02': [
    { locator: 'Figs. 2.1–2.2', section: '§2.5 · lattice, basis, and primitive cell', reading: 'Separate the repeated translation points from the objects attached to them, then compare primitive and conventional descriptions of the same crystal.', boundary: 'A Bravais lattice is not the crystal structure by itself, and a convenient cell does not create a different solid.' },
    { locator: 'Fig. 2.3', section: '§2.5.3 · reciprocal lattice and first Brillouin zone', reading: 'Construct the region from reciprocal-lattice bisectors and ask which k labels are redundant modulo G. The geometry matters because it selects one representative set of translation characters.', boundary: 'A Brillouin zone is not a band path, and reciprocal-lattice vectors G are not Bloch labels k.' },
  ],
  'chapter-03': [
    { locator: 'Figs. 3.1 and 3.5', section: '§§3.1 and 3.3 · folding and gap opening', reading: 'Compare extended and reduced-zone labels first; then locate where a periodic potential mixes degenerate free-electron states and opens a gap at a zone boundary.', boundary: 'The nearly-free picture explains one limiting mechanism. It does not make every material weakly perturbed or every gap a simple two-state splitting.' },
    { locator: 'Figs. 3.6–3.9', section: '§§3.4–3.5 · local levels, bands, and curvature', reading: 'Follow one atomic level as translated sites couple, then use the slope and curvature of the resulting band to read velocity and effective mass.', boundary: 'Cosine-like tight-binding bands are a model limit; effective mass is local to a stated extremum and can be a tensor.' },
    { locator: 'Figs. 3.14–3.17', section: '§3.7 · filling and real-material band plots', reading: 'First locate the occupied boundary, then read each plotted symmetry line as a selected slice through the Brillouin zone. Compare how material chemistry changes gaps and orbital characters.', boundary: 'A selected path cannot exclude an off-path extremum or Fermi pocket. The empirical pseudopotential examples are fitted models, not first-principles DFT results.' },
  ],
  'chapter-04': [
    { locator: 'Figs. 4.2 and 4.4–4.8', section: '§4.1 · chains, polarization patterns, and branches', reading: 'Track which atoms move together and which move oppositely. Use q→0 to distinguish a translation-like acoustic mode from an internal optical motion.', boundary: 'The one-dimensional chains explain branch structure, not the full force-constant complexity of a three-dimensional material.' },
    { locator: 'Figs. 4.10–4.13 and 4.20–4.21', section: '§§4.3–4.5 · thermodynamics, DOS, and critical points', reading: 'Connect a mode occupation to its heat-capacity contribution, then compare dispersion extrema with peaks or singularities in the vibrational DOS.', boundary: 'A DOS discards the q-space location of each mode; a displayed path does not establish stability throughout the full phonon Brillouin zone.' },
  ],
  'chapter-05': [
    { locator: 'Figs. 5.1–5.4', section: '§§5.1–5.3 · one-band dynamics and localization', reading: 'Follow a wave packet within one band, compare extended Bloch and localized Wannier descriptions, and identify why a slowly varying impurity potential can be treated by an effective Hamiltonian.', boundary: 'The construction assumes a suitable isolated band or subspace and weak interband mixing; it is not a universal reduction for arbitrary fields.' },
    { locator: 'Figs. 5.5–5.10', section: '§§5.4–5.6 · fields and Berry geometry', reading: 'Separate ordinary band velocity from field-driven k-space motion, then follow the closed loop used to define a geometric phase.', boundary: 'A Berry connection and an open-path phase depend on gauge. At degeneracies or in a composite manifold, use subspace/projector or non-Abelian formulations rather than arbitrary band labels.' },
  ],
  'chapter-06': [
    { locator: 'Figs. 6.1–6.2', section: '§§6.1–6.3 · density regimes and Hartree–Fock failure', reading: 'Use r_s to move between kinetic- and interaction-dominated regimes, then inspect the Hartree–Fock dispersion near the Fermi surface rather than treating exact exchange as a uniformly improved spectrum.', boundary: 'Hartree–Fock is exact about single-determinant antisymmetry, not about general correlation or screening.' },
    { locator: 'Figs. 6.4–6.6 and Table 6.1', section: '§§6.4–6.7 · pair correlation and the hole', reading: 'Fix one electron and read how the conditional density changes around it. Separate the same-spin exchange deficit from additional Coulomb correlation before using the hole to discuss energy.', boundary: 'The source’s hole-energy construction is not the whole exact DFT exchange–correlation functional; the latter also contains the interacting kinetic-energy difference and requires the appropriate coupling-constant formulation.' },
  ],
  'chapter-07': [
    { locator: 'Fig. 7.1', section: '§7.2 · same-density auxiliary system', reading: 'Compare the interacting and auxiliary systems by what is held equal: the ground-state density. The orbitals belong to the auxiliary construction and recover a tractable kinetic term.', boundary: 'The figure does not say the physical electrons cease to interact, nor that Kohn–Sham orbitals are literal many-electron quasiparticles.' },
    { locator: 'Figs. 7.3–7.7 and Tables 7.1–7.2', section: '§§7.3–7.4 · core treatment and applications', reading: 'Identify which panel changes a numerical/core representation and which reports a physical result such as an equation of state, surface property, or phonon dispersion.', boundary: 'A pseudopotential is a versioned scientific input. Agreement in one table does not establish transferability to another chemical environment or observable.' },
  ],
  'chapter-08': [
    { locator: 'Figs. 8.1–8.2', section: '§§8.1–8.3 · external, screened, and microscopic fields', reading: 'Follow the applied field into the induced density and then into the total field. In the silicon panel, compare macroscopic behavior with microscopic G,G′ components that encode local-field coupling.', boundary: 'A single scalar dielectric constant cannot represent arbitrary microscopic or finite-q response.' },
    { locator: 'Figs. 8.7–8.11', section: '§§8.5–8.6 · screening signatures and loss', reading: 'Relate the 2k_F structure to real-space Friedel oscillations, then distinguish a zero of the dielectric response from a peak of the loss function.', boundary: 'RPA and electron-gas limits organize screening physics; they do not automatically give quantitatively complete excitation spectra for a real material.' },
  ],
  'chapter-09': [
    { locator: 'Figs. 9.1–9.3', section: '§§9.1–9.3 · optical geometry and the Drude limit', reading: 'Start from what is sent into and measured from the sample, then connect reflectivity to the complex dielectric response. Use the Drude curves only for the intraband, free-carrier limit.', boundary: 'A fitted Drude response does not determine interband or excitonic structure.' },
    { locator: 'Figs. 9.18–9.22', section: '§§9.4–9.5 · transitions, excitons, and brightness', reading: 'Compare spectra with and without electron–hole attraction, then identify which states carry oscillator strength and which remain dark despite existing in the neutral spectrum.', boundary: 'A joint DOS counts possible energy differences; optical intensity also requires matrix elements, and a neutral exciton is not an N+2-particle state.' },
  ],
  'chapter-10': [
    { locator: 'Figs. 10.1–10.5', section: '§§10.1–10.2 · coupling processes and Umklapp', reading: 'Distinguish phonon emission/absorption from virtual exchange, then use the Umklapp diagram to track crystal momentum modulo a reciprocal-lattice vector.', boundary: 'Large coupling or a virtual-process diagram alone does not establish a transport rate, structural transition, or superconducting state.' },
    { locator: 'Figs. 10.6–10.10', section: '§§10.2–10.3 · polar coupling, deformation, and polarons', reading: 'Relate LO ionic displacement to its long-range field, compare it with a band-edge deformation potential, and then read the polaron as an electron plus induced lattice polarization.', boundary: 'Rigid-ion and weak-coupling Fröhlich models are controlled limits; strong coupling and material-specific screening can require different treatments.' },
  ],
  'chapter-11': [
    { locator: 'Figs. 11.1–11.2', section: '§11.1 · Landau quantization', reading: 'Separate free motion parallel to B from quantized cyclotron motion perpendicular to it. Then count the degeneracy associated with possible orbit centers.', boundary: 'The displayed spectrum neglects crystal-band, Zeeman, disorder, and interaction effects unless they are added explicitly.' },
    { locator: 'Figs. 11.3–11.10', section: '§§11.2–11.4 · momentum-space orbits and oscillations', reading: 'Follow the constant-energy orbit perpendicular to B, map it to real-space motion, and then identify the extremal Fermi-surface cross section selected by the oscillation period.', boundary: 'Quantum oscillations sample extremal areas and require adequate lifetime and field conditions; one orientation does not reconstruct an arbitrary three-dimensional Fermi surface.' },
  ],
  'chapter-12': [
    { locator: 'Figs. 12.1–12.5', section: '§§12.1–12.2 · Hall geometry, carrier models, and quantum limit', reading: 'Fix the signs and directions of current, field, and Hall voltage before comparing one-carrier, two-carrier, and open-orbit responses. Then read the plateau/vanishing-longitudinal-response pair in the quantum Hall sketch.', boundary: 'A Hall coefficient is not always an inverse carrier density, and the elementary carrier model does not include arbitrary multiband scattering.' },
    { locator: 'Figs. 12.8 and 12.11–12.13', section: '§§12.2–12.4 · broadened levels, edges, and distribution flow', reading: 'Connect localized and extended Landau states to transport, then follow the distribution function through phase space under drift and collisions.', boundary: 'The relaxation-time approximation compresses a collision operator into a model parameter; it is not a first-principles lifetime unless separately calculated and validated.' },
  ],
  'chapter-13': [
    { locator: 'Figs. 13.1–13.5', section: '§§13.2–13.3 · propagation and self-energy', reading: 'Read a straight line as a chosen propagator, interaction lines as couplings, and the irreducible self-energy block as everything that dresses one-particle propagation without being cut into two by one electron line.', boundary: 'Diagrams are terms in a declared expansion and convention; they are not literal particle trajectories.' },
    { locator: 'Figs. 13.6–13.12', section: '§13.3 · screening, Dyson sums, and vertices', reading: 'Follow repeated polarization bubbles into screened interaction, then compare bare and dressed phonon propagation and identify where a vertex correction changes the coupling.', boundary: 'Selecting GW-, RPA-, or low-order vertex diagrams defines an approximation family; it does not guarantee convergence or independence from the starting representation.' },
  ],
  'chapter-14': [
    { locator: 'Figs. 14.1–14.10', section: '§14.1 · defining experimental signatures', reading: 'Compare zero resistance with flux expulsion, critical fields, heat capacity, and acoustic attenuation. Treat the collection of signatures—not one curve alone—as the phenomenon to be explained.', boundary: 'A calculated electron–phonon coupling constant or gap estimate is not by itself evidence of superconductivity in a real material.' },
    { locator: 'Figs. 14.12–14.17 and 14.24–14.33', visual: 'pairing-gap', section: '§14.2 · quasiparticles, coherence, and thermodynamics', reading: 'Track how pairing reorganizes states near the Fermi surface, opens an excitation gap, and changes occupations, entropy, heat capacity, and density of states.', boundary: 'The simplest isotropic weak-coupling BCS curves are a model limit, not a universal form for anisotropic, multiband, strong-coupling, or unconventional superconductors.' },
    { locator: 'Figs. 14.34–14.53', section: '§§14.3–14.6 · tunneling, spectroscopy, and pairing kernels', reading: 'Use tunneling to relate conductance to quasiparticle DOS, then compare Coulomb and phonon kernels and how energy cutoffs reshape the gap equation.', boundary: 'Spectral inversion and effective kernels depend on junction, broadening, and model assumptions; they do not uniquely determine a microscopic pairing mechanism.' },
  ],
  'chapter-15': [
    { locator: 'Figs. 15.1–15.4', section: '§§15.2–15.4 · elementary responses and spin waves', reading: 'Separate induced orbital current, independent local moments, static ordered arrangements, and a collective twist of the order parameter.', boundary: 'A spin-wave picture presupposes an ordered reference and does not establish that a given material’s moments are rigid or localized.' },
    { locator: 'Figs. 15.6–15.7', section: '§§15.5–15.6 · itinerant order and magnetic impurities', reading: 'Compare exchange-split band populations with a localized impurity screened by conduction electrons, then use susceptibility and resistivity trends to identify the Kondo scale.', boundary: 'A converged spin-polarized branch is not proof of the global magnetic ground state, and mean-field Stoner logic does not capture all local-correlation physics.' },
  ],
  'chapter-16': [
    { locator: 'Figs. 16.3–16.13', section: '§§16.1–16.4 · discrete states, contacts, and charging', reading: 'Follow bulk-like DOS into discrete levels, count transmitting channels between reservoirs, and then add the electrostatic cost for changing an island’s electron number.', boundary: 'Landauer conductance describes coherent transmission under stated contact assumptions; Coulomb blockade requires charging, temperature, and coupling conditions not supplied by an isolated band structure.' },
    { locator: 'Figs. 16.17–16.21', section: '§16.5 · graphene, nanotubes, and excitons', reading: 'Locate graphene’s Dirac points, intersect its Brillouin zone with nanotube-allowed k lines, and then compare optical spectra with and without electron–hole attraction.', boundary: 'The source band in Fig. 16.17 is an LDA Kohn–Sham result; it is not automatically a quasiparticle spectrum. Reduced-dimensional excitons require environment- and screening-aware treatment.' },
    { locator: 'Fig. 16.22', section: '§16.6 · monolayer screening and non-hydrogenic excitons', reading: 'Compare the ab initio GW–BSE level sequence with the fitted two-dimensional hydrogenic series, and use their mismatch to see how nonlocal screening reshapes the neutral spectrum.', boundary: 'The calculated spectrum is method-, substrate-, and dielectric-environment dependent; one monolayer example does not define all quasi-two-dimensional materials.' },
  ],
};

export const getCohenLouieSourceFigures = (slug?: string) => (slug ? sourceFigures[slug] ?? [] : []);
