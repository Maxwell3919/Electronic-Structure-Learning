export const martinCanonicalSource = {
  href: 'https://doi.org/10.1017/9781108555586',
  label: 'Cambridge Core record for the second edition',
};

export type MartinSourceFigureGuide = {
  locator: string;
  section: string;
  reading: string;
  boundary: string;
  visual?: 'bloch-phase';
};

const sourceFigures: Record<string, MartinSourceFigureGuide[]> = {
  'chapter-02': [
    {
      locator: 'Fig. 2.3',
      section: '§2.5 · phase transitions under pressure',
      reading: 'Read energy vertically and volume horizontally, then compare the separate structural branches. The common tangent identifies equal enthalpy at a transition pressure; its contact points are not simply the minima of the two curves.',
      boundary: 'This comparison ranks the structures that were calculated. It does not prove that no lower-energy structure was omitted or include finite-temperature free energies.',
    },
    {
      locator: 'Fig. 2.11',
      section: '§2.9 · phonons',
      reading: 'Follow each branch along the displayed wavevector path and compare calculated curves with experimental points. The figure turns force-constant response into a dispersion rather than a single Γ-point frequency.',
      boundary: 'Agreement on the plotted path is not a full-Brillouin-zone stability proof.',
    },
    {
      locator: 'Figs. 2.22 and 2.25',
      section: '§§2.14–2.15 · charged and optical excitations',
      reading: 'Fig. 2.22 separates sharp independent-particle levels from redistributed quasiparticle weight and satellites. Fig. 2.25 then compares an independent-transition spectrum with interacting response, where oscillator strength can move without the underlying one-particle gap becoming the optical excitation itself.',
      boundary: 'The first figure is schematic, and the second is one material/approximation comparison; neither makes Kohn–Sham eigenvalues general measured excitation energies.',
    },
    {
      locator: 'Fig. 2.27',
      section: '§2.16 · topological insulators',
      reading: 'Compare experiment and calculation on the same energy–momentum axes, first locating the surface-state crossing and then the projected bulk continuum. The useful evidence is the connectivity of the surface branch to the surrounding bulk states.',
      boundary: 'A visually Dirac-like crossing alone is not the bulk topological invariant and remains sensitive to the stated surface and Hamiltonian model.',
    },
  ],
  'chapter-04': [
    {
      locator: 'Fig. 4.1',
      section: '§§4.1–4.2 · real and reciprocal lattices',
      reading: 'Match each real-space primitive vector to the reciprocal vectors defined by their phase relation. Then distinguish an arbitrary primitive parallelogram from the Wigner–Seitz construction whose reciprocal-space version is the first Brillouin zone.',
      boundary: 'The drawing explains geometry; it does not make a reciprocal vector G the same object as a Bloch-state label k.',
    },
    {
      locator: 'Fig. 4.11',
      visual: 'bloch-phase',
      section: '§4.3 · Bloch theorem',
      reading: 'Compare the repeated atomic-scale pattern at k = 0 with the sign/phase change at the zone boundary. What repeats is the cell-periodic structure; the full Bloch state may acquire a phase from one cell to the next.',
      boundary: 'The schematic is a one-dimensional picture of translation character, not a trajectory followed by an electron.',
    },
    {
      locator: 'Fig. 4.12',
      section: '§4.6 · Brillouin-zone integration',
      reading: 'Count the full mesh points, then see how symmetry groups them into fewer inequivalent representatives with weights. Compare the shifted and unshifted grids to see that equal density does not imply the same symmetry reduction.',
      boundary: 'These meshes perform quadrature over the zone; they are not the selected high-symmetry path used to draw a band plot.',
    },
  ],
  'chapter-05': [
    {
      locator: 'Fig. 5.3',
      section: '§5.2 · exchange hole',
      reading: 'Start at zero separation and follow the same-spin deficit outward. The oscillatory tail shows that exchange is a spatial rearrangement required by antisymmetry, not an added classical force.',
      boundary: 'This is the homogeneous-gas exchange hole; its shape is not a universal real-material correlation hole.',
    },
    {
      locator: 'Fig. 5.5',
      section: '§5.3 · pair correlation',
      reading: 'Compare parallel- and antiparallel-spin curves while changing the density parameter. Parallel-spin avoidance already contains the exchange hole; the additional short-range rearrangement with interaction exposes correlation beyond that constraint.',
      boundary: 'The plotted pair distribution is model- and density-dependent and does not define correlation independently of a chosen reference.',
    },
  ],
  'chapter-08': [
    {
      locator: 'Fig. 8.4',
      section: '§§8.2 and 8.4 · exchange and correlation holes',
      reading: 'Notice the different vertical scales before comparing shapes: the exchange hole carries the Pauli exclusion structure, whereas the smaller correlation hole redistributes charge through interaction beyond exchange.',
      boundary: 'Smaller amplitude does not mean exchange–correlation is an optional small correction to the total-energy functional.',
    },
    {
      locator: 'Fig. 8.5',
      section: '§8.4 · why a local approximation can work',
      reading: 'Compare the bond-centered and interstitial cases separately, then compare their spherical averages with LDA. The point is the constrained integrated hole and partial error cancellation, not pointwise reproduction everywhere.',
      boundary: 'Agreement for these Si environments is evidence about this comparison, not a general accuracy guarantee for LDA.',
    },
  ],
  'chapter-11': [
    {
      locator: 'Fig. 11.2',
      section: '§§11.2 and 11.4 · pseudo-wavefunctions',
      reading: 'Locate the core radius, compare the nodal all-electron valence function with each smooth pseudo-function inside it, and confirm that the curves join outside. The pseudo-state removes core oscillations while preserving the exterior scattering information chosen by the construction.',
      boundary: 'Smoothness is a representation choice; it does not mean the real all-electron wavefunction loses its near-core structure.',
    },
    {
      locator: 'Fig. 11.4',
      section: '§§11.5–11.7 · norm conservation and transferability',
      reading: 'Read the radial potentials and functions together with the logarithmic-derivative panel. Matching the value and energy variation near selected reference energies is the transferability test carried by the figure.',
      boundary: 'Agreement at the plotted atomic reference states does not replace validation in the target bonding environment or for the target observable.',
    },
  ],
  'chapter-12': [
    {
      locator: 'Fig. 12.4',
      section: '§12.7 · density on grids',
      reading: 'Follow the arrows from reciprocal-space orbital coefficients to a real-space grid, form the density there, and transform the density back. The figure explains why a plane-wave calculation still uses a real-space grid for local operations.',
      boundary: 'The FFT grid, plane-wave basis, reciprocal-lattice vectors, and Brillouin-zone k sampling are related computational objects but are not interchangeable cutoffs or meshes.',
    },
  ],
  'chapter-14': [
    {
      locator: 'Figs. 14.1 and 14.2',
      section: '§§14.1–14.4 · orbital geometry',
      reading: 'Use the lobe signs and bond axis to classify σ, π, and δ couplings, then watch Fig. 14.2 rotate laboratory p orbitals into bond-aligned components. The geometry, not an arbitrary orbital name, determines which two-center integrals can contribute.',
      boundary: 'These are two-center model relations with a stated sign convention, not proof that an ab initio localized Hamiltonian is transferable between environments.',
    },
    {
      locator: 'Figs. 14.3 and 14.4',
      section: '§§14.5–14.9 · bands and density of states',
      reading: 'In Fig. 14.3 distinguish the full-zone Fermi contour from the selected line used for the band plot. Then use Fig. 14.4 to see how integrating over k discards location and produces dimension-dependent DOS features.',
      boundary: 'The cosine band is a teaching model; real materials need not have this dispersion or these singularities.',
    },
  ],
  'chapter-16': [
    {
      locator: 'Fig. 16.1',
      section: '§16.1 · augmented representations',
      reading: 'Identify the atom-centered spheres and the interstitial before looking at any basis formula. Augmentation uses different efficient representations in those regions and joins them into one state.',
      boundary: 'Partitioning space into spheres is more general than the historical muffin-tin shape approximation for the potential.',
    },
    {
      locator: 'Fig. 16.2',
      section: '§§16.1–16.2 · APW matching',
      reading: 'Compare the plane-wave piece between spheres with the radial solution inside, and inspect what is continuous at each boundary. The energy-dependent radial solution is why the original APW secular problem is nonlinear in energy.',
      boundary: 'A single augmented basis function may have derivative mismatch; the final variational combination, not one basis function, approximates the physical Bloch state.',
    },
  ],
  'chapter-18': [
    {
      locator: 'Fig. 18.1',
      section: '§§18.2–18.4 · locality and sparse Hamiltonians',
      reading: 'Start from one central region and count only the neighboring regions connected to it. If that local neighborhood remains bounded as the total system grows, the Hamiltonian can be sparse and local work can scale linearly.',
      boundary: 'The picture assumes a localization range chosen for an accuracy target; it does not guarantee O(N) efficiency for metals at zero temperature or for every finite system size.',
    },
  ],
  'chapter-20': [
    {
      locator: 'Fig. 20.1',
      section: '§20.2 · frozen phonons',
      reading: 'Relate the displacement pattern in the commensurate supercell to the wavevector on the dispersion. Each pattern samples one collective coordinate; changing the supercell changes which wavelengths can be represented.',
      boundary: 'One finite displacement is one energy/force sample. Harmonic derivatives require an amplitude check, and anharmonic mapping requires more than one sampled geometry.',
    },
    {
      locator: 'Fig. 20.3',
      section: '§20.6 · phonon dispersions in metals',
      reading: 'Compare calculation and experiment branch by branch, then locate the dips in Pb and Nb. Their position in q space is the clue that electronic screening and Fermi-surface structure influence particular lattice perturbations.',
      boundary: 'A dip or large electron–phonon response is not by itself evidence of a superconducting transition, and a plotted path is not all q space.',
    },
  ],
  'chapter-21': [
    {
      locator: 'Fig. 21.5',
      section: '§§21.4, 21.8–21.9 · interacting optical response',
      reading: 'First locate the independent-particle onset, then compare how the response kernels redistribute oscillator strength and whether bound peaks appear below the charged gap. The panels isolate the roles of the starting spectrum and electron–hole attraction.',
      boundary: 'A better-looking spectrum for one functional does not make Kohn–Sham energy differences general optical excitations.',
    },
    {
      locator: 'Fig. 21.6',
      section: '§§21.6 and 21.8 · real-time response',
      reading: 'Compare a rapidly decaying current with a long-lived oscillation, then connect their Fourier transforms to broad and sharp spectral features in Fig. 21.5. The time-domain signal and frequency-domain spectrum are two organizations of the same calculated response.',
      boundary: 'Finite propagation time and damping broaden peaks numerically; that broadening must not be read automatically as a physical lifetime.',
    },
  ],
  'chapter-23': [
    {
      locator: 'Fig. 23.1',
      section: '§23.1 · Bloch-to-Wannier transformation',
      reading: 'Compare the extended Bloch patterns of Chapter 4 with translated localized functions centered in different cells. The transformation reorganizes one band subspace; it does not change the span of states represented.',
      boundary: 'A Wannier center and shape depend on gauge choices even when gauge-invariant subspace observables remain fixed.',
    },
    {
      locator: 'Fig. 23.5',
      section: '§§23.5–23.7 · disentanglement and interpolation',
      reading: 'Compare the interpolated bands with the original bands inside and outside the chosen energy window, then inspect the separate d-like subspace and its complement. Accuracy follows the selected subspace and windows, not the orbital labels alone.',
      boundary: 'Agreement along the shown path does not prove the interpolation is converged over the entire Brillouin zone or for an unshown observable.',
    },
  ],
  'chapter-24': [
    {
      locator: 'Figs. 24.1 and 24.2',
      section: '§24.2 · why bulk polarization is difficult',
      reading: 'Fig. 24.1 separates a finite dipole from the surface-dependent large-system limit. Fig. 24.2 then assigns the same periodic charge pattern to different cells, showing why absolute cell dipoles differ while a continuous change can remain well defined.',
      boundary: 'The ambiguity is not a numerical error that can be removed by choosing a prettier unit cell; it is the reason polarization is branch-valued.',
    },
    {
      locator: 'Fig. 24.4',
      section: '§§24.3–24.5 · Berry phase and transported charge',
      reading: 'Follow the loop in k for each adiabatic parameter, then track the phase and corresponding Wannier-center displacement. A winding phase signals an integer transported charge when the path closes.',
      boundary: 'Endpoint phases are defined modulo 2π, so branch continuity along the insulating path is essential.',
    },
  ],
  'chapter-25': [
    {
      locator: 'Fig. 25.2',
      section: '§§25.4–25.5 · Chern number as winding',
      reading: 'Read the Brillouin-zone cylinder, the Berry phase as a second circular coordinate, and the Wannier-center shift as three views of the same winding. Compare the C = 0 and C = 1 rows before attaching a material label.',
      boundary: 'The integer belongs to a specified occupied subspace that remains gapped along the construction; a single band inversion is not the invariant.',
    },
  ],
  'chapter-26': [
    {
      locator: 'Fig. 26.5',
      section: '§§26.3–26.5 · winding of a two-band Hamiltonian',
      reading: 'Trace h(k) as k runs through the zone and ask whether the loop surrounds the origin. The origin is where the two-band gap would close, so encircling it distinguishes the two gapped classes in this model.',
      boundary: 'Winding depends on the model’s symmetry and occupied subspace; a similar-looking loop in another Hamiltonian needs its own invariant and gap conditions.',
    },
    {
      locator: 'Fig. 26.8',
      section: '§26.6 · quantized pumping',
      reading: 'Relate the in-gap end-state crossings of the finite chain to the motion of bulk Wannier centers through one cycle. The boundary spectral flow and bulk transported charge are complementary views of the same pump.',
      boundary: 'Finite-chain details can shift individual edge levels without changing the quantized cycle while the bulk gap remains open.',
    },
  ],
  'chapter-27': [
    {
      locator: 'Fig. 27.5',
      section: '§27.4 · the two-dimensional Z₂ distinction',
      reading: 'Count surface-band crossings between the two time-reversal-invariant momenta, focusing on odd versus even connectivity rather than the exact curve shapes. An odd connection cannot be removed without breaking the protecting conditions or closing the bulk gap.',
      boundary: 'The drawing is a connectivity criterion, not a prediction of a universal surface dispersion or zero resistance in a finite device.',
    },
  ],
  'chapter-28': [
    {
      locator: 'Fig. 28.1',
      section: '§28.1 · three-dimensional Z₂ phases',
      reading: 'Compare the sign patterns at the eight time-reversal-invariant momenta, then project them onto a surface. The robust strong phase is identified by the global pattern and its odd surface connectivity, not by one isolated sign.',
      boundary: 'The parity shortcut requires inversion symmetry; the phase also depends on the specified filling, gap, spin–orbit, magnetic, and structural model.',
    },
    {
      locator: 'Fig. 28.7',
      section: '§§28.4–28.5 · Weyl semimetals and Fermi arcs',
      reading: 'Follow a small enclosing surface around one Weyl node, project it onto the surface Brillouin zone, and watch the boundary crossing trace an open arc as the loop expands. The arc terminates where the surface projection meets bulk nodes.',
      boundary: 'An open-looking surface contour alone does not establish a Weyl phase; the bulk node, chirality, projection, and boundary termination all matter.',
    },
  ],
  'appendix-p': [
    {
      locator: 'Fig. P.1',
      section: '§P.2 · discrete Berry phase',
      reading: 'Follow the ordered overlaps around the path and note that the product closes the gauge-dependent endpoint phases into one phase modulo 2π. This is the discrete object used on an actual mesh.',
      boundary: 'Individual state phases and individual link phases are gauge dependent; only the closed product or equivalent invariant has the intended meaning.',
    },
    {
      locator: 'Fig. P.2',
      section: '§P.3 · curvature and flux',
      reading: 'Orient the boundary loop and the enclosed surface together. Stokes’ relation converts the connection integrated around the loop into curvature flux through the surface.',
      boundary: 'A local gauge singularity can move under a phase choice; the closed-loop phase and properly integrated curvature are the stable objects.',
    },
  ],
  'appendix-q': [
    {
      locator: 'Fig. Q.1',
      section: '§Q.1 · bulk and edge currents',
      reading: 'See how circulating currents cancel between neighboring filled bulk orbits but leave an uncancelled current at the boundary. The edge is where the confining potential prevents the cancellation from completing.',
      boundary: 'This is the Landau-level quantum Hall construction; a Chern insulator reaches analogous chiral boundary transport without the same microscopic magnetic-field picture.',
    },
    {
      locator: 'Fig. Q.2',
      section: '§Q.2 · chiral edge dispersion',
      reading: 'Read the slope as the one-way group velocity and combine it with the one-dimensional density of states. Their cancellation leaves a channel conductance determined by the occupied energy interval rather than the detailed curve shape.',
      boundary: 'The heuristic channel calculation explains the conductance quantum; exact plateau quantization also relies on the bulk topological setting and transport assumptions.',
    },
  ],
};

export const getMartinSourceFigures = (slug?: string): MartinSourceFigureGuide[] =>
  slug ? sourceFigures[slug] ?? [] : [];
