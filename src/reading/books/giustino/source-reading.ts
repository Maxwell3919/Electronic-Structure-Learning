export const giustinoCanonicalSource = {
  href: 'https://global.oup.com/academic/product/materials-modelling-using-density-functional-theory-9780199662449',
  label: 'Oxford University Press record for the book',
};

export type GiustinoSourceGuide = {
  locator: string;
  section: string;
  reading: string;
  boundary: string;
};

const sourceGuides: Record<string, GiustinoSourceGuide[]> = {
  'chapter-01': [
    { locator: 'Figs. 1.2–1.4', section: '§1.2 · structure, superconductivity, and phase examples', reading: 'Identify the calculated object in each example before reading the agreement: an atomistic structure and X-ray absorption spectrum, an electron–phonon-informed heat capacity, and competing free-energy branches under pressure.', boundary: 'The panels do not show that one ground-state DFT run directly returns an X-ray spectrum, superconducting heat capacity, or finite-temperature phase diagram; each result adds theory and post-processing.' },
    { locator: 'Figs. 1.5–1.7', section: '§§1.2.4–1.5 · scale bridging and emergence', reading: 'Follow where the electronic calculation hands information to a fracture model, a catalyst-screening descriptor, or a higher-scale structural argument. Ask which variables disappear at each handoff.', boundary: 'A first-principles input does not make every later layer parameter-free or guarantee that emergent organization follows from brute-force electronic calculation.' },
  ],
  'chapter-02': [
    { locator: 'Eqs. 2.19, 2.28, and 2.42', section: '§§2.2–2.6 · the interacting problem and determinant restriction', reading: 'First count the kinetic and Coulomb terms in the full Hamiltonian, then compare the joint wavefunction with the antisymmetric determinant built from one-particle orbitals.', boundary: 'Antisymmetry is exact for fermions, but one determinant is a restricted state class and does not contain general correlation.' },
    { locator: 'Fig. 2.1 and Eqs. 2.48–2.66', section: '§§2.7–2.9 · mean fields and helium', reading: 'Use the helium radial distribution to see what a smooth effective field captures, then compare which terms in the Hartree, Hartree–Fock, and heuristic Kohn–Sham equations depend on the orbitals or density.', boundary: 'The plotted radial quantity integrates to electron number; it is not a normalized one-electron probability unless divided by that number. Chapter 2 anticipates Kohn–Sham equations but does not yet supply their density-functional proof.' },
  ],
  'chapter-03': [
    { locator: 'Eqs. 3.3–3.13', section: '§§3.1–3.2 · density, Hohenberg–Kohn, and Kohn–Sham', reading: 'Track the change of object: an energy functional of density, a ground-state minimum, then auxiliary orbitals used to represent density and kinetic energy. Keep the universal and external-potential terms separate.', boundary: 'The original Hohenberg–Kohn potential theorem is not identical to later constrained-search formulations, and the theorem alone does not provide the unknown functional.' },
    { locator: 'Figs. 3.1–3.3', section: '§§3.3–3.4 · electron gas, LDA, and self-consistency', reading: 'Compare uniform-gas exchange and correlation first, then inspect how a local density samples those data and why an output density must be returned to the potential.', boundary: 'LDA is one approximation to exchange–correlation, while SCF is a nonlinear solution procedure. Neither defines DFT itself.' },
  ],
  'chapter-04': [
    { locator: 'Figs. 4.1–4.2 and Eqs. 4.4–4.13', section: '§§4.1–4.2 · adiabatic surface and force', reading: 'Use the mass-localization comparison to motivate time-scale separation, then follow fixed nuclear coordinates into an electronic energy and finally into the total potential-energy surface whose slope is the force.', boundary: 'The nuclei do not disappear. Nonadiabatic transitions and nuclear quantum effects lie outside the stated classical adiabatic treatment.' },
    { locator: 'Figs. 4.3–4.4', section: '§§4.3–4.4 · force decomposition and structure search', reading: 'Separate nucleus–nucleus and electron-mediated contributions, then follow how repeated force evaluations move a geometry toward a stationary point.', boundary: 'Hellmann–Feynman forces require the stated variational and representation conditions; basis dependence can add Pulay terms, and a zero-force point need not be the global minimum.' },
  ],
  'chapter-05': [
    { locator: 'Figs. 5.1–5.3', section: '§§5.1–5.3 · molecules, crystals, and diffraction', reading: 'Compare the N₂ binding and Si cohesive-energy curves, then connect crystal periodicity to the reciprocal-space peaks used by X-ray diffraction. Locate the declared isolated-atom references before reading energy depths.', boundary: 'Close bond lengths do not validate dissociation energies; a periodic supercell represents repeated images, and a candidate energy minimum is conditional on the phases actually tested.' },
    { locator: 'Figs. 5.4–5.8', section: '§§5.4–5.5 · surfaces, reconstruction, and STM', reading: 'Follow the cell from a carbon chain to a silicon surface reconstruction, then compare the measured tunnelling contrast with the simulated electronic map used to identify the structure.', boundary: 'STM contrast is not a direct photograph of nuclear coordinates or a unique charge-density surface. It depends on bias, states, tip model, and tunnelling approximation.' },
  ],
  'chapter-06': [
    { locator: 'Figs. 6.1–6.4', section: '§§6.1–6.4 · strain, energy curvature, and elastic constants', reading: 'Identify the applied deformation before reading a curve. The slope gives stress and the local curvature gives a symmetry-dependent elastic response; different distortions isolate different tensor combinations.', boundary: 'A locally positive elastic curvature does not establish a global phase minimum, finite-temperature stability, or resistance to every finite deformation.' },
    { locator: 'Figs. 6.5–6.6 and Table 6.1', section: '§6.7 · extreme-pressure example', reading: 'Connect seismic wave velocities to elastic constants, then read the enthalpy crossing together with the perovskite and post-perovskite structures. The table supplies the response quantities used in that physical interpretation.', boundary: 'The comparison is pressure- and candidate-dependent. Agreement in selected elastic data does not make a chosen XC approximation uniformly predictive under all extreme conditions.' },
  ],
  'chapter-07': [
    { locator: 'Figs. 7.1–7.3', section: '§§7.1–7.3 · harmonic expansion and molecular modes', reading: 'Zoom from the full N₂ potential to the thermally sampled neighborhood, then trace how the Hessian and masses turn coupled Cartesian displacements into collective eigenvectors.', boundary: 'The parabolic model is local. Large-amplitude, anharmonic, rotating, or nonadiabatic motion requires additional terms.' },
    { locator: 'Figs. 7.4–7.5', section: '§7.4 · crystal waves and dispersion', reading: 'Follow the phase of one displacement through repeated cells and compare the nearest-neighbor model dispersion with the full DFT result. Look for what changes when force constants extend farther than one bond.', boundary: 'A displayed high-symmetry q path is not the full Brillouin zone, and a nearest-neighbor chain is a teaching limit rather than a universal phonon model.' },
  ],
  'chapter-08': [
    { locator: 'Figs. 8.1–8.3 and Table 8.1', section: '§8.1 · Raman and neutron probes', reading: 'For Raman, identify the elastic line, shifted sidebands, and activity condition. For neutron scattering, track both transferred momentum and energy before comparing measured and calculated dispersions.', boundary: 'A mode can exist yet be dark to a chosen probe. Raman mainly samples near Γ at first order, whereas one displayed neutron path does not prove full-zone stability.' },
    { locator: 'Figs. 8.4–8.8', section: '§§8.2–8.5 · phonons, DOS, and free energy', reading: 'Move from the molecular vibrational eigenproblem to oscillator levels and phonon occupations, then compare a dispersion with its DOS and finally the competing Gibbs-energy surfaces that define a phase boundary.', boundary: 'A phonon DOS forgets q-space location; harmonic or quasiharmonic free energies omit strong anharmonicity and do not turn zero-temperature electronic energy into a complete phase diagram by themselves.' },
  ],
  'chapter-09': [
    { locator: 'Figs. 9.1–9.2', section: '§§9.1–9.2 · Bloch states and band plots', reading: 'Separate the periodic cell function from its Bloch phase, then locate the sampled k path and the occupied boundary before interpreting copper bands and orbital character.', boundary: 'Bloch structure follows periodicity before DFT enters; a symmetry path is a visualization slice, not full-zone integration or proof of all extrema.' },
    { locator: 'Figs. 9.3–9.7', section: '§§9.3–9.5 · ARPES, filling, and gaps', reading: 'Map detector angle and kinetic energy to the charged-removal spectrum, then compare measured dispersions with Kohn–Sham bands and distinguish metal filling from the various gap definitions.', boundary: 'Kohn–Sham eigenvalues are not general quasiparticle energies. A Kohn–Sham gap is neither automatically the fundamental charged gap nor an optical excitation energy.' },
  ],
  'chapter-10': [
    { locator: 'Figs. 10.1–10.3', section: '§§10.1–10.2 · driven atom and complex dielectric response', reading: 'Follow the induced electron displacement, resonant transition, and phase lag. Then read real and imaginary dielectric components as dispersion and dissipation, not as two unrelated material constants.', boundary: 'The hydrogen lattice is a model used to expose response structure. Its oscillator picture is not a quantitative dielectric theory for arbitrary solids.' },
    { locator: 'Figs. 10.4–10.6', section: '§§10.3–10.4 · calculated spectra and missing interactions', reading: 'Identify the occupied-to-empty transition energies and dipole matrix elements that build the independent-particle spectrum, then inspect how electron–hole attraction and phonon assistance change onsets and peaks.', boundary: 'Agreement after a scissor shift or broadening does not prove the underlying excitation theory. Optical spectra describe neutral response and cannot be inferred from a KS gap alone.' },
  ],
  'chapter-11': [
    { locator: 'Fig. 11.1 and Table 11.1', section: '§§11.1–11.5 · spinors, densities, and exchange', reading: 'Use Figure 11.1 to separate a chosen quantization axis from a physical magnetic texture, follow the equations into charge and spin densities, and then use Table 11.1 to connect exchange symmetry with singlet and triplet states.', boundary: 'Collinear up/down labels are a restricted model. Scalar relativity, spin polarization, noncollinearity, and spin–orbit coupling are separate choices.' },
    { locator: 'Figs. 11.2–11.4 and Table 11.2', section: '§11.6 · H₂, Fe, and MnO', reading: 'Use Table 11.2 to distinguish spin-unpolarized, collinear, and noncollinear representations. Then follow the H₂ branch comparison into spin-resolved Fe DOS and competing FM and AFM MnO structures.', boundary: 'One initialized branch does not prove the global magnetic ground state. LDA-level agreement for selected moments does not remove the strong-correlation problem or validate a predicted ordering temperature.' },
  ],
  'appendix-a': [
    { locator: 'Eqs. A.1–A.19', section: 'Appendix A · determinant variation', reading: 'Track the restriction first: the trial state is one determinant. Then identify direct and exchanged Coulomb products, impose orbital orthonormality, and watch the multiplier matrix become canonical orbital eigenvalues.', boundary: 'The derivation establishes the stationary single-determinant equations. It does not add the many-determinant correlation missing from that state class.' },
  ],
  'appendix-b': [
    { locator: 'Eqs. B.1–B.11', section: 'Appendix B · density-functional variation', reading: 'Begin with the Kohn–Sham energy decomposition, replace density by an orbital sum, and follow the constrained functional derivative until a common local effective potential appears.', boundary: 'The orbital variation is the Kohn–Sham construction, not the original Hohenberg–Kohn theorem, and it presumes the auxiliary representation required by the construction.' },
  ],
  'appendix-c': [
    { locator: 'Figs. C.1–C.2 and Eqs. C.5–C.11', section: 'Appendix C · boundary conditions and real-space grids', reading: 'Identify what the computational cell repeats, then follow finite differences from neighboring grid values into a sparse matrix eigenproblem.', boundary: 'A large box can reduce image overlap without proving that electrostatic image effects are absent; grid refinement is only one numerical error source.' },
    { locator: 'Eqs. C.12–C.24', section: 'Appendix C · plane waves and atomic orbitals', reading: 'Compare the unknown coefficients in the Fourier and localized expansions. Note why the plane-wave kinetic cutoff truncates reciprocal components and why localized nonorthogonality creates an overlap matrix.', boundary: 'Representation choice is not XC choice or core treatment. A converged cutoff or localized basis does not validate the physical model or every observable.' },
  ],
  'appendix-d': [
    { locator: 'Figs. D.1–D.2 and Eqs. D.1–D.6', section: 'Appendix D · dual lattices and selected paths', reading: 'Construct G from the dual primitive vectors and verify that its phase on every direct translation is unity. Then compare the full two-dimensional band surfaces with the one-dimensional Γ–K–M–Γ slice.', boundary: 'G and k are different objects even though both occupy reciprocal space. The plotted band path omits off-path extrema and cannot replace Brillouin-zone quadrature.' },
  ],
  'appendix-e': [
    { locator: 'Figs. E.1–E.2', section: 'Appendix E · core separation and pseudization', reading: 'Compare core and valence radial extent, then inspect the nodes that make an all-electron valence state expensive on a coarse grid. Check where pseudo and all-electron functions are required to match.', boundary: 'Core/valence division is a controlled choice, not a unique periodic-table label; semicore states can become chemically relevant.' },
    { locator: 'Fig. E.3 and Eqs. E.1–E.4', section: 'Appendix E · ionic channels and nonlocality', reading: 'Follow inversion of the radial equation into a smooth channel potential, then see how separate angular-momentum channels are assembled into a nonlocal ionic operator.', boundary: 'Atomic matching does not establish transferability. Dataset provenance and system- and observable-specific validation remain necessary.' },
  ],
};

export const getGiustinoSourceGuides = (slug?: string) => (slug ? sourceGuides[slug] ?? [] : []);
