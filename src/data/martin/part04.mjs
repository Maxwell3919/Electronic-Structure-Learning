const rawUnits = [["12","Plane Waves and Grids: Basics","chapter-12-plane-waves-and-grids-basics",262,[["12.1","The Independent-Particle Schrödinger Equation in a Plane Wave Basis",262],["12.2","Bloch Theorem and Electron Bands",264],["12.3","Nearly-Free-Electron Approximation",265],["12.4","Form Factors and Structure Factors",267],["12.5","Approximate Atomic-Like Potentials",269],["12.6","Empirical Pseudopotential Method (EPM)",270],["12.7","Calculation of Electron Density: Introduction of Grids",272],["12.8","Real-Space Methods I: Finite Difference and Discontinuous Galerikin Methods",274],["12.9","Real-Space Methods II: Multiresolution Methods",277]],280],["13","Plane Waves and Real-Space Methods: Full Calculations","chapter-13-plane-waves-and-real-space-methods-full-calculations",283,[["13.1","Ab initio Pseudopotential Method",284],["13.2","Approach to Self-Consistency and Dielectric Screening",286],["13.3","Projector Augmented Waves (PAWs)",287],["13.4","Hybrid Functionals and Hartree–Fock in Plane Wave Methods",288],["13.5","Supercells: Surfaces, Interfaces, Molecular Dynamics",289],["13.6","Clusters and Molecules",292],["13.7","Applications of Plane Wave and Grid Methods",292]],293],["14","Localized Orbitals: Tight-Binding","chapter-14-localized-orbitals-tight-binding",295,[["14.1","Localized Atom-Centered Orbitals",296],["14.2","Matrix Elements with Atomic-Like Orbitals",297],["14.3","Spin–Orbit Interaction",301],["14.4","Slater–Koster Two-Center Approximation",302],["14.5","Tight-Binding Bands: Example of a Single s Band",303],["14.6","Two-Band Models",305],["14.7","Graphene",306],["14.8","Nanotubes",308],["14.9","Square Lattice and CuO2 Planes",310],["14.10","Semiconductors and Transition Metals",311],["14.11","Total Energy, Force, and Stress in Tight-Binding",312],["14.12","Transferability: Nonorthogonality and Environment Dependence",315]],317],["15","Localized Orbitals: Full Calculations","chapter-15-localized-orbitals-full-calculations",320,[["15.1","Solution of Kohn–Sham Equations in Localized Bases",320],["15.2","Analytic Basis Functions: Gaussians",322],["15.3","Gaussian Methods: Ground-State and Excitation Energies",324],["15.4","Numerical Orbitals",324],["15.5","Localized Orbitals: Total Energy, Force, and Stress",327],["15.6","Applications of Numerical Local Orbitals",329],["15.7","Green’s Function and Recursion Methods",329],["15.8","Mixed Basis",330]],331],["16","Augmented Functions: APW, KKR, MTO","chapter-16-augmented-functions-apw-kkr-mto",332,[["16.1","Augmented Plane Waves (APWs) and “Muffin Tins”",332],["16.2","Solving APW Equations: Examples",337],["16.3","The KKR or Multiple-Scattering Theory (MST) Method",342],["16.4","Alloys and the Coherent Potential Approximation (CPA)",349],["16.5","Muffin-Tin Orbitals (MTOs)",350],["16.6","Canonical Bands",352],["16.7","Localized “Tight-Binding,” MTO, and KKR Formulations",358],["16.8","Total Energy, Force, and Pressure in Augmented Methods",360]],362],["17","Augmented Functions: Linear Methods","chapter-17-augmented-functions-linear-methods",365,[["17.1","Linearization of Equations and Linear Methods",365],["17.2","Energy Derivative of the Wavefunction: ψ and ψ̇",366],["17.3","General Form of Linearized Equations",368],["17.4","Linearized Augmented Plane Waves (LAPWs)",370],["17.5","Applications of the LAPW Method",372],["17.6","Linear Muffin-Tin Orbital (LMTO) Method",375],["17.7","Tight-Binding Formulation",379],["17.8","Applications of the LMTO Method",379],["17.9","Beyond Linear Methods: NMTO",381],["17.10","Full Potential in Augmented Methods",383]],385],["18","Locality and Linear-Scaling O(N) Methods","chapter-18-locality-and-linear-scaling-o-n-methods",386,[["18.1","What Is the Problem?",386],["18.2","Locality in Many-Body Quantum Systems",388],["18.3","Building the Hamiltonian",390],["18.4","Solution of Equations: Nonvariational Methods",391],["18.5","Variational Density Matrix Methods",400],["18.6","Variational (Generalized) Wannier Function Methods",402],["18.7","Linear-Scaling Self-Consistent Density Functional Calculations",405],["18.8","Factorized Density Matrix for Large Basis Sets",406],["18.9","Combining the Methods",407]],408]];

export const part04 = {
  number: 4,
  roman: "IV",
  title: "Determination of Electronic Structure: The Basic Methods",
  titleZh: "电子结构的基本求解方法",
  label: "Part IV · Determination of Electronic Structure: The Basic Methods",
  slug: "part-04-determination-of-electronic-structure",
  overview: {"title":"Overview of Chapters 12–18","page":259},
  units: rawUnits.map(([id, title, slug, page, sections, exercisesPage]) => ({
    id: String(id),
    title,
    slug,
    page,
    label: `${4 === 7 ? 'Appendix' : 'Chapter'} ${id} · ${title}`,
    sections: sections.map(([sectionId, sectionTitle, sectionPage]) => ({
      id: sectionId,
      title: sectionTitle,
      page: sectionPage,
    })),
    exercisesPage,
  })),
};

export default part04;
